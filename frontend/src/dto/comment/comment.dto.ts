import UserDto from '../user/user.dto';

export default class CommentDto {
  public id!: string;

  public text!: string;

  public rank!: number;

  public postDate!: string;

  public user!: UserDto;
}
