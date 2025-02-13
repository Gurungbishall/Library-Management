import express from "express";
import {
  addBook,
  getBookDetails,
  getBookOnCategory,
  editBook,
  deleteBook,
} from "./book.controller.js";
import upload from "../../config/multer.config.js";

const router = express.Router();

router.post("/addBook", upload.single("bookimage"), addBook);
router.post("/editBook/:book_id", upload.single("bookimage"), editBook);
router.post("/deleteBook", deleteBook);

router.get("/getBookDetails/:id", getBookDetails);
router.get("/category/:category?", getBookOnCategory);

export default router;
