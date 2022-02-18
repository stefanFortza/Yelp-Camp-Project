import express, { Router } from "express";
const router: Router = express.Router({ mergeParams: true });
import catchAsync from "../utils/catchAsync";
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware";
import reviews from "../controllers/reviews";

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

export default router;
