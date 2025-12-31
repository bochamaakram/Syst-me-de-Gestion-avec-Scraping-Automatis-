const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

/**
 * GET /api/categories
 * Get all categories
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;

        res.json({
            success: true,
            categories: data
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
