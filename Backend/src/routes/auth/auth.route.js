import express from "express";
import {
  userLogin,
  userSignOut,
  userSignUp,
  getProfile,
  editProfile,
} from "./auth.controller.js";

const router = express.Router();

router.post("/register", userSignUp);
router.post("/login", userLogin);

router.post("/editDetails", editProfile);
router.post("/logOut", userSignOut);

router.get("/userDetails/:userId", getProfile);

export default router;
