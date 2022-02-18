import { Request, Response, NextFunction } from "express";
import User from "../models/user";

function renderRegister(req: Request, res: Response) {
	res.render("users/register");
}
async function register(req: Request, res: Response, next: NextFunction) {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registratedUser = await User.register(user, password);
		req.logIn(registratedUser, (err) => {
			if (err) return next(err);
		});
		req.flash("success", "Welcome to Yelp-Camp!");
		res.redirect("/campgrounds");
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/register");
	}
}
function renderLogin(req: Request, res: Response) {
	res.render("users/login");
}

function login(req: Request, res: Response) {
	req.flash("success", "welcome back");
	const redirectUrl = req.session.returnTo || "/campgrounds";
	delete req.session.returnTo;
	res.redirect(redirectUrl);
}

function logout(req: Request, res: Response) {
	req.logOut();
	req.flash("success", "Goodbye");
	res.redirect("/campgrounds");
}

export default {
	renderRegister,
	register,
	renderLogin,
	login,
	logout,
};
