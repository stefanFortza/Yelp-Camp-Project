import { Request, Response, NextFunction } from "express";
import { campgroundSchema, reviewSchema } from "./schemas";
import Campground from "./models/campground";
import ExpressError from "./utils/ExpressError";
import Review from "./models/review";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash("error", "You must be signed in first");
		return res.redirect("/login");
	}
	next();
};

export const validateCampground = (req: Request, res: Response, next: NextFunction) => {
	const { error } = campgroundSchema.validate(req.body);

	if (error) {
		const msg = error.details.map((el) => el.message).join(", ");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(", ");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
