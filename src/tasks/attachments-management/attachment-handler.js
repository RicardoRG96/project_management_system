const multer = require('multer');
const sharp = require('sharp');
const path = require('node:path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

exports.upload = multer({ storage });

exports.fileCompressor = (filePath, fileName, next) => {
    return sharp(filePath)
        .resize(200)
        .toFile(`uploads/compressed_${fileName}`, (err, info) => {
            if (err) return next(err);
        });
}