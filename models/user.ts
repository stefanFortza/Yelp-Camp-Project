import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import { IUser, UserModelType } from "./interfaces/user.types";

const UserSchema = new Schema<IUser, UserModelType>({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model<IUser, UserModelType>("User", UserSchema);

export default User;
