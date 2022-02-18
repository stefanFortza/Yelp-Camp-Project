import mongoose from "mongoose";
import cities from "./cities";
import { places, descriptors } from "./seedHelpers";
import Campground from "../models/campground";
require("dotenv").config();

const uri = process.env.ATLAS_URI;
if (uri) mongoose.connect(uri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

function sample<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "61ffbf7be77c9309f7ceee9d",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum modi labore deleniti consectetur rerum sequi qui velit dolores repellendus praesentium, enim, nam eligendi tempora sapiente atque facilis alias ipsam id?",
			price,
			geometry: {
				coordinates: [24.51805, 44.170589],
				type: "Point",
			},
			images: [
				{
					url: "https://res.cloudinary.com/dufnsmmej/image/upload/v1645038196/YelpCamp/cllwseajen6i3vmyndo9.jpg",
					filename: "YelpCamp/lowhlekyec1izfxvlaxa",
				},
				{
					url: "https://res.cloudinary.com/dufnsmmej/image/upload/v1645036831/YelpCamp/ieos9ual1gdffti6tjqw.jpg",
					filename: "YelpCamp/brvq3i3tngqlijr2lbor",
				},
				{
					url: "https://res.cloudinary.com/dufnsmmej/image/upload/v1645034598/YelpCamp/brvq3i3tngqlijr2lbor.jpg",
					filename: "YelpCamp/lowhlekyec1izfxvlaxa",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
