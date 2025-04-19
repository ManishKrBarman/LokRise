import multer from 'multer';
import sharp from 'sharp';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
        }
    }
});

// Process profile image and prepare for MongoDB storage
export const processProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        // Process image with sharp
        const processedImageBuffer = await sharp(req.file.buffer)
            .resize(200, 200, { // Set size to 200x200px
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 80 }) // Convert to WebP with 80% quality
            .toBuffer();

        // Add the processed image data to the request body
        req.body.profileImage = {
            data: processedImageBuffer,
            contentType: 'image/webp',
            originalName: req.file.originalname
        };

        next();
    } catch (error) {
        console.error('Image processing error:', error);
        next(error);
    }
};

// Middleware chain for profile image upload
export const uploadProfileImage = [
    upload.single('profileImage'),
    processProfileImage
];