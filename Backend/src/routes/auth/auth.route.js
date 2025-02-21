import express from "express";
import {
  userLogin,
  userSignOut,
  userSignUp,
  getProfile,
  editProfile,
} from "./auth.controller.js";
import upload from "../../config/multer.config.js";
const router = express.Router();

router.post("/register", upload.single("userimage"), userSignUp);
router.post("/login", userLogin);
router.post("/editDetails/:user_id", upload.single("userimage"), editProfile);
router.post("/logOut", userSignOut);
router.get("/userDetails/:userId", getProfile);

export default router;
