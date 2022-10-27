import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import UserService from '../modules/user/user.service.js';
import OfferService from '../modules/offer/offer.service.js';
import CommentService from '../modules/comment/comment.service.js';
import DatabaseService from '../common/database-client/database.service.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
import { CommentServiceInterface } from '../modules/comment/comment-service.interface.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { createComment, createOffer, createUser, getErrorMessage } from '../utils/common.js';
import { UserModel } from '../modules/user/user.entity.js';
import { OfferModel } from '../modules/offer/offer.entity.js';
import { CommentModel } from '../modules/comment/comment.entity.js';
import { Offer } from '../types/offer.type.js';
import { getURI } from '../utils/db.js';
import { getRandomItem } from '../utils/random.js';
import { Comment } from '../types/comment.type.js';
import { User } from '../types/user.type.js';

const DEFAULT_DB_PORT = 27017;

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private commentService!: CommentServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLineUsers = this.onLineUsers.bind(this);
    this.onLineOffers = this.onLineOffers.bind(this);
    this.onLineComments = this.onLineComments.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.userService = new UserService(this.logger, UserModel);
    this.offerService = new OfferService(this.logger, this.userService, OfferModel);
    this.commentService = new CommentService(this.logger, CommentModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  private async saveUser(user: User) {
    await this.userService.create(user, this.salt);
  }

  private async saveOffer(offer: Offer) {
    const users = await this.userService.find();
    if (!users.length) {
      throw new Error('Before create offers, create users first');
    }
    const user = getRandomItem(users);

    await this.offerService.create({ ...offer, hostId: String(user._id)});
  }

  private async saveComment(comment: Comment) {
    const offers = await this.offerService.find();
    if (!offers.length) {
      throw new Error('Before create comments, create offers first');
    }
    const users = await this.userService.find();
    const offer = getRandomItem(offers);
    const user = getRandomItem(users);

    this.userService.updateById(String(user._id), {favorites: [String(offer._id)]});

    await this.commentService.create({...comment, offerId: String(offer._id), userId: String(offer.hostId)});
  }

  private async onLineUsers(line: string, resolve: () => void) {
    const user = createUser(line);
    await this.saveUser(user);
    resolve();
  }

  private async onLineOffers(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private async onLineComments(line: string, resolve: () => void) {
    const comment = createComment(line);
    await this.saveComment(comment);
    resolve();
  }

  private onComplete(count: number) {
    console.log(`${count} rows imported.`);
    this.databaseService.disconnect();
  }

  public async execute(
    collectionName: string,
    filename: string,
    login: string,
    password: string,
    host: string,
    dbname: string,
    salt: string): Promise<void> {
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    if (collectionName === 'users') {
      fileReader.on('line', this.onLineUsers);
      fileReader.on('end', this.onComplete);
    }

    if (collectionName === 'offers') {
      fileReader.on('line', this.onLineOffers);
      fileReader.on('end', this.onComplete);
    }

    if (collectionName === 'comments') {
      fileReader.on('line', this.onLineComments);
      fileReader.on('end', this.onComplete);
    }

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`Can't read the file: ${getErrorMessage(err)}`);
    }
  }
}
