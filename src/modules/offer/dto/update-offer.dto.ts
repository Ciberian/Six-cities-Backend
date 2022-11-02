import {
  IsOptional,
  IsDateString,
  IsArray,
  IsObject,
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
  IsInt,
  Max,
  Min,
} from 'class-validator';

export default class UpdateOfferDto {
  @IsOptional()
  @IsInt({message: 'Bedrooms must be an integer'})
  @Min(1, {message: 'Minimum bedrooms is 1'})
  @Max(8, {message: 'Maximum bedrooms is 8'})
  public bedrooms?: number;

  @IsOptional()
  @IsObject({message: 'Field city must be an object'})
  public city?: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsArray({message: 'Field goods must be an array'})
  @IsString({each: true, message: 'Goods field must be an array of string'})
  public goods?: string[];

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate!: Date;

  @IsOptional()
  public hostId?: string;

  @IsOptional()
  @IsArray({message: 'Field images must be an array'})
  @IsString({each: true, message: 'Images field must be an array of string'})
  public images?: string[];

  @IsOptional()
  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isFavorite?: boolean;

  @IsOptional()
  @IsBoolean({message: 'Field isFavorite must be a boolean'})
  public isPremium?: boolean;

  @IsOptional()
  @IsObject({message: 'Field location must be an object'})
  public location?: {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  @IsOptional()
  @IsInt({message: 'Field maxAdults must be an integer'})
  @Min(1, {message: 'Minimum adults is 1'})
  @Max(10, {message: 'Maximum adults is 10'})
  public maxAdults?: number;

  @IsOptional()
  @IsString({message: 'Field previewImage must be a string'})
  public previewImage?: string;

  @IsOptional()
  @IsInt({message: 'Field price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price?: number;

  @IsOptional()
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @IsString({message: 'Field type must be a string'})
  public type?: string;
}
