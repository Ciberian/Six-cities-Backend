import { inject, injectable } from 'inversify';
import { OfferEntity } from './offer.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_OFFER_RANK } from './offer.constant.js';
import { SortType } from '../../types/sort-type.enum.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import mongoose from 'mongoose';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
		@inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
		@inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
		@inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
		@inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto, userId: string): Promise<void> {
    const offerBeforeUpdate = await this.offerModel.findById(offerId);
    const offerAfterUpdate = await this.offerModel.findByIdAndUpdate(offerId, dto, {new: true});
    this.logger.info(`Offer with id ${offerId}, was updated`);

    if(offerBeforeUpdate?.isFavorite === offerAfterUpdate?.isFavorite) {
      return;
    }

    await this.offerModel.findByIdAndUpdate(offerId, {...dto, isFavorite: false});

    const currentUser = await this.userService.findById(userId);
    if (currentUser) {
      if (offerBeforeUpdate?.isFavorite) {
        this.userService.updateById(userId, {favorites: currentUser.favorites.filter((favoriteOffer) => favoriteOffer !== offerId)});
      } else {
        this.userService.updateById(userId, {favorites: [...currentUser.favorites, offerId]});
      }
    }
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    this.commentService.deleteByOfferId(offerId);

    const users = await this.userService.find();
    const usersWithDeleteOffer = users.filter((user) => user.favorites.includes(offerId));
    for (const user of usersWithDeleteOffer) {
      this.userService.updateById(
        String(user._id),
        {...user, favorites: user.favorites.filter((favoriteOfferId) => favoriteOfferId !== offerId )}
      );
    }

    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async find(count?: string): Promise<DocumentType<OfferEntity>[]> {
    const limit = count || DEFAULT_OFFER_COUNT;

    return this.offerModel
      .aggregate([
        {$lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'offerId',
          as: 'commentsCount'
        }},
        {$set: {'commentsCount': { $size: '$commentsCount' }}},
        {$addFields: { id: { $toString: '$_id'}}},
        {$limit: Number(limit)}
      ]).exec();
  }

  public async findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const user = await this.userService.findById(userId);
    const isFavorite = user ? user.favorites.includes(offerId): false;

    return this.offerModel
      .aggregate([
        {$match: {_id: new mongoose.Types.ObjectId(offerId)}},
        {$lookup: {
          from: 'users',
          localField: 'hostId',
          foreignField: '_id',
          pipeline: [
            {$project: {email: 1, password: 1, name: 1, isPro: 1}},
            {$unset: '_id'}
          ],
          as: 'user'
        }},
        {$lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'offerId',
          as: 'commentsCount'
        }},
        {$set: {
          'host': {$arrayElemAt: ['$user', 0]},
          'commentsCount': { $size: '$commentsCount'},
          'isFavorite': isFavorite
        }},
        {$addFields: {id: {$toString: '$_id'}}},
      ])
      .exec() as unknown as Promise<DocumentType<OfferEntity>>;
  }

  public async findPremiums(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {$match: {isPremium: true}},
        {$lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'offerId',
          as: 'commentsCount'
        }},
        {$set: {'commentsCount': { $size: '$commentsCount' }}},
        {$addFields: {id: {$toString: '$_id'}}},
      ])
      .sort({createdAt: SortType.Down})
      .limit(count)
      .exec() as unknown as Promise<DocumentType<OfferEntity>[]>;
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userService.findById(userId);

    if (!user || !user.favorites.length) {
      return [];
    }

    return this.offerModel
      .find({_id: {$in: user.favorites}})
      .exec();
  }

  public async calcRank(offerId: string): Promise<number> {
    const comments = await this.commentService.findByOfferId(offerId);

    if (comments.length) {
      const totalRank = comments.reduce((sum, comment) => sum + comment.rank, DEFAULT_OFFER_RANK);
      const averageRank = (totalRank/comments.length).toFixed(1);

      return Number(averageRank);
    }

    return DEFAULT_OFFER_RANK;
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: offerId})) !== null;
  }

  public async hasOwnOffer(offerId: string, userId: string): Promise<boolean> {
    const offer = await this.offerModel.findById(offerId);
    return String(offer?.hostId) !== userId;
  }
}
