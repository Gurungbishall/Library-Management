import express from "express";
import {
  getMembers,
  editMember,
  deleteMember,
  getIndividualDetail,
  returnedloanBook,
} from "./member.controller.js";

import upload from "../../config/multer.config.js";

const router = express.Router();

router.post("/editMember/:user_id", upload.single("userimage"), editMember);
router.post("/deleteMember", deleteMember);
router.post("/returnLoanBook", returnedloanBook);

router.get("/getMembers", getMembers);
router.get("/getIndividual/:user_id", getIndividualDetail);

export default router;
