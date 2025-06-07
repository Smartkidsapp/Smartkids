import { BadRequestException, Injectable } from '@nestjs/common';
import { PaypalSubscriptionReponse } from '../payments/types/Paypal.types';
import { SubscriptionDocument } from './schemas/subscription.schema';
import {
  IProviderSubscription,
  ProviderSubscriptionService,
} from './subscription.interfaces';
import { PaypalService } from '../payments/paypal.service';
import { SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
import { PaymentService } from '../payments/payment.service';
import { PaymentTypeEnum } from '../payments/schemas/payment.schemas';
import { PaymentMethodTypeEnum } from '../payments/schemas/payment-method.schema';
import { TokenService } from '../tokens/token.service';
import { UserDocument } from '../users/schemas/users.schema';

@Injectable()
export class PaypalSubscritionImplementation
  implements IProviderSubscription<PaypalSubscriptionReponse>
{
  constructor(
    private tokenService: TokenService,
    private readonly paypalService: PaypalService,
    private readonly paymentService: PaymentService,
  ) {}

  async changeSubscriptionPlan({
    subscription,
    subscriptionPlan,
  }: {
    user: UserDocument;
    subscription: SubscriptionDocument;
    subscriptionPlan: SubscriptionPlanDocument;
    paymentMethod: string;
  }): Promise<{
    subscription: SubscriptionDocument;
    providerSubscription: PaypalSubscriptionReponse;
  }> {
    if (subscription.paypalPlanId === subscriptionPlan.paypal_plan_id) {
      throw new BadRequestException('Veuillez choisir une formule différente.');
    }

    const paypalSubscription = await this.paypalService.changePlan(
      subscription.paypalSubscriptionId,
      subscriptionPlan.paypal_plan_id,
    );
    subscription.paypalPlanId = subscriptionPlan.paypal_plan_id;
    subscription.paypalSubscriptionId = paypalSubscription.id;
    subscription.plan = subscriptionPlan._id;
    subscription.paymentMethodType = PaymentMethodTypeEnum.PAYPAL;
    await subscription.save();

    return {
      subscription,
      providerSubscription: paypalSubscription,
    };
  }

  async getSubscription(id: string): Promise<PaypalSubscriptionReponse | null> {
    try {
      return await this.paypalService.getSubscriptionDetails(id);
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
    providerSubscription: PaypalSubscriptionReponse;
  }> {
    const userTrialled = user.trialled;

    try {
      const { access_token } = await this.tokenService.generateFullJwt(
        user,
        false,
      );
      const paypalPlanId = !userTrialled
        ? subscriptionPlan.paypal_plan_id
        : subscriptionPlan.paypal_plan_without_trial_id;

      const paypalSubscription = await this.paypalService.createSubscription({
        user,
        planId: paypalPlanId,
        paymentTokenId: paymentMethod,
        accessToken: access_token,
      });

      subscription.paypalSubscriptionId = paypalSubscription.id;
      subscription.plan = subscriptionPlan._id;

      /**
       * If the plan has trial period, we start the subscription with a trial period.
       */
      user.trialled = true;

      // subscription.trialEndsAt =
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
            paypal: {
              paymentMethod,
              planId: subscriptionPlan.paypal_plan_id,
            },
          },
          ref: subscription._id,
          type: PaymentTypeEnum.SUBSCRIPTION,
          price: subscriptionPlan.price,
        }),
      ]);

      return {
        subscription,
        providerSubscription: paypalSubscription,
      };
    } catch (error) {
      throw new BadRequestException('Veuillez réessayer.');
    }
  }

  async cancel(
    userDocument: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<PaypalSubscriptionReponse> {
    const data = await this.paypalService.cancelSubscription(subscription.id);
    return data.data;
  }

  async canUserSetupSubscription(
    user: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<{ status: boolean; message: string }> {
    const sub = await this.paypalService.getSubscriptionDetails(
      subscription.paypalSubscriptionId,
    );

    if (sub.status === 'ACTIVE') {
      return {
        status: false,
        message: 'Vous avez déjà un abonnement actif.',
      };
    }

    return {
      status: true,
      message: 'OK',
    };
  }
}

@Injectable()
export class PaypalSubscriptionService extends ProviderSubscriptionService<PaypalSubscriptionReponse> {
  constructor(
    private readonly paypalService: PaypalService,
    private readonly paymentService: PaymentService,
    private readonly tokenService: TokenService,
  ) {
    super(
      new PaypalSubscritionImplementation(
        tokenService,
        paypalService,
        paymentService,
      ),
    );
  }
}
