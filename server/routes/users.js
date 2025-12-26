const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');
const { validate, roleSchema } = require('../middleware/validation');

router.get('/', auth, usersController.getAllUsers);
router.get('/my-role', auth, usersController.getMyRole);
router.put('/:id/role', auth, validate(roleSchema), usersController.updateUserRole);

module.exports = router;
