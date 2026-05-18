import multer from "multer";
import path from "path";

/**
 * Multer configuration for hotel image uploads
 */

// Storage configuration - using memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter - accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
    }
};

// Multer upload configuration
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: fileFilter,
});

/**
 * Middleware to handle multiple hotel images
 * Usage: upload.hotelImages
 */
export const uploadMiddleware = {
    // For multiple hotel images (up to 10)
    hotelImages: upload.array("images", 10),
};
