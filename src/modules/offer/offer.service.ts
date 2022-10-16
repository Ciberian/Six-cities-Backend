import { inject, injectable } from 'inversify';
import { OfferServiceInterface } from './offer-service.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { DEFAULT_OFFER_COUNT } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
		@inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
		@inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['hostId'])
      .exec();
  }

  public async deleteById(offerId: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async find(count: string): Promise<DocumentType<OfferEntity>[]> {
    const limit = count === 'undefined' ? DEFAULT_OFFER_COUNT : count;
    return this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: { commentsId: '$_id'},
            pipeline: [
              { $match: { $expr: { $in: ['$$commentsId', '$commentsCount'] } } },
              { $project: { _id: 1}}
            ],
            as: 'comments'
          },
        },
        { $addFields:
          { id: { $toString: '$_id'}, commentsCount: { $size: '$comments'} }
        },
        { $unset: 'comments' },
        { $limit: Number(limit)},
        { $sort: { commentsCount: SortType.Down } }
      ]).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['hostId']).exec();
  }

  public async findPremiums(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isPremium: true})
      .sort({createdAt: SortType.Down})
      .populate(['hostId'])
      .exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isFavorite: true})
      .sort({createdAt: SortType.Down})
      .populate(['hostId'])
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async calcRating(offerId: number, newRating: number): Promise<DocumentType<OfferEntity> | null> {
    const oldOffer = await this.offerModel.findById(offerId).lean();
    const oldRating = oldOffer?.rating;

    return this.offerModel
      .findByIdAndUpdate(offerId, {'$set': {
        rating: oldRating ? ((oldRating + newRating)/2).toFixed(1) : newRating,
      }}).exec();
  }
}
