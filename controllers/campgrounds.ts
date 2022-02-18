import { NextFunction, Request, Response } from "express";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";
const mapboxToken = process.env.MAPBOX_TOKEN;
import Campground from "../models/campground";
import cloudinary from "../cloudinary";
import { IReview } from "../models/interfaces/review.types";
import { IUser } from "../models/interfaces/user.types";

const geocoder = mbxGeocoding({ accessToken: mapboxToken });

async function index(req: Request, res: Response) {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
}
function renderNewForm(req: Request, res: Response) {
	res.render("campgrounds/new");
}

async function createCampground(req: Request, res: Response) {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();
	const campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = (req.files as Express.Multer.File[]).map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	req.flash("success", "Succesfully made a new campground");
	res.redirect(`/campgrounds/${campground._id}`);
}

async function showCampground(req: Request, res: Response) {
	const { id } = req.params;
	const campground = await Campground.findById(id)
		.populate<{ reviews: IReview }>({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate<{ author: IUser }>("author");
	if (!campground) {
		req.flash("error", "Cannot find that campground");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { campground });
}

async function renderEditForm(req: Request, res: Response) {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash("error", "Cannot find that campground");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { campground });
}

async function updateCampground(req: Request, res: Response, next: NextFunction) {
	const { id } = req.params;
	console.log(req.body);
	const campground = await Campground.findByIdAndUpdate(id, {
		...req.body.campground,
	});
	campground.images.push(
		...(req.files as Express.Multer.File[]).map((f) => ({
			url: f.path,
			filename: f.filename,
		}))
	);
	await campground.save();
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({
			$pull: {
				images: { filename: { $in: req.body.deleteImages } },
			},
		});
	}
	req.flash("success", "Succesfully updated campground");
	res.redirect(`/campgrounds/${campground._id}`);
}

async function deleteCampground(req: Request, res: Response) {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground");
	res.redirect("/campgrounds");
}

export default {
	index,
	renderNewForm,
	createCampground,
	showCampground,
	renderEditForm,
	updateCampground,
	deleteCampground,
};
