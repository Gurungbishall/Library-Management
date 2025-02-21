import express from "express";
import {
  getMembers,
  editMember,
  deleteMember,
  returnedloanBook,
  deleteReturnedBookInfo,
  getMemberLoanBooks,
  getMemberReturnBooks,
} from "./member.controller.js";
import { authenticateAdmin } from "../../middlerwares/auth.middleware.js";

import upload from "../../config/multer.config.js";

const router = express.Router();

router.post(
  "/editMember/:user_id",
  authenticateAdmin,
  upload.single("userimage"),
  editMember
);
router.post("/deleteMember", authenticateAdmin, deleteMember);
router.post("/returnLoanBook", authenticateAdmin, returnedloanBook);
router.post(
  "/deleteReturnedBookInfo",
  authenticateAdmin,
  deleteReturnedBookInfo
);

router.get(
  "/getMemberLoanLists/:user_id",
  authenticateAdmin,
  getMemberLoanBooks
);
router.get(
  "/getMemberReturnLists/:user_id",
  authenticateAdmin,
  getMemberReturnBooks
);

router.get("/getMembers", authenticateAdmin, getMembers);

export default router;
