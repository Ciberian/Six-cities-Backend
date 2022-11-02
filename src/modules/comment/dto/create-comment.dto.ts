import { IsString, Length, Min, Max } from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'text is required'})
  @Length(5, 1024, {message: 'Min length is 5, max is 1024'})
  public text!: string;

  @Min(1, {message: 'Minimum rank is 1'})
  @Max(5, {message: 'Maximum rank is 5'})
  public rank!: number;

  public offerId!: string;

  public userId!: string;
}
