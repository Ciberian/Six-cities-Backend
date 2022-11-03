import * as jose from 'jose';
import crypto from 'crypto';
import { User } from '../types/user.type.js';
import { Offer } from '../types/offer.type.js';
import { Comment } from '../types/comment.type.js';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export const createUser = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [email, password, name, isPro] = tokens;

  return {
    email,
    password,
    name,
    isPro,
    favorites: []
  } as unknown as User;
};

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [bedrooms, cityName, cityLatitude, cityLongitude, cityZoom, description, goods, images, isFavorite, isPremium, offerLatitude, offerLongitude, offerZoom, maxAdults, postDate, previewImage, price, rank, title, type] = tokens;

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
    description,
    goods: goods.split(','),
    images: images.split(','),
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
    rank: Number(rank),
    title,
    type: type.trim()
  } as unknown as Offer;
};

export const createComment = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [text, rank] = tokens;

  return {
    text,
    rank
  } as unknown as Comment;
};

export const getErrorMessage = (error: unknown): string => error instanceof Error ? error.message : '';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(responseObj: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(responseObj, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message,
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
