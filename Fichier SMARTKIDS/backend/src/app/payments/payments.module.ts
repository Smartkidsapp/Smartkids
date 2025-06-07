import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from './schemas/payment-method.schema';
import { HttpModule } from '@nestjs/axios';
import { PaymentMethodService } from './payment-methods.service';
import { StripeService } from './stripe.service';
import { PaypalService } from './paypal.service';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schemas';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentsController } from './payments.controller';
import { UserModule } from '../users/user.module';
import { SubscriptionModule } from '../subscriptions/subscription.module';
import {
  PaymentCounter,
  PaymentCounterSchema,
} from './schemas/payment-counter.schemas';

@Module({
  controllers: [PaymentMethodsController, PaymentsController],
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: PaymentCounter.name, schema: PaymentCounterSchema },
    ]),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => UserModule),
    HttpModule,
  ],
  providers: [
    PaymentMethodService,
    StripeService,
    PaypalService,
    PaymentService,
  ],
  exports: [PaymentMethodService, StripeService, PaypalService, PaymentService],
})
export class PaymentModule {}
