import got from 'got';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import UserGenerator from '../common/user-generator/user-generator.js';
import OfferGenerator from '../common/offer-generator/offer-generator.js';
import CommentGenerator from '../common/comment-generator/comment-generator.js';
import { CliCommandInterface } from './cli-command.interface.js';
import { MockUserData } from '../types/mock-user.type.js';
import { MockOfferData } from '../types/mock-offer.type.js';
import { MockCommentData } from '../types/mock-comment.type.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: MockUserData | MockOfferData | MockCommentData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const dataCount = Number(count);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(`Can't fetch data from ${url}.`);
    }


    if (url.includes('4000')) {
      const userGeneratorString = new UserGenerator(this.initialData as MockUserData);
      const tsvFileWriter = new TSVFileWriter(filepath);

      for (let i = 0; i < dataCount; i++) {
        await tsvFileWriter.write(userGeneratorString.generate());
      }
    }

    if (url.includes('4001')) {
      const offerGeneratorString = new OfferGenerator(this.initialData as MockOfferData);
      const tsvFileWriter = new TSVFileWriter(filepath);

      for (let i = 0; i < dataCount; i++) {
        await tsvFileWriter.write(offerGeneratorString.generate());
      }
    }

    if (url.includes('4002')) {
      const commentGeneratorString = new CommentGenerator(this.initialData as MockCommentData);
      const tsvFileWriter = new TSVFileWriter(filepath);

      for (let i = 0; i < dataCount; i++) {
        await tsvFileWriter.write(commentGeneratorString.generate());
      }
    }

    console.log(`File ${filepath} was created!`);
  }
}

