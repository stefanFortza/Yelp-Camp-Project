import { PassportLocalDocument, PassportLocalModel } from "mongoose";

export type UserModelType = PassportLocalModel<IUser>;

export interface IUser extends PassportLocalDocument {
	email: String;
}
