/**
 * Supabase Database Query Helper
 * Provides a simpler interface for database operations
 */
const supabase = require('./database');

/**
 * Execute database query using Supabase client
 */
const query = async (sql, params = []) => {
    const queryType = sql.trim().split(/\s+/)[0].toUpperCase();

    try {
        if (queryType === 'SELECT') {
            return await handleSelect(sql, params);
        } else if (queryType === 'INSERT') {
            return await handleInsert(sql, params);
        } else if (queryType === 'UPDATE') {
            return await handleUpdate(sql, params);
        } else if (queryType === 'DELETE') {
            return await handleDelete(sql, params);
        }
        return [[], { rowCount: 0 }];
    } catch (err) {
        console.error('DB Query Error:', err.message);
        throw err;
    }
};

// Extract table name from SQL
function getTable(sql) {
    const m = sql.match(/FROM\s+(\w+)/i) || sql.match(/INTO\s+(\w+)/i) || sql.match(/UPDATE\s+(\w+)/i);
    return m ? m[1] : null;
}

// Parse SELECT columns
function getSelectColumns(sql) {
    const match = sql.match(/SELECT\s+(.+?)\s+FROM/i);
    if (!match) return '*';
    const cols = match[1].trim();
    if (cols === '*') return '*';
    // For Supabase, we just use * and filter results later if needed
    return '*';
}

// Handle SELECT
async function handleSelect(sql, params) {
    const table = getTable(sql);
    if (!table) return [[], {}];

    let q = supabase.from(table).select('*');

    // Parse WHERE conditions - only if there are ? params
    if (params.length > 0) {
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|\s+GROUP|\s*$)/i);
        if (whereMatch) {
            let paramIdx = 0;
            // Find all column = ? patterns
            const regex = /(\w+)\s*=\s*\?/g;
            let match;
            while ((match = regex.exec(whereMatch[1])) !== null) {
                if (paramIdx < params.length) {
                    q = q.eq(match[1], params[paramIdx]);
                    paramIdx++;
                }
            }
        }
    }

    // Handle ORDER BY (without params)
    const orderMatch = sql.match(/ORDER\s+BY\s+(\w+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
        q = q.order(orderMatch[1], { ascending: orderMatch[2]?.toUpperCase() !== 'DESC' });
    }

    // Handle LIMIT
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
        q = q.limit(parseInt(limitMatch[1]));
    }

    // Handle OFFSET
    const offsetMatch = sql.match(/OFFSET\s+(\d+)/i);
    if (offsetMatch) {
        q = q.range(parseInt(offsetMatch[1]), parseInt(offsetMatch[1]) + (limitMatch ? parseInt(limitMatch[1]) : 100) - 1);
    }

    const { data, error } = await q;
    if (error) throw error;
    return [data || [], { rowCount: data?.length || 0 }];
}

// Handle INSERT
async function handleInsert(sql, params) {
    const table = getTable(sql);
    if (!table) return [[], { insertId: null }];

    // Parse columns from INSERT INTO table (col1, col2, col3) VALUES (?, ?, ?)
    const colMatch = sql.match(/\(([^)]+)\)\s*VALUES/i);
    if (!colMatch) return [[], { insertId: null }];

    const cols = colMatch[1].split(',').map(c => c.trim());

    // Build record from columns and params
    const record = {};
    for (let i = 0; i < cols.length; i++) {
        if (i < params.length) {
            record[cols[i]] = params[i];
        }
    }

    // Handle INSERT IGNORE
    const isIgnore = sql.match(/IGNORE/i);

    const { data, error } = await supabase.from(table).insert(record).select('id');

    // Ignore duplicate errors
    if (error && isIgnore && (error.code === '23505' || error.message.includes('duplicate'))) {
        return [[], { insertId: null, rowCount: 0 }];
    }
    if (error) throw error;

    const insertId = data?.[0]?.id || null;
    return [data || [], { insertId, rowCount: data?.length || 0 }];
}

// Handle UPDATE
async function handleUpdate(sql, params) {
    const table = getTable(sql);
    if (!table) return [[], { rowCount: 0 }];

    const setMatch = sql.match(/SET\s+(.+?)\s+WHERE/i);
    const whereMatch = sql.match(/WHERE\s+(.+?)$/i);

    if (!setMatch) return [[], { rowCount: 0 }];

    // Count ? in SET clause to know how many params are for SET
    const setClause = setMatch[1];
    const setParamCount = (setClause.match(/\?/g) || []).length;

    // Parse SET columns
    const updates = {};
    let paramIdx = 0;
    const regex = /(\w+)\s*=\s*\?/g;
    let match;
    while ((match = regex.exec(setClause)) !== null) {
        if (paramIdx < params.length) {
            updates[match[1]] = params[paramIdx];
            paramIdx++;
        }
    }

    let q = supabase.from(table).update(updates);

    // Parse WHERE
    if (whereMatch) {
        const whereRegex = /(\w+)\s*=\s*\?/g;
        let whereMatch2;
        while ((whereMatch2 = whereRegex.exec(whereMatch[1])) !== null) {
            if (paramIdx < params.length) {
                q = q.eq(whereMatch2[1], params[paramIdx]);
                paramIdx++;
            }
        }
    }

    const { error } = await q;
    if (error) throw error;
    return [[], { rowCount: 1 }];
}

// Handle DELETE
async function handleDelete(sql, params) {
    const table = getTable(sql);
    if (!table) return [[], { rowCount: 0 }];

    const whereMatch = sql.match(/WHERE\s+(.+?)$/i);
    if (!whereMatch) return [[], { rowCount: 0 }];

    let q = supabase.from(table).delete();

    const regex = /(\w+)\s*=\s*\?/g;
    let match;
    let paramIdx = 0;
    while ((match = regex.exec(whereMatch[1])) !== null) {
        if (paramIdx < params.length) {
            q = q.eq(match[1], params[paramIdx]);
            paramIdx++;
        }
    }

    const { error } = await q;
    if (error) throw error;
    return [[], { rowCount: 1 }];
}

// Connection wrapper
const getConnection = async () => {
    return {
        query,
        beginTransaction: async () => { },
        commit: async () => { },
        rollback: async () => { },
        release: () => { }
    };
};

module.exports = { query, getConnection };
