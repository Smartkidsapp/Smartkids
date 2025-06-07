import { IsMongoId } from 'class-validator';

export class CreateSubscriptionDto {
  @IsMongoId()
  user: string;
}
