const multer = require("multer");
const path = require('path');

const fileSizeLimit = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(extname)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`), false);
    }
};

const uploadImage = (req, res) => {
    if (req.session.authenticated) {
        const folderName = req.params.folderName;
        const folderPath = path.join('D:', 'TYBBACA Ecommerce Project', 'Semester 6', 'forum-application', 'public', 'images', 'uploads', folderName);

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, folderPath)
            },
            filename: function (req, file, cb) {
                const extname = path.extname(file.originalname);
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.originalname.replace(extname, '') + '-' + uniqueSuffix + extname);
            }
        });

        const uploadImg = multer({ storage: storage, limits: { fileSize: fileSizeLimit }, fileFilter: fileFilter }).single('file');

        uploadImg(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                console.error('Multer error:', err);
                return res.status(500).send('File upload failed');
            } else if (err) {
                console.error('Unknown error:', err);
                return res.status(500).send('File upload failed');
            }
            return res.status(200).json({ filename: req.file.filename, folderName: folderName });
        });
    } else {
        return res.status(401).send('Unauthorized');
    }
};

module.exports = {
    uploadImage
};

