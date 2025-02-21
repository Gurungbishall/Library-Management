import express from "express";

import { searchBook, adminSearch } from "./search.controller.js";
import {
  authenticateAdmin,
  authenticateUser,
} from "../../middlerwares/auth.middleware.js";
const router = express.Router();

router.get("/searchBook", authenticateUser, searchBook);
router.get("/manageBooks", authenticateAdmin, adminSearch);
export default router;
