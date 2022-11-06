import CreateUserDto from '../../dto/user/create-user.dto';
import CreateOfferDto from '../../dto/offer/create-offer.dto';
import CreateCommentDto from '../../dto/comment/create-comment.dto';
import { CommentAuth, NewOffer, UserRegister } from '../../types/types';

export const adaptUserRegisterToServer = (user: UserRegister): CreateUserDto => ({
  email: user.email,
  password: user.password,
  name: user.name,
  isPro: Boolean(user.isPro),
  favorites: [],
});

export const adaptOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  bedrooms: offer.bedrooms,
  city: offer.city,
  description: offer.description,
  goods: offer.goods,
  images: [],
  isFavorite: false,
  isPremium: offer.isPremium,
  location: offer.location,
  maxAdults: offer.maxAdults,
  previewImage: offer.previewImage,
  price: offer.price,
  postDate: new Date(),
  title: offer.title,
  type: offer.type,
});


export const adaptCreateCommentToServer = (comment: CommentAuth): CreateCommentDto => ({
  text: comment.comment,
  rank: comment.rating,
});

export const adaptAvatarToServer = (file: string) => {
  const formData = new FormData();
  formData.set('avatar', file);

  return formData;
};
