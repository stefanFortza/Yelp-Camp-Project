import mongoose, { Schema } from "mongoose";
import { IReview, ReviewModelType } from "./interfaces/review.types";

const reviewSchema = new Schema<IReview, ReviewModelType>({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

const Review = mongoose.model<IReview, ReviewModelType>("Review", reviewSchema);

export default Review;
