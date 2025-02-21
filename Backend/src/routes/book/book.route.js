import express from "express";
import {
  addBook,
  getBookDetails,
  getBookOnCategory,
  editBook,
  deleteBook,
} from "./book.controller.js";
import upload from "../../config/multer.config.js";
import {
  authenticateAdmin,
  authenticateUser,
} from "../../middlerwares/auth.middleware.js";

const router = express.Router();

router.post("/addBook", authenticateAdmin, upload.single("bookimage"), addBook);
router.post(
  "/editBook/:book_id",
  authenticateAdmin,
  upload.single("bookimage"),
  editBook
);
router.post("/deleteBook", authenticateAdmin, deleteBook);

router.get("/getBookDetails/:id", authenticateUser, getBookDetails);
router.get("/category/:category?", authenticateUser, getBookOnCategory);

export default router;
