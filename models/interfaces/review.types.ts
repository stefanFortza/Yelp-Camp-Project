import { Model, Types } from "mongoose";

export type ReviewModelType = Model<IReview>;

export interface IReview {
	body: string;
	rating: number;
	author: Types.ObjectId;
}
