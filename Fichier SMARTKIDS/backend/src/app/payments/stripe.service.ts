import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';
import { SubscriptionIntervalUnit } from '../subscriptions/schemas/subscription-plan.schema';
import { AppConfig } from 'src/core/config';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserStatusEnum } from '../users/schemas/users.schema';
import { Model } from 'mongoose';
import { UserService } from '../users/user.service';

export const E_NOT_PAYMENT_METHOD_OWNER = 'E_NOT_PAYMENT_METHOD_OWNER';

@Injectable()
export class StripeService {
  private logger = new Logger(StripeService.name);
  public stripe: Stripe;
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly userService: UserService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  /**
   * Creates a stripe customer and attach it to the given user document.
   *
   * @param user - The user tot create a customer for.
   * @throws if the user is already attached to a customer.
   */
  async createCustomer(user: Stripe.CustomerCreateParams) {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
      address: {
        country: 'France',
      },
    });

    return customer;
  }

  async getPaymentMethod(paymentMethodId: string) {
    const pm = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    return pm;
  }

  getCustomer(customerId: string) {
    return this.stripe.customers.retrieve(customerId);
  }

  async createSetupIntent(stripeCustomerId: string) {
    const [ephemeralKey, setupIntent] = await Promise.all([
      this.stripe.ephemeralKeys.create(
        { customer: stripeCustomerId },
        { apiVersion: '2023-10-16' },
      ),
      this.stripe.setupIntents.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        usage: 'off_session',
      }),
    ]);

    return {
      client_secret: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: stripeCustomerId,
      publishableKey: this.configService.get('STRIPE_PUBLISHABLE_KEY'),
    };
  }

  /**
   * Get the last added payment method of the customer.
   */
  async getCustomerPaymentMethod(customerId: string) {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return (
      paymentMethods.data.map((method) => ({
        last_four: method.card.last4,
        id: method.id,
        brand: method.card.brand,
        // customerId:
        //   typeof method.customer === 'string'
        //     ? method.customer
        //     : method.customer.id,
      })) ?? []
    );
  }

  async deleteCustomerPaymentMethod(
    paymentMethodId: string,
    customerId: string,
  ) {
    const pm = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    if (pm.customer !== customerId) {
      throw new Error(E_NOT_PAYMENT_METHOD_OWNER);
    }

    await this.stripe.paymentMethods.detach(pm.id, {});
  }

  async chargeCustomerPaymentMethod(
    stripeAmount: number,
    {
      customerId,
      paymentMethodId,
      metadata,
    }: {
      paymentMethodId: string;
      customerId: string;
      metadata:
      | {
        boostageId: string;
      }
      | {
        userId: string;
      };
    },
  ) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.floor(stripeAmount),
        metadata,
        currency: 'eur',
        payment_method_types: ['card'],
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        expand: ['latest_charge'],
      });

      return paymentIntent;
    } catch (err) {
      const paymentIntentRetrieved = await this.stripe.paymentIntents.retrieve(
        err.raw.payment_intent.id,
      );
      if (err.code === 'authentication_required') {
        throw new UnauthorizedException({
          code: 'authentication_required.',
          client_secret: paymentIntentRetrieved.client_secret,
        });
      }
      return paymentIntentRetrieved;
    }
  }

  async getPaymentIntent(id: string) {
    return await this.stripe.paymentIntents.retrieve(id, {
      expand: ['latest_charge'],
    });
  }

  async createSubscription({
    customerId,
    priceId,
    paymentMethodId,
    trial_interval_count,
    trial_interval_unit,
    withTrialPeriod = true,
  }: {
    customerId: string;
    priceId: string;
    paymentMethodId: string;
    trial_interval_unit: SubscriptionIntervalUnit;
    trial_interval_count: number;
    withTrialPeriod?: boolean;
  }) {
    try {
      const trial_end =
        trial_interval_count > 0
          ? dayjs().add(trial_interval_count, trial_interval_unit).unix()
          : undefined;

      const createParams: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        collection_method: 'charge_automatically', // capture the invoice automatically with the saved card.
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
          payment_method_types: ['card'],
        },
        default_payment_method: paymentMethodId,
        expand: [
          'latest_invoice.payment_intent.latest_charge',
          'default_payment_method',
        ],
        metadata: {
          customerId: customerId,
          priceId: priceId,
        },
      };

      if (withTrialPeriod) {
        createParams.trial_end = trial_end;
        createParams.trial_settings = {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        };
      }

      const subscription = await this.stripe.subscriptions.create(createParams);

      let paymentItent = (subscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent;

      if (paymentItent && paymentItent?.status !== 'succeeded') {
        /**
         * Let's try to pay the subscription.
         */
        paymentItent = await this.confirmPaymentIntent(
          paymentItent.id,
          paymentMethodId,
        );

        return await this.stripe.subscriptions.retrieve(subscription.id, {
          expand: [
            'latest_invoice.payment_intent.latest_charge',
            'default_payment_method',
          ],
        });
      }

      /**
       * A paypment intent will not be created if there is a trial period.
       */
      return subscription;
    } catch (error) {
      // TODO: Handle require 3D secure payment.
      console.error(error);
      throw new BadRequestException(
        error.raw?.message ??
        "Un problème est survenu lors de la création de l'abonnement.",
      );
    }
  }

  async updateSubscriptionPlan(
    subscriptionId: string,
    newPriceId: string,
    paymentMethodId: string,
  ) {
    const existingSubscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    if (!existingSubscription) {
      throw new NotFoundException('Abonnement introuvable');
    }

    const priceId =
      typeof existingSubscription.items.data[0].price === 'string'
        ? existingSubscription.items.data[0].price
        : existingSubscription.items.data[0].price.id;

    if (priceId === newPriceId) {
      throw new BadGatewayException(
        "Veuillez specifier une formule d'abonnement différente de celle en cours.",
      );
    }

    try {
      const nowUnix = dayjs().unix();
      const trialPassed = nowUnix >= existingSubscription.trial_end;
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          items: [
            {
              price: newPriceId,
              id: existingSubscription.items.data[0].id,
            },
          ],
          proration_behavior: 'create_prorations', // prevents overcharging the customer for unused time in the previous cycle.
          trial_end: trialPassed ? 'now' : existingSubscription.trial_end, // keep the trial period if any.
          expand: ['latest_invoice.payment_intent.latest_charge'],
        },
      );

      let paymentItent = (subscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent;
      console.log(JSON.stringify({ subscription, paymentItent }, null, 2));

      if (paymentItent && paymentItent?.status !== 'succeeded') {
        /**
         * Let's try to pay the subscription.
         */
        paymentItent = await this.confirmPaymentIntent(
          paymentItent.id,
          paymentMethodId,
        );
      }

      return {
        subscription,
        paymentItent,
      };
    } catch (error) {
      // TODO: Handle require 3D secure payment.
      console.error(error);
      throw new BadRequestException("Can't create subscription");
    }
  }

  async confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
          expand: ['latest_charge'],
        },
      );
      return paymentIntent;
    } catch (err) {
      const paymentIntentRetrieved = await this.stripe.paymentIntents.retrieve(
        err.raw.payment_intent.id,
      );
      return paymentIntentRetrieved;
    }
  }

  async capturePaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.capture(paymentIntentId);
      paymentIntent;
    } catch (err) {
      console.log({ err });
      console.log('Error code is: ', err.code);
      const paymentIntentRetrieved = await this.stripe.paymentIntents.retrieve(
        err.raw.payment_intent.id,
      );
      console.log('PI retrieved: ', paymentIntentRetrieved.id);
      return paymentIntentRetrieved;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const existaing =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      if (!existaing) {
        throw new NotFoundException('Abonnement introuvable');
      }

      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: true,
          expand: ['latest_invoice.payment_intent.latest_charge'],
        },
      );
      return subscription;
    } catch (error) {
      console.error(error);
      throw new Error("Can't cancel subscription");
    }
  }

  async cancelSubscriptionCancelation(subscriptionId: string) {
    try {
      const existaing =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      if (!existaing) {
        throw new NotFoundException('Abonnement introuvable');
      }

      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: false,
          expand: ['latest_invoice.payment_intent.latest_charge'],
        },
      );
      return subscription;
    } catch (error) {
      console.error(error);
      throw new Error("Can't cancel subscription");
    }
  }

  async resetSubscriptinCyle(id: string) {
    try {
      const subscription = await this.stripe.subscriptions.update(id, {
        expand: ['latest_invoice.payment_intent.latest_charge'],
        billing_cycle_anchor: 'now', // the subscription will start now.
        proration_behavior: 'create_prorations', //prevents overcharging the customer for unused time in the previous cycle.
      });
      return subscription;
    } catch (error) {
      throw new Error("Can't reset subscription cycle");
    }
  }

  async refundPayment(paymentItentId: string) {
    return await this.stripe.refunds.create({
      payment_intent: paymentItentId,
      reason: 'requested_by_customer',
    });
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret,
    );
  }

  async handleStripeWebhook(
    request: Request,
    response: Response,
    signature: string,
  ) {

    let event: Stripe.Event;

    try {
      event = await this.constructEventFromPayload(signature, request.body)
    } catch (err) {
      console.error('Webhook Error:', err.message);
      return response.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Optional: Map customerId to your user ID (assuming you saved it)
        await this.userService.updateUserStatusByStripeCustomerId(customerId, UserStatusEnum.INACTIVE);
        break;
      }
      // Add more event cases as needed
    }

    return response.status(HttpStatus.OK).json({ received: true });
  }

  async createSubscriptionPrice({
    interval,
    price,
    interval_count = 1,
  }: {
    interval: SubscriptionIntervalUnit;
    price: number;
    interval_count?: number;
  }) {
    const productID = this.configService.get('STRIPE_SUBSCRIPTION_PRODUCT_ID');

    const stripePrice = await this.stripe.prices.create({
      unit_amount: Math.floor(price * 100),
      currency: 'eur',
      product: productID,
      recurring: {
        interval_count,
        interval,
      },
    });

    await this.stripe.products.update(productID, {
      default_price: stripePrice.id,
    });

    /**
     * check if are existing prices with the same pricing interval
     * exists and deactivate them.
     */
    const existingPrices = await this.getPricesByRecurrence({
      interval_count,
      interval_unit: interval,
    });
    if (existingPrices) {
      await Promise.all(
        existingPrices.map((price) => {
          if (price.id !== stripePrice.id) {
            return this.deactivatePrice(price.id);
          }
        }),
      );
    }

    return stripePrice;
  }

  async editSubscriptionPrice({
    interval,
    price,
    priceID,
    interval_count = 1,
  }: {
    interval: 'day' | 'week' | 'month' | 'year';
    price: number;
    priceID: string;
    interval_count?: number;
  }) {
    const productID = this.configService.get('STRIPE_SUBSCRIPTION_PRODUCT_ID');

    const stripePrice = await this.stripe.prices.create({
      unit_amount: Math.floor(price * 100),
      currency: 'eur',
      product: productID,
      active: true,
      recurring: {
        interval,
        interval_count,
      },
    });

    await this.stripe.products.update(productID, {
      default_price: stripePrice.id,
    });

    /**
     * Deactivates the previous price with the same
     * recurring interval and productID.
     */
    const pricesWithSameRecurrence = await this.getPricesByRecurrence({
      interval_count,
      interval_unit: interval,
    });

    const priceWithSameRecurrenceIds = [
      ...pricesWithSameRecurrence.map((p) => p.id),
      priceID,
    ];
    await Promise.all(
      priceWithSameRecurrenceIds.map((id) => {
        if (id !== stripePrice.id) {
          return this.deactivatePrice(id);
        }
      }),
    );

    return stripePrice;
  }

  async listPrices() {
    const productID = this.configService.get('STRIPE_SUBSCRIPTION_PRODUCT_ID');

    const prices = await this.stripe.prices.list({
      active: true,
      product: productID,
    });

    return prices.data;
  }

  async getPricesByRecurrence({
    interval_count,
    interval_unit,
  }: {
    interval_unit: SubscriptionIntervalUnit;
    interval_count: number;
  }): Promise<Stripe.Price[] | null> {
    const prices = await this.stripe.prices.list({
      recurring: {
        interval: interval_unit,
      },
    });

    return prices.data.filter(
      (price) => price.recurring.interval_count === interval_count,
    );
  }

  async deactivatePrice(priceId: string) {
    const stripePrice = await this.stripe.prices.update(priceId, {
      active: false,
    });

    return stripePrice;
  }

  /**
   * Deactivates an price and update the default price
   * in case the price being deleted in the default one.
   */
  async deletePrice(priceId: string) {
    const prices = await this.listPrices();
    const otherPrices = prices.filter((price) => price.id !== priceId);

    if (!otherPrices.length) {
      throw new Error(
        'You cannot deactivate all prices, at leat one price must remain active and be the default one.',
      );
    }

    const productID = this.configService.get('STRIPE_SUBSCRIPTION_PRODUCT_ID');
    await this.stripe.products.update(productID, {
      default_price: otherPrices[0].id,
    });

    return await this.deactivatePrice(priceId);
  }

  async getSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async getPaymentIntentFailureMessage(paymentItent: Stripe.PaymentIntent) {
    if (paymentItent.status === 'succeeded') {
      return null;
    }

    switch (paymentItent.status) {
      case 'requires_payment_method':
        return 'Le paiement ne peut pas être traité car la méthode de paiement a été refusée. Veuillez essayer avec une autre méthode de paiement.';
      case 'requires_confirmation':
        return 'Le paiement doit être confirmé avant de pouvoir être traité. Veuillez confirmer le paiement.';
      case 'requires_action':
        return 'Une action supplémentaire est nécessaire pour finaliser le paiement. Veuillez suivre les instructions fournies.';
      case 'processing':
        return 'Le paiement est en cours de traitement. Veuillez attendre la confirmation.';
      case 'requires_capture':
        return 'Le paiement doit être capturé avant de pouvoir être finalisé. Veuillez capturer le paiement.';
      case 'canceled':
        return 'Le paiement a été annulé. Veuillez réessayer si vous souhaitez procéder au paiement.';
      default:
        return 'Une erreur inconnue est survenue lors du traitement de votre paiement. Veuillez réessayer plus tard.';
    }
  }
}
