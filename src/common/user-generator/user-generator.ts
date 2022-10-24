import { MockUserData } from '../../types/mock-user.type.js';
import { getRandomItem } from '../../utils/random.js';
import { UserGeneratorInterface } from './user-generator.interface.js';


export default class UserGenerator implements UserGeneratorInterface {
  constructor(private readonly mockData: MockUserData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const password = getRandomItem<string>(this.mockData.passwords);
    const isPro = Math.random() >= 0.5;

    return [email, name, password, isPro].join('\t');
  }
}
