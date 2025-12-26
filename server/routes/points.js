const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pointsController = require('../controllers/pointsController');

// All routes require authentication
router.use(auth);

// Get point balance
router.get('/balance', pointsController.getBalance);

// Get transaction history
router.get('/history', pointsController.getHistory);

// Purchase course with points
router.post('/purchase/:courseId', pointsController.purchaseCourse);

// Complete course (after passing quiz)
router.post('/complete/:courseId', pointsController.completeCourse);

module.exports = router;
