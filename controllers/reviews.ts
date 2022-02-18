import Campground from "../models/campground";
import { Request, Response, NextFunction } from "express";
import Review from "../models/review";

async function createReview(req: Request, res: Response, next: NextFunction) {
	const campground = await Campground.findById(req.params.id);
	if (!campground) return next();
	const review = new Review(req.body.review);
	review.author = req.user._id;
	await review.save();
	campground.reviews.push(review._id);
	await campground.save();
	req.flash("success", "New Review");
	res.redirect(`/campgrounds/${campground._id}`);
}

async function deleteReview(req: Request, res: Response) {
	const { id, reviewId } = req.params;
	await Campground.findByIdAndUpdate(id, {
		$pull: {
			reviews: reviewId,
		},
	});
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "Successfully deleted review");
	res.redirect(`/campgrounds/${id}`);
}

export default {
	createReview,
	deleteReview,
};
