import dayjs from 'dayjs';
import { MockOfferData } from '../../types/mock-offer.type.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

const ZOOM = 10;
const MIN_RANK = 1;
const MAX_RANK = 5;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const CITY_LOCATION: {[key: string]: {latitude: number; longitude: number}} = {
  Paris: { latitude: 48.85661, longitude: 2.351499 },
  Cologne: { latitude: 50.938361, longitude: 6.959974 },
  Brussels: { latitude: 50.846557, longitude: 4.351697 },
  Amsterdam: { latitude: 52.370216, longitude: 4.895168 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314 },
};

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockOfferData) {}

  public generate(): string {
    const bedrooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const cityName = getRandomItem<string>(this.mockData.cities);
    const cityLatitude = CITY_LOCATION[cityName].latitude;
    const cityLongitude = CITY_LOCATION[cityName].longitude;
    const cityZoom = ZOOM;
    const description = getRandomItem<string>(this.mockData.descriptions);
    const goods = getRandomItems<string>(this.mockData.goods);
    const offerImages = getRandomItems<string>(this.mockData.offerImages);
    const isFavorite = generateRandomValue(0, 1);
    const isPremium = generateRandomValue(0, 1);
    const offerLatitude = cityLatitude + Math.random();
    const offerLongitude = cityLongitude + Math.random();
    const offerZoom = ZOOM;
    const maxAdults = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const previewImage = getRandomItem<string>(this.mockData.offerImages);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const rating = generateRandomValue(MIN_RANK, MAX_RANK);
    const title = getRandomItem<string>(this.mockData.titles);
    const type = getRandomItem<string>(this.mockData.offerTypes);

    return [
      bedrooms,
      cityName,
      cityLatitude,
      cityLongitude,
      cityZoom,
      description,
      goods,
      offerImages,
      isFavorite,
      isPremium,
      offerLatitude,
      offerLongitude,
      offerZoom,
      maxAdults,
      postDate,
      previewImage,
      price,
      rating,
      title,
      type,
    ].join('\t');
  }
}

