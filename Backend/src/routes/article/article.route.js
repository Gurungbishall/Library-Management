import express from "express";
import { getArticleOnCategory } from "./article.controller.js";

const router = express.Router();


router.get("/category/:category?", getArticleOnCategory);

export default router;
