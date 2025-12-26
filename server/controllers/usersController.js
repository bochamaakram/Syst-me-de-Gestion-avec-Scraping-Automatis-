const supabase = require('../config/database');

// Helper: Check if user ID 1 is super_admin
const isSuperAdmin = (userId) => parseInt(userId) === 1;

// Helper: Get effective role
const getEffectiveRole = async (userId) => {
    if (isSuperAdmin(userId)) return 'super_admin';
    const { data: users } = await supabase.from('users').select('role').eq('id', userId);
    return users?.[0]?.role || 'learner';
};

exports.getEffectiveRole = getEffectiveRole;

// Get all users (super_admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const role = await getEffectiveRole(req.user.id);
        if (role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
        }

        const { data: allUsers, error } = await supabase
            .from('users')
            .select('id, username, email, role, created_at')
            .order('id', { ascending: true });

        if (error) throw error;

        const usersWithRoles = allUsers.map(u => ({
            ...u,
            role: isSuperAdmin(u.id) ? 'super_admin' : u.role
        }));

        res.json({ success: true, users: usersWithRoles });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update user role (super_admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const targetUserId = req.params.id;

        const requesterRole = await getEffectiveRole(req.user.id);
        if (requesterRole !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
        }

        if (isSuperAdmin(targetUserId)) {
            return res.status(400).json({ success: false, message: 'Cannot change the main admin role' });
        }

        if (!['learner', 'teacher'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const { error } = await supabase.from('users').update({ role }).eq('id', targetUserId);
        if (error) throw error;

        res.json({ success: true, message: 'Role updated' });
    } catch (err) {
        console.error('Update role error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get my role
exports.getMyRole = async (req, res) => {
    try {
        const role = await getEffectiveRole(req.user.id);
        res.json({ success: true, role });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
