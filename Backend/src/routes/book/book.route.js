import express from "express";
import {
  addBook,
  getBookDetails,
  getBookOnCategory,
} from "./book.controller.js";

const router = express.Router();

router.post("/addBook", addBook);

router.get("/getBookDetails/:id", getBookDetails);
router.get("/category/:category?", getBookOnCategory);

export default router;
