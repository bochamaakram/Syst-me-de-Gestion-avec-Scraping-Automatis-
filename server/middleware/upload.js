const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use memory storage for Vercel compatibility (serverless has read-only filesystem)
// For local development, you can switch to disk storage
const isVercel = process.env.VERCEL === '1';

let storage;

if (isVercel) {
    // Memory storage for Vercel - files stored in buffer
    storage = multer.memoryStorage();
} else {
    // Disk storage for local development
    const uploadDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, 'img-' + uniqueSuffix + ext);
        }
    });
}

// File filter - only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
    }
};

// Upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

module.exports = upload;
