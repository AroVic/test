const multer = require("multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/temp/");
  },
  filename: function (req, file, cb) {
    const customName = uuid();
    req.on("error", function () {
      console.log("done my part");
      try {
        fs.unlinkSync("uploads/temp/" + customName);
      } catch (e) {}
    });
    cb(null, customName);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 20 }, // 5 MB file size limit
});

module.exports = upload;
