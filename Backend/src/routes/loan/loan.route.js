import express from "express";
import { authenticateUser } from "../../middlerwares/auth.middleware.js";
import { loanBook, getUserLoans } from "./loan.controller.js";

const router = express.Router();


router.post("/loanBook",authenticateUser, loanBook);
router.get("/user/:user_id",authenticateUser,  getUserLoans);
export default router;
