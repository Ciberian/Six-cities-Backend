import { Offer } from '../../types/offer.type';

export interface FileReaderInterface {
	readonly filename: string;
	read(): void;
  toArray(): Offer[];
}
