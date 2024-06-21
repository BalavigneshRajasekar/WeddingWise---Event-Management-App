const multer = require("multer");
const path = require("path");
// Multer Middleware create an diskStorage for images to store
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/mallImages");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
