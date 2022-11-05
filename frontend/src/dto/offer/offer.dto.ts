import { Type } from '../../types/types';

export default class OffersDto {
  public id!: string;

  public bedrooms!: number;

  public city!: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };

  public description!: string;

  public goods!: string[];

  public host!: {
    name: string;
    email: string;
    isPro: boolean;
    avatarPath: string;
  };

  public images!: string[];

  public isFavorite!: boolean;

  public isPremium!: boolean;

  public location!: {
    latitude: number;
    longitude: number;
  };

  public maxAdults!: number;

  public previewImage!: string;

  public price!: number;

  public postDate!: string;

  public rank!: number;

  public title!: string;

  public type!: Type;

  public commentsCount!: number;
}
