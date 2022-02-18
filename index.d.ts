import { ObjectId } from "mongoose";
import { IUser } from "./models/interfaces/user.types";
declare global {
	namespace Express {
		interface User extends IUser {}
	}
}

declare module "express-session" {
	interface SessionData {
		returnTo: string;
	}
}
