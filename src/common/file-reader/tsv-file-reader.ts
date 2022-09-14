import { readFileSync } from 'fs';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([bedrooms, cityName, cityLatitude, cityLongitude, cityZoom, description, goods, hostAvatar, hostId, hostStatus, hostName, offerId, images, isFavorite, isPremium, offerLatitude, offerLongitude, offerZoom, maxAdults, postDate, previewImage, price, rating, title, type]) => ({
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
      }));
  }
}
