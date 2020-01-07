const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  //cb - callback
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// <input type="file" name="cover" /> ожидает такого инпута на клиента
const upload = multer({ storage: storage }).single("cover");

module.exports = upload;
