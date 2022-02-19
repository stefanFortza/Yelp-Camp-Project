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

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema<ICampground, CampgModelType>(
	{
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
	},
	opts
);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
	return `<a href="/campgrounds/${this._id}">${this.title}</a>
	<p>${this.description.substring(0, 20)}...</p>`;
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
