import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';

export interface OfferServiceInterface {
	create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(offerId: number, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: number): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
	findById(offerId: number): Promise<DocumentType<OfferEntity> | null>;
  findPremiums(count: number): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(count: number): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  calcRating(offerId: number, rating: number): Promise<DocumentType<OfferEntity> | null>;
}
