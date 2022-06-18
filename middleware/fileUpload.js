const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const spath = `uploads/${req.userData[0].id}`;
        fs.mkdirSync(spath, { recursive: true });
        cb(null, spath);
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

exports.upload = multer({ storage: storage });