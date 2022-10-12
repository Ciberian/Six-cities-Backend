import crypto from 'crypto';
import { Offer } from '../types/offer.type.js';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [bedrooms, cityName, cityLatitude, cityLongitude, cityZoom, description, goods, hostAvatar, hostId, hostStatus, hostName, offerId, images, isFavorite, isPremium, offerLatitude, offerLongitude, offerZoom, maxAdults, postDate, previewImage, price, rating, title, type] = tokens;

  return {
    bedrooms: Number(bedrooms),
    city: {
      name: cityName,
      location: {
        latitude: Number(cityLatitude),
        longitude: Number(cityLongitude),
        zoom: Number(cityZoom)
      }
    },
    description: description,
    goods: goods.split(';'),
    host: {
      avatarUrl: hostAvatar,
      id: Number(hostId),
      isPro: Boolean(Number(hostStatus)),
      name: hostName
    },
    id: Number(offerId),
    images: images.split(';'),
    isFavorite: Boolean(Number(isFavorite)),
    isPremium: Boolean(Number(isPremium)),
    location: {
      latitude: Number(offerLatitude),
      longitude: Number(offerLongitude),
      zoom: Number(offerZoom)
    },
    maxAdults: Number(maxAdults),
    postDate: new Date(postDate),
    previewImage,
    price: Number(price),
    rating: Number(rating),
    title,
    type
  } as unknown as Offer;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(responseObj: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(responseObj, plainObject, {excludeExtraneousValues: true});
