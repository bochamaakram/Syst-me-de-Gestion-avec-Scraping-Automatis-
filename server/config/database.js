require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_KEY in .env');
} else {
    console.log('✅ Supabase client initialized');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
