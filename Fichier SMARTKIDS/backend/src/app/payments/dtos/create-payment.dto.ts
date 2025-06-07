import { IsEnum, IsString } from 'class-validator';
import {
  PAYMENT_METHOD_TYPES,
  PaymentMethodTypeEnum,
} from '../schemas/payment-method.schema';

export class CreatePaymentDto {
  @IsString()
  @IsEnum(PAYMENT_METHOD_TYPES)
  paymentMethodType: PaymentMethodTypeEnum;

  @IsString()
  paymentMethod: string;
}
