import UserDto from '../../dto/user/user.dto';
import OfferDto from '../../dto/offer/offer.dto';
import CommentDto from '../../dto/comment/comment.dto';
import { User, OfferShort, Comment } from '../../types/types';

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarPath,
  isPro: user.isPro,
});

export const adaptOffersToClient = (offers: OfferDto[]): OfferShort[] =>
  offers
    .map((offer: OfferDto) => ({
      id: offer.id,
      city: offer.city,
      location: offer.location,
      price: offer.price,
      rating: offer.rank,
      title: offer.title,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      previewImage: offer.previewImage,
      type: offer.type,
    }));

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments
    .filter((comment: CommentDto) => comment.user !== null)
    .map((comment: CommentDto) => ({
      id: comment._id,
      comment: comment.text,
      date: comment.postDate,
      rating: comment.rank,
      user: adaptUserToClient(comment.user)
    }));

