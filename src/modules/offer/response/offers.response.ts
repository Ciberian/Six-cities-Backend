import { Expose } from 'class-transformer';

export default class OffersResponse {
  @Expose()
  public id!: string;

  @Expose()
  public city!: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };

  @Expose()
  public location!: {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  @Expose()
  public price!: number;

  @Expose()
  public rank!: number;

  @Expose()
  public title!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public previewImage!: string;

  @Expose()
  public type!: string;
}
