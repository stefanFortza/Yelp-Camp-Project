import { Model, Types } from "mongoose";

export type CampgModelType = Model<ICampground>;

export interface IImage {
	url: string;
	filename: string;
}

export interface ImageModel extends Model<IImage> {
	thumbnail(): string;
	propreties: {
		popUpMarkup(): string;
	};
}

export interface ICampground {
	title: string;
	geometry: {
		type: string;
		coordinates: number[];
	};
	images: {
		url: string;
		filename: string;
	}[];
	price: number;
	description: string;
	author: Types.ObjectId;
	location: string;
	reviews: Types.ObjectId[];
}
