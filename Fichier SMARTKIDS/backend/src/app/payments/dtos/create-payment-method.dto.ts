import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaymentMethodDto {
  @ApiProperty({
    title: 'Le type de méthode de paiement.',
    type: String,
    default: 'stripe',
    enum: ['paypal', 'stripe'],
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Veuillez ajouter le type.',
  })
  type: 'paypal' | 'stripe' = 'stripe';
}

export class CreatePaypalPaymentTokenDto {
  @ApiProperty({
    title:
      'The vaultSetupToken got when the client approved to save his account for future use.u',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString({
    message: 'Veuillez ajouter le type.',
  })
  vaultSetupToken: string;
}
