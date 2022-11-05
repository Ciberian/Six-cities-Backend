export default class CreateUserDto {
  email?: string;
  password?: string;
  avatarPath?: string;
  id?: string;
  isPro?: boolean;
  name?: string;
  favorites?: string[];
}
