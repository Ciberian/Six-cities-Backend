import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import {
  MIN_ROOMS_NUMBER,
  MAX_ROOMS_NUMBER,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MIN_ADULTS_COUNT,
  MAX_ADULTS_COUNT,
  MIN_OFFER_PRICE,
  MAX_OFFER_PRICE,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH
} from './offer.constant.js';

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
    min: [MIN_ROOMS_NUMBER, 'Min rooms number is 1 room'],
    max: [MAX_ROOMS_NUMBER, 'Max rooms number is 8 rooms']
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
    minlength: [MIN_DESCRIPTION_LENGTH, 'Min length for the description is 20 simbols'],
    maxlength: [MAX_DESCRIPTION_LENGTH, 'Max length for the description is 1024 simbols']
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
    min: MIN_ADULTS_COUNT,
    max: MAX_ADULTS_COUNT
  })
  public maxAdults!: number;

  @prop({required: true})
  public previewImage!: string;

  @prop({
    required: true,
    min: MIN_OFFER_PRICE,
    max: MAX_OFFER_PRICE
  })
  public price!: number;

  @prop()
  public postDate!: Date;

  @prop({
    required: true,
    minlength: MIN_TITLE_LENGTH,
    maxlength: MAX_TITLE_LENGTH
  })
  public title!: string;

  @prop()
  public type!: string;
}

export const OfferModel = getModelForClass(OfferEntity);
