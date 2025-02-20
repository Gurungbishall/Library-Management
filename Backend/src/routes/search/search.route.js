import express from "express";

import { searchBook, adminSearch } from "./search.controller.js";

const router = express.Router();

router.get("/searchBook", searchBook);
router.get("/manageBooks", adminSearch);
export default router;
