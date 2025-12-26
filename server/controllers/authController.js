const supabase = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if user exists
        const { data: existing } = await supabase.from('users').select('id').eq('email', email);
        if (existing && existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('users')
            .insert({ username, email, password: hashedPassword, role: 'learner', points: 0 })
            .select('id, username, email, role')
            .single();

        if (error) throw error;

        const token = jwt.sign({ id: data.id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '7d' });

        res.status(201).json({ success: true, user: data, token });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }

        const { data: users, error } = await supabase.from('users').select('*').eq('email', email);
        if (error) throw error;
        if (!users || users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const effectiveRole = user.id === 1 ? 'super_admin' : user.role;
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '7d' });

        res.json({
            success: true,
            user: { id: user.id, username: user.username, email: user.email, role: effectiveRole },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, username, email, role, points')
            .eq('id', req.user.id);

        if (error) throw error;
        if (!users || users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = users[0];
        user.role = user.id === 1 ? 'super_admin' : user.role;

        res.json({ success: true, user });
    } catch (err) {
        console.error('GetMe error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
