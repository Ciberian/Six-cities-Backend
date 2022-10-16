import { Expose } from 'class-transformer';

export default class OfferResponse {
  @Expose()
  public bedrooms!: number;

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
  public description!: string;

  @Expose()
  public goods!: string[];

  @Expose()
  public hostId!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public location!: {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  @Expose()
  public maxAdults!: number;

  @Expose()
  public previewImage!: string;

  @Expose()
  public price!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public title!: string;

  @Expose()
  public type!: string[];

  @Expose()
  public commentsCount!: number;
}
