import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const isValidExt = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = filetypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    return cb(null, true);
  }

  cb(
    new Error("Invalid file type. Only JPG, JPEG, and PNG files are allowed."),
    false
  );
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "userimage") {
      cb(null, "public/image/user/");
    } else if (file.fieldname === "bookimage") {
      cb(null, "public/image/book/");
    } else {
      cb(new Error("Invalid field name for image upload"), false);
    }
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
