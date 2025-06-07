import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaymentTypeEnum } from '../schemas/payment.schemas';
import { types } from 'util';

export class UserPaymentDto {
  @ApiProperty({
    required: false,
    description: 'Types of payments',
    format: 'string',
  })
  @IsOptional()
  @IsString()
  type?: PaymentTypeEnum;
}
