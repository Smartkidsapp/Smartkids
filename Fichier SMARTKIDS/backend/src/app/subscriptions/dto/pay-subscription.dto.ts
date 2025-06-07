import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { PAYMENT_METHOD_TYPES } from '../schemas/subscription.schema';
import { PaymentMethodTypeEnum } from 'src/app/payments/schemas/payment-method.schema';

export class PaySubscriptionDto {
  @IsString()
  @IsMongoId()
  planId: string;

  @IsString()
  @IsEnum(PAYMENT_METHOD_TYPES)
  paymentMethodType: PaymentMethodTypeEnum;

  @IsString()
  paymentMethod: string;
}
