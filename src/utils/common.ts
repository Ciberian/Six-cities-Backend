import * as jose from 'jose';
import crypto from 'crypto';
import { User } from '../types/user.type.js';
import { Offer } from '../types/offer.type.js';
import { Comment } from '../types/comment.type.js';
import { ValidationError } from 'class-validator';
import { ServiceError } from '../types/service-error.enum.js';
import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { UnknownObject } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';

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

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (property: string, someObject: UnknownObject, transformFn: (object: UnknownObject) => void) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};
