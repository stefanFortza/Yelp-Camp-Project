import mongoose, { Schema } from "mongoose";
import { CampgModelType, ICampground, IImage, ImageModel } from "./interfaces/campground.types";
import Review from "./review";

const ImageSchema = new Schema<IImage, ImageModel>({
	url: String,
	filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
	return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema<ICampground, CampgModelType>({
	title: String,
	images: [ImageSchema],
	price: Number,
	geometry: {
		type: {
			type: String,
			enum: ["Point"],
			requied: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

const Campground = mongoose.model<ICampground, CampgModelType>("Campground", CampgroundSchema);
export default Campground;
