import { IsString } from 'class-validator';

export class ListSubscriptionPlansDto {
  // @IsEnum(['stripe', 'paypal'])
  @IsString()
  paymentProvider: 'stripe' | 'paypal';
}
