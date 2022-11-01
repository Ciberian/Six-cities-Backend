import { User } from '../../types/user.type.js';
import typegoose, { getModelForClass, defaultClasses } from '@typegoose/typegoose';
import { createSHA256 } from '../../utils/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.avatarUrl = data.avatarUrl;
    this.isPro = data.isPro;
  }

  @prop({
    unique: true,
    required: true,
    match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect']
  })
  public email!: string;

  @prop({
    required: true,
    match: [/^\S*$/, 'Spaces in the password are not allowed'],
    minlength: [6, 'Min length for the password is 6 simbols']
  })
  public password!: string;

  @prop({
    minlength: [1, 'Min length for the name is 1 simbol'],
    maxlength: [15, 'Max length for the name is 15 simbols'],
  })
  public name!: string;

  @prop()
  public isPro: boolean;

  @prop({
    match: [/^(?:.*\.(?=(jpg|jpeg|png)$))?[^.]*$/i, 'Only jpg or png format is allowed']
  })
  public avatarUrl?: string;

  @prop()
  public favorites!: string[];

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
