import { MockCommentData } from '../../types/mock-comment.type.js';
import { getRandomItem } from '../../utils/random.js';
import { CommentGeneratorInterface } from './comment-generator.interface.js';


export default class CommentGenerator implements CommentGeneratorInterface {
  constructor(private readonly mockData: MockCommentData) {}

  public generate(): string {
    const text = getRandomItem<string>(this.mockData.text);
    const rank = getRandomItem<number>(this.mockData.rank);

    return [text, rank].join('\t');
  }
}
