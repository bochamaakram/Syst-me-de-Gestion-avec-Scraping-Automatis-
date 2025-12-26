const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Upload image (auth required)
router.post('/image', auth, upload.single('image'), uploadController.uploadImage);

// Error handling for multer
router.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
    }
    if (err.message) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
});

module.exports = router;
