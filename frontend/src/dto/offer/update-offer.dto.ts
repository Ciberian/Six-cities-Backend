export default class UpdateOfferDto {

  public bedrooms?: number;

  public city?: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };

  public description?: string;


  public goods?: string[];


  public postDate!: Date;

  public hostId?: string;

  public images?: string[];

  public isFavorite?: boolean;

  public isPremium?: boolean;

  public location?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  public maxAdults?: number;

  public previewImage?: string;

  public price?: number;

  public title?: string;

  public type?: string;
}
