import express, { Router } from "express";
import catchAsync from "../utils/catchAsync";
import passport from "passport";
import users from "../controllers/users";
const router: Router = express.Router();

router.route("/register").get(users.renderRegister).post(catchAsync(users.register));

router
	.route("/login")
	.get(users.renderLogin)
	.post(
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
			passReqToCallback: false,
		}),
		users.login
	);

router.get("/logout", users.logout);

export default router;
