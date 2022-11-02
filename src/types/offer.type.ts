import { ObjectId } from 'mongoose';

export type Offer = {
	bedrooms: number;
	city: {
		name: string;
		location: {
			latitude: number;
			longitude: number;
			zoom: number;
		};
	};
	description: string;
	goods: string[];
	host: ObjectId,
	images: string[];
	isFavorite: boolean;
	isPremium: boolean;
	location: {
		latitude: number;
		longitude: number;
		zoom: number;
	};
	maxAdults: number;
  postDate: Date;
	previewImage: string;
	price: number;
	title: string;
	type: string;
};
