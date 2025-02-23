import express from "express";
import { review, accessReviews, deleteReview } from "./review.controller.js";
const router = express.Router();

router.post("/reviewItem", review);
router.post("/deleteReviews/:review_id", deleteReview);

router.get("/accessReviews", accessReviews);

export default router;
