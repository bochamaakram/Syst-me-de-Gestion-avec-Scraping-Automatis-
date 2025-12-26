const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const quizController = require('../controllers/quizController');

// Get quiz for course (public to see if quiz exists)
router.get('/course/:courseId', quizController.getQuiz);

// Protected routes
router.use(auth);

// Submit quiz answers
router.post('/:quizId/submit', quizController.submitQuiz);

// Get user's attempts for a course
router.get('/attempts/:courseId', quizController.getAttempts);

// Save/update quiz (teacher/admin)
router.post('/course/:courseId', quizController.saveQuiz);
router.put('/course/:courseId', quizController.saveQuiz);

module.exports = router;
