import Stripe from 'stripe';
import { SubscriptionDocument } from './schemas/subscription.schema';
import {
  IProviderSubscription,
  ProviderSubscriptionService,
} from './subscription.interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeService } from '../payments/stripe.service';
import { ModuleRef } from '@nestjs/core';
import { PaymentService } from '../payments/payment.service';
import { SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
import { PaymentTypeEnum } from '../payments/schemas/payment.schemas';
import { PaymentMethodTypeEnum } from '../payments/schemas/payment-method.schema';
import { UserDocument, UserStatusEnum } from '../users/schemas/users.schema';

@Injectable()
export class StripeSubscritionImplementation
  implements IProviderSubscription<Stripe.Subscription>
{
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly stripeService: StripeService,
    private readonly paymentService: PaymentService,
  ) {}

  async changeSubscriptionPlan({
    paymentMethod,
    subscription,
    subscriptionPlan,
  }: {
    user: UserDocument;
    subscription: SubscriptionDocument;
    subscriptionPlan: SubscriptionPlanDocument;
    paymentMethod: string;
  }): Promise<{
    subscription: SubscriptionDocument;
    providerSubscription: Stripe.Subscription;
  }> {
    if (subscription.stripePriceId === subscriptionPlan.stripe_price_id) {
      throw new BadRequestException('Veuillez choisir une formule différente.');
    }

    const { paymentItent, subscription: stripeSubscription } =
      await this.stripeService.updateSubscriptionPlan(
        subscription.stripeSubscriptionId,
        subscriptionPlan.stripe_price_id,
        paymentMethod,
      );

    /**
     * TODO: deal with 3D secure payment.
     * By checing the status of the paymentIntent.
     */
    subscription.stripePriceId = subscriptionPlan.stripe_price_id;
    subscription.plan = subscriptionPlan._id;
    subscription.plan = subscriptionPlan._id;
    subscription.paymentMethodType = PaymentMethodTypeEnum.STRIPE;
    await subscription.save();

    return {
      subscription,
      providerSubscription: stripeSubscription,
    };
  }

  async getSubscription(id: string): Promise<Stripe.Subscription | null> {
    try {
      return await this.stripeService.getSubscription(id);
    } catch (error) {
      return null;
    }
  }

  async setupUserSubscription({
    paymentMethod,
    subscription,
    subscriptionPlan,
    user,
  }: {
    subscriptionPlan: SubscriptionPlanDocument;
    paymentMethod: string;
    subscription: SubscriptionDocument;
    user: UserDocument;
  }): Promise<{
    subscription: SubscriptionDocument;
    providerSubscription: Stripe.Subscription;
  }> {
    const userTrialled = user.trialled;
    const stripeSubscription = await this.stripeService.createSubscription({
      customerId: user.stripeCustomerId,
      priceId: subscriptionPlan.stripe_price_id,
      paymentMethodId: paymentMethod,
      trial_interval_unit: subscriptionPlan.trial_interval_unit,
      trial_interval_count: subscriptionPlan.trial_interval_count,
      withTrialPeriod: !userTrialled,
    });

    if (['trialing', 'active'].includes(stripeSubscription.status)) {
      /**
       * Since the subscription document can be updated
       * let's also save this.
       */
      subscription.stripeSubscriptionId = stripeSubscription.id;
      subscription.plan = subscriptionPlan._id;
      subscription.paymentMethodType = PaymentMethodTypeEnum.STRIPE;

      /**
       * Give the user access as a driver.
       */
      user.status = UserStatusEnum.ACTIVE;
      user.trialled = true;

      const stripePaymentMethod =
        stripeSubscription.default_payment_method as Stripe.PaymentMethod;

      await Promise.all([
        subscription.save(),
        user.save(),
        this.paymentService.createPaymentRecord({
          user: user._id,
          context: {
            interval: {
              unit: subscriptionPlan.interval_unit,
              count: subscriptionPlan.interval_count,
            },
            stripe: {
              paymentMethod,
              priceId: subscriptionPlan.stripe_price_id,
              card: {
                type: stripePaymentMethod.card.brand,
                last4: stripePaymentMethod.card.last4,
              },
            },
          },
          ref: subscription._id,
          type: PaymentTypeEnum.SUBSCRIPTION,
          price: subscriptionPlan.price,
        }),
      ]);
    }

    return {
      subscription,
      providerSubscription: stripeSubscription,
    };
  }

  async cancel(
    userDocument: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<Stripe.Subscription | null> {
    const res = await this.stripeService.cancelSubscription(
      subscription.stripeSubscriptionId,
    );

    return res;
  }

  async canUserSetupSubscription(
    user: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<{ status: boolean; message: string }> {
    const sub = await this.stripeService.getSubscription(
      subscription.stripeSubscriptionId,
    );

    if (!sub) {
      return {
        status: false,
        message: 'Abonnement non trouvé.',
      };
    }

    const activeStatus = ['trialing', 'active'];
    if (activeStatus.includes(sub.status)) {
      return {
        status: false,
        message: 'Vous avez déjà un abonnement actif.',
      };
    }

    return {
      status: true,
      message: 'Vous pouvez souscrire à un abonnement.',
    };
  }
}

@Injectable()
export class StripeSubscriptionService extends ProviderSubscriptionService<Stripe.Subscription> {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly stripeService: StripeService,
    private readonly paymentService: PaymentService,
  ) {
    super(
      new StripeSubscritionImplementation(
        moduleRef,
        stripeService,
        paymentService,
      ),
    );
  }

  async cancelCancelation(
    userDocument: UserDocument,
    subscription: SubscriptionDocument,
  ) {
    const res = await this.stripeService.cancelSubscriptionCancelation(
      subscription.stripeSubscriptionId,
    );

    return res;
  }
}
