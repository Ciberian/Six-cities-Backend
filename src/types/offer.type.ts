import { GoodsType } from './goods-type.enum';
import { HousingType } from './housing-type.enum';

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
	goods: GoodsType;
	host: {
    email: string;
    password: string;
		avatarUrl: string;
		id: number;
		isPro: boolean;
		name: string;
	};
	id: number;
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
	rating: number;
	title: string;
	type: HousingType;
  commentCount: number
};
