import express, { Router } from "express";
const router: Router = express.Router();
import catchAsync from "../utils/catchAsync";
import campgrounds from "../controllers/campgrounds";
import { isLoggedIn, isAuthor, validateCampground } from "../middleware";
import { storage } from "../cloudinary/index";
import multer from "multer";
const upload = multer({ storage });

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(
		isLoggedIn,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
	.route("/:id")
	.get(catchAsync(campgrounds.showCampground))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.updateCampground)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

export default router;
