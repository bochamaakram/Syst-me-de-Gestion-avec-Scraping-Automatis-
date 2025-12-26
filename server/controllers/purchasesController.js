const db = require('../config/database');

exports.purchaseCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.user.id;

        // Get course price
        const [courses] = await db.query('SELECT price, discount_price FROM courses WHERE id = ?', [courseId]);
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const pricePaid = courses[0].discount_price || courses[0].price;

        // Insert purchase (ignore if already exists)
        await db.query(
            'INSERT IGNORE INTO purchases (user_id, course_id, price_paid) VALUES (?, ?, ?)',
            [userId, courseId, pricePaid]
        );

        // Increment total_students
        await db.query('UPDATE courses SET total_students = total_students + 1 WHERE id = ?', [courseId]);

        res.json({ success: true, message: 'Course purchased successfully' });
    } catch (err) {
        console.error('Purchase error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMyPurchases = async (req, res) => {
    try {
        const [purchases] = await db.query(
            `SELECT c.*, u.username as author, p.progress, p.price_paid, p.created_at as purchased_at
             FROM purchases p
             JOIN courses c ON p.course_id = c.id
             LEFT JOIN users u ON c.user_id = u.id
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC`,
            [req.user.id]
        );
        res.json({ success: true, purchases });
    } catch (err) {
        console.error('Get purchases error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getMyPurchaseIds = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT course_id FROM purchases WHERE user_id = ?', [req.user.id]);
        res.json({ success: true, purchaseIds: rows.map(r => r.course_id) });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { progress } = req.body;
        await db.query(
            'UPDATE purchases SET progress = ? WHERE user_id = ? AND course_id = ?',
            [progress, req.user.id, req.params.courseId]
        );
        res.json({ success: true, message: 'Progress updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
