import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export default class LoginUserDto {
  @IsEmail({}, {message: 'Email must be a valid address'})
  public email!: string;

  @IsString({message: 'Password is required'})
  @MinLength(10, {message: 'Minimum password length must be 5'})
  @MaxLength(100, {message: 'Maximum password length must be 100'})
  public password!: string;
}
