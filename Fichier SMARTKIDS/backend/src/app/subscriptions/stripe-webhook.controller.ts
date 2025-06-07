import { Controller, Post, Headers, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from '../payments/stripe.service';
import { PublicAccess } from '../auth/decorators/public-access.decorator';

@ApiTags('Subscriptions')
@Controller('stripe-webhook')
export class StripeWebhookController {

  constructor(
    public readonly stripeService: StripeService,
  ) {
  }

  @PublicAccess()
  @Post('stripe')
  async handleStripeWebhook(
    @Req() request: Request,
    @Res() response: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleStripeWebhook(request, response, signature);
  }
}
