import { Type } from '../../types/types';

export default class OfferDto {
  public id!: string;

  public city!: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };

  public location!: {
    latitude: number;
    longitude: number;
  };

  public price!: number;

  public rank!: number;

  public title!: string;

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public previewImage!: string;

  public type!: Type;
}
