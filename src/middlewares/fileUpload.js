const multer = require("multer");
const maxSize = 2 * 1024 * 1024
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const bookId = req.params.bookId;
        const uploadPath = __basedir +  "/uploads/" + bookId;

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath)
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + '-' + Date.now())
    }
});
const upload = multer({
    storage : storage,
    limits : {fileSize : maxSize}
}).single("myfile");

module.exports = upload;