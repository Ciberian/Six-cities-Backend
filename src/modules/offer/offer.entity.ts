import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { HousingType } from '../../types/housing-type.enum.js';
import { UserEntity } from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    min: [1, 'Min rooms number is 1 room'],
    max: [8, 'Max rooms number is 8 rooms']
  })
  public bedrooms!: number;

  @prop()
  public city!: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };

  @prop({
    required: true,
    minlength: [20, 'Min length for the description is 20 simbols'],
    maxlength: [1024, 'Max length for the description is 1024 simbols']
  })
  public description!: string;

  @prop({required: true})
  public goods!: string[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public hostId!: Ref<UserEntity>;

  @prop({
    required: true
  })
  public images!: string[];

  @prop({required: true})
  public isFavorite!: boolean;

  @prop({required: true})
  public isPremium!: boolean;

  @prop()
  public location!: {
    latitude: number;
    longitude: number;
    zoom: number;
  };

  @prop({
    required: true,
    min: 1,
    max: 10
  })
  public maxAdults!: number;

  @prop({required: true})
  public previewImage!: string;

  @prop({
    required: true,
    min: 100,
    max: 100000
  })
  public price!: number;

  @prop({
    required: true,
    min: 1,
    max: 5
  })
  public rating!: number;

  @prop({
    required: true,
    minlength: 10,
    maxlength: 100
  })
  public title!: string;

  @prop({enum: HousingType})
  public type!: HousingType;
}

export const OfferModel = getModelForClass(OfferEntity);
