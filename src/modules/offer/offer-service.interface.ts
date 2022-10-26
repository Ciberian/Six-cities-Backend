import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface OfferServiceInterface extends DocumentExistsInterface {
  exists(offerId: string): Promise<boolean>;
	create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(offerId: string, dto: UpdateOfferDto, userId?: string): Promise<void>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: string): Promise<DocumentType<OfferEntity>[]>;
	findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiums(count: number): Promise<DocumentType<OfferEntity>[]>;
  findFavorites(userId?: string): Promise<DocumentType<OfferEntity>[]>;
  calcRating(offerId: number, rating: number): Promise<DocumentType<OfferEntity> | null>;
}
