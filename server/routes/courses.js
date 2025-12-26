const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const auth = require('../middleware/auth');
const { validate, courseSchema } = require('../middleware/validation');

router.get('/', coursesController.getCourses);
router.get('/:id', coursesController.getCourse);
router.post('/', auth, validate(courseSchema), coursesController.createCourse);
router.put('/:id', auth, validate(courseSchema), coursesController.updateCourse);
router.delete('/:id', auth, coursesController.deleteCourse);

module.exports = router;
