import {
  IsDateString,
  IsArray,
  IsObject,
  IsMongoId,
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
  IsInt,
  Max,
  Min,
} from 'class-validator';

export default class CreateOfferDto {
  @IsInt({message: 'Bedrooms must be an integer'})
  @Min(1, {message: 'Minimum bedrooms is 1'})
  @Max(8, {message: 'Maximum bedrooms is 8'})
  public bedrooms!: number;

  @IsObject({message: 'Field city must be an object'})
  public city!: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsArray({message: 'Field goods must be an array'})
  @IsString({each: true, message: 'Goods field must be an array of string'})
  public goods!: string[];

  @IsMongoId({each: true, message: 'HostId field must be a valid id'})
  public hostId!: string;

  @IsArray({message: 'Field images must be an array'})
  @IsString({each: true, message: 'Images field must be an array of string'})
  public images!: string[];

  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isFavorite!: boolean;

  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isPremium!: boolean;

  @IsObject({message: 'Field location must be an object'})
  public location!: {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  @IsInt({message: 'Field maxAdults must be an integer'})
  @Min(1, {message: 'Minimum adults is 1'})
  @Max(10, {message: 'Maximum adults is 10'})
  public maxAdults!: number;

  @IsString({message: 'Field previewImage must be a string'})
  public previewImage!: string;

  @IsInt({message: 'Field price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price!: number;

  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate!: Date;

  @Min(1, {message: 'Field rating must be greater than 1 or equal'})
  @Max(5, {message: 'Field rating must be lower then 5 or equal'})
  public rating!: number;

  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @IsString({message: 'Field type must be a string'})
  public type!: string;
}
