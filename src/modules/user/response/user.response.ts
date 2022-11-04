import { Expose } from 'class-transformer';

export default class UserResponse {
  @Expose()
  public id!: string;

  @Expose()
  public avatarPath?: string;

  @Expose()
  public email!: string;

  @Expose()
  public isPro!: boolean;

  @Expose()
  public name!: string;

  @Expose()
  public token!: string;

  @Expose()
  public favorites!: string[];
}
