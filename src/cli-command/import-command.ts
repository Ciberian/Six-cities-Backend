import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import DatabaseService from '../common/database-client/database.service.js';
import OfferService from '../modules/offer/offer.service.js';
import UserService from '../modules/user/user.service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { createOffer, getErrorMessage } from '../utils/common.js';
import { OfferModel } from '../modules/offer/offer.entity.js';
import { UserModel } from '../modules/user/user.entity.js';
import { Offer } from '../types/offer.type.js';
import { getURI } from '../utils/db.js';
import { getRandomItem } from '../utils/random.js';

const DEFAULT_DB_PORT = 27017;

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async saveOffer(offer: Offer) {
    const hosts = await this.userService.find();
    const host = getRandomItem(hosts);

    await this.offerService.create({ ...offer, hostId: String(host._id)});
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string): Promise<void> {
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
