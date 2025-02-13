import express from "express";

import { loanBook, getUserLoans } from "./loan.controller.js";

const router = express.Router();

router.post("/loanBook", loanBook);
router.get("/user/:user_id", getUserLoans);
export default router;
