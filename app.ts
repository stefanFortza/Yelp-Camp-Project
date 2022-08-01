if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import mongoose from "mongoose";
const engine = require("ejs-mate");
import ExpressError from "./utils//ExpressError";
import methodOverride from "method-override";
import session, { SessionOptions } from "express-session";
import flash from "connect-flash";
import passport from "passport";
import { Strategy } from "passport-local";
import User from "./models/user";
import campgroundRoutes from "./routes/campgrounds";
import reviewRoutes from "./routes/reviews";
import userRoutes from "./routes/users";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import MongoStore from "connect-mongo";
import { readFileSync } from "fs";
import https from "https";
import http from "http";
const app: Application = express();

//Legacy code for connecting locally
// mongoose.connect("mongodb://localhost:27017/yelp-camp");

const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/yelp-camp";
if (uri) mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const scriptSrcUrls = [
	"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
	"https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
	"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
	"https://kit-free.fontawesome.com/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.mapbox.com/",
	"https://api.tiles.mapbox.com/",
	"https://fonts.googleapis.com/",
	"https://use.fontawesome.com/",
];
const connectSrcUrls = [
	"https://api.mapbox.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
	"ws://127.0.0.1:35729/livereload",
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", "blob:"],
			objectSrc: [],
			imgSrc: [
				"'self'",
				"blob:",
				"data:",
				"https://res.cloudinary.com/dufnsmmej/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				"https://images.unsplash.com/",
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const sessionConfig: SessionOptions = {
	store: MongoStore.create({
		mongoUrl: uri,
		touchAfter: 24 * 3600,
	}),
	name: "session",
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Strategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req: Request, res: Response, next: NextFunction) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use(
	mongoSanitize({
		replaceWith: "_",
	})
);

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req: Request, res: Response) => {
	res.render("home");
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});

app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Something went wrong";
	res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
const sslOptions = {
	key: readFileSync("./key.pem"),
	cert: readFileSync("./cert.pem"),
	passphrase: process.env.SSL_PASS,
};

http.createServer(app).listen(8080);
https.createServer(sslOptions, app).listen(3000);

// app.listen(port, () => {
// 	console.log(`Serving on port ${port}`);
// });
