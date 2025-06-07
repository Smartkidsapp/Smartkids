import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PaymentMethodService } from './payment-methods.service';
import { Request } from 'express';
import {
  CreatePaypalPaymentTokenDto,
  PaymentMethodDto,
} from './dtos/create-payment-method.dto';
import { SetupIntentResponse } from './types/stipe.types';
import { UserRoleEnum } from '../users/schemas/users.schema';
import { OnlyRoles } from '../auth/decorators/only-roles.decorator';

@ApiTags('Payment-methods')
@ApiBearerAuth()
@Controller('')
export class PaymentMethodsController {
  constructor(private readonly paymentService: PaymentMethodService) {}

  @OnlyRoles(UserRoleEnum.CLIENT, UserRoleEnum.DRIVER)
  @Post('/payment-methods')
  async createStripeSetupIntent(
    @Req() request: Request,
    @Query() params: PaymentMethodDto,
  ) {
    const userId = request.user.sub;

    let data:
      | SetupIntentResponse
      | {
          tokenId: string;
        };
    if (params.type === 'stripe') {
      data = await this.paymentService.createStripeSetupIntent(userId);
    } else {
      data = await this.paymentService.createPaypSetupToken(userId);
    }

    return { data };
  }

  @OnlyRoles(UserRoleEnum.CLIENT)
  @Post('/ppl-pm-tokens')
  async createPaypalPaymentToken(
    @Req() request: Request,
    @Body() createPaypalPaymentTokenDto: CreatePaypalPaymentTokenDto,
  ) {
    const userId = request.user.sub;

    await this.paymentService.confirmPaypalPm(
      userId,
      createPaypalPaymentTokenDto,
    );

    return {
      message: 'Méthode de paiement PayPal ajoutée avec succès.',
    };
  }

  @OnlyRoles(UserRoleEnum.CLIENT, UserRoleEnum.DRIVER)
  @Get('/payment-methods')
  async listPaymentMethods(
    @Req() request: Request,
    @Query() params: PaymentMethodDto,
  ) {
    const userId = request.user.sub;
    const data = await this.paymentService.listUserPaymentMethod(
      userId,
      params.type,
    );

    return { data };
  }

  @OnlyRoles(UserRoleEnum.CLIENT, UserRoleEnum.DRIVER)
  @ApiProperty({
    name: 'id',
    required: true,
    type: String,
    description: 'The id of the payment method to delete',
  })
  @Delete('/payment-methods/:id')
  async deletePaymentMethod(
    @Param('id') id: string,
    @Req() request: Request,
    @Query() params: PaymentMethodDto,
  ) {
    const userId = request.user.sub;
    await this.paymentService.deleteMethod(id, userId, params.type);

    return {
      message: 'Méthode de paiement supprimée avec succès.',
    };
  }
}
