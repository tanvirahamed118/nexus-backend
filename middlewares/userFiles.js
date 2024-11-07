// multerSingle.js
const multer = require("multer");
const path = require("path");

const FILE_TYPE_MAP = {
  ".png": "png",
  ".jpeg": "jpeg",
  ".jpg": "jpg",
  ".avi": "avi",
  ".mp4": "mp4",
  ".mov": "mov",
};

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid =
      FILE_TYPE_MAP[path.extname(file.originalname).toLowerCase()];
    let uploadError = new Error("Invalid image type");

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    cb(null, fileName);
  },
});

const upload = multer({
  storage: Storage,
});

const userFiles = upload.fields([
  { name: "video", maxCount: 5 },
  { name: "profile", maxCount: 1 },
]);

module.exports = userFiles;
