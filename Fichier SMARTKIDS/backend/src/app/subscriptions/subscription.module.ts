import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionSchema,
} from './schemas/subscription.schema';
import { PaymentModule } from '../payments/payments.module';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './schemas/subscription-plan.schema';
import { SubscriptionPlanController } from './Subscription-plan.controller';
import { SubscriptionPlanService } from './Subscription-plan.service';
import { SubscriptionEmailMessenger } from './subscription-email-messenger.service';
import { BullModule } from '@nestjs/bull';
import {
  StripeSubscriptionService,
  StripeSubscritionImplementation,
} from './stripe-subscription.service';
import {
  PaypalSubscriptionService,
  PaypalSubscritionImplementation,
} from './paypal-subscription.service';
import { UserModule } from '../users/user.module';
import { TokenModule } from '../tokens/token.module';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  controllers: [SubscriptionController, SubscriptionPlanController, StripeWebhookController],
  providers: [
    SubscriptionService,
    SubscriptionPlanService,
    SubscriptionEmailMessenger,
    StripeSubscriptionService,
    StripeSubscritionImplementation,
    PaypalSubscriptionService,
    PaypalSubscritionImplementation,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    BullModule.registerQueue({
      name: 'messenger',
    }),
    forwardRef(() => PaymentModule),
    forwardRef(() => UserModule),
    forwardRef(() => TokenModule),
  ],
  exports: [SubscriptionService, SubscriptionEmailMessenger],
})
export class SubscriptionModule {}
