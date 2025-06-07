import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PayPalOrderResponse,
  PaypalOauthTokenResponse,
  PaypalOrderRequest,
  PaypalPaymentTokenResponse,
  PaypalProductResponse,
  PaypalSetupTokenResponse,
  PaypalSubscriptionReponse,
  RefundResponse,
} from './types/Paypal.types';
import { E_NOT_PAYMENT_METHOD_OWNER } from './stripe.service';
import dayjs from 'dayjs';
import { AppConfig } from 'src/core/config';
import { UserDocument } from '../users/schemas/users.schema';

interface CaptureOrderResult {
  order: PayPalOrderResponse | null;
  error?: string;
}

@Injectable()
export class PaypalService {
  private accessToken: string;
  private paypalDomain: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.paypalDomain =
      this.configService.get('PAYPAL_ENV') === 'sandbox'
        ? 'api-m.sandbox.paypal.com'
        : 'api-m.paypal.com';
  }

  private async getAccessToken() {
    // TODO: deal zith token expiration.s
    // if (this.accessToken) {
    //   return this.accessToken;
    // }
    const authString = Buffer.from(
      `${this.configService.get('PAYPAL_CLIENT_ID')}:${this.configService.get('PAYPAL_CLIENT_SECRET')}`,
    ).toString('base64');

    const {
      data: { access_token },
    } = await this.httpService.axiosRef.post<PaypalOauthTokenResponse>(
      `https://${this.paypalDomain}/v1/oauth2/token`,
      {
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authString}`,
        },
      },
    );

    this.accessToken = access_token;
    return this.accessToken;
  }

  async createSetupToken() {
    const access_token = await this.getAccessToken();
    const { data } =
      await this.httpService.axiosRef.post<PaypalSetupTokenResponse>(
        `https://${this.paypalDomain}/v3/vault/setup-tokens`,
        {
          payment_source: {
            paypal: {
              usage_type: 'MERCHANT',
              experience_context: {
                vault_instruction: 'ON_PAYER_APPROVAL',
                return_url:
                  this.configService.get('PAYMENT_GATEWAY_URL') +
                  '/setup-complete',
                cancel_url:
                  this.configService.get('PAYMENT_GATEWAY_URL') + '/paypal',
              },
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
          },
        },
      );

    return {
      tokenId: data.id,
    };
  }

  async createPaymentToken(setupTokenId: string, user: UserDocument) {
    const access_token = await this.getAccessToken();
    const { data: paymentTokenResult } =
      await this.httpService.axiosRef.post<PaypalPaymentTokenResponse>(
        `https://${this.paypalDomain}/v3/vault/payment-tokens`,
        {
          payment_source: {
            token: {
              id: setupTokenId,
              type: 'SETUP_TOKEN',
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
          },
        },
      );

    user.paypalCustomerIds.push(paymentTokenResult.customer.id);
    const customerIds = new Map(
      user.paypalCustomerIds.map((v, idx) => [idx, v]),
    );

    user.paypalCustomerIds = [...customerIds.values()];
    await user.save();

    return paymentTokenResult;
  }

  async captureOrderWithPaymentMethod(
    paymentTokenId: string,
    amount: number,
  ): Promise<CaptureOrderResult> {
    try {
      const access_token = await this.getAccessToken();
      const body: PaypalOrderRequest = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'EUR', value: amount.toFixed(2) },
          },
        ],
        payment_source: {
          paypal: {
            vault_id: paymentTokenId,
          },
        },
      };

      const { data: order } =
        await this.httpService.axiosRef.post<PayPalOrderResponse>(
          `https://${this.paypalDomain}/v2/checkout/orders`,
          body,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
              'PayPal-Request-Id': `${Date.now()}`,
            },
          },
        );

      return { order };
    } catch (error) {
      let errorMessage: string;

      const errorDetails = error.details?.[0] || {};
      const paypalErrorMessage =
        errorDetails.description ||
        "Une erreur inattendue s'est produite lors du traitement de votre paiement. Veuillez réessayer ou contacter le support";

      switch (errorDetails.issue) {
        case 'INSTRUMENT_DECLINED':
          errorMessage =
            'Votre moyen de paiement a été refusé. Veuillez essayer une autre méthode de paiement ou contacter votre banque.';
          break;
        case 'PAYMENT_SOURCE_DECLINED':
          errorMessage =
            'Le paiement a été refusé. Veuillez vérifier le solde de votre compte ou essayer une autre méthode de paiement.';
          break;
        case 'PAYER_ACTION_REQUIRED':
          errorMessage =
            "Une action supplémentaire est nécessaire pour finaliser ce paiement. Veuillez consulter votre compte PayPal pour plus d'instructions.";
          break;
        case 'PAYMENT_APPROVAL_EXPIRED':
          errorMessage =
            "L'approbation du paiement a expiré. Veuillez recommencer le processus de paiement.";
          break;
        case 'INVALID_RESOURCE_ID':
          errorMessage =
            'Jeton de paiement invalide. Veuillez réessayer ou utiliser une autre méthode de paiement.';
          break;
        case 'PERMISSION_DENIED':
          errorMessage =
            'Autorisation refusée. Veuillez vous assurer que vous disposez des autorisations nécessaires pour effectuer cette action.';
          break;
        case 'INTERNAL_SERVER_ERROR':
          errorMessage =
            'Nous rencontrons des difficultés techniques avec PayPal. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = paypalErrorMessage;
      }

      return { order: null, error: errorMessage };
    }
  }

  async getCustomerPaymentMethod(customerId: string) {
    const access_token = await this.getAccessToken();
    const { data } = await this.httpService.axiosRef.get<{
      customer: {
        id: string;
        merchant_customer_id: string;
      };
      payment_tokens: PaypalPaymentTokenResponse[];
      links: any[];
    }>(
      `https://${this.paypalDomain}/v3/vault/payment-tokens?customer_id=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'PayPal-Request-Id': `${Date.now()}`,
        },
      },
    );

    return (
      data.payment_tokens?.map((pm) => ({
        customerId: pm.customer.id,
        email: pm.payment_source.paypal.email_address,
        id: pm.id,
      })) ?? []
    );
  }

  async deletePaymentMethod(id: string, user: UserDocument) {
    const access_token = await this.getAccessToken();

    const { data } =
      await this.httpService.axiosRef.get<PaypalPaymentTokenResponse>(
        `https://${this.paypalDomain}/v3/vault/payment-tokens/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
          },
        },
      );

    if (!user.paypalCustomerIds.includes(data.customer.id)) {
      throw new Error(E_NOT_PAYMENT_METHOD_OWNER);
    }

    await this.httpService.axiosRef.delete<PaypalPaymentTokenResponse>(
      `https://${this.paypalDomain}/v3/vault/payment-tokens/${id}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'PayPal-Request-Id': `${Date.now()}`,
        },
      },
    );
  }

  async createProduct() {
    const access_token = await this.getAccessToken();
    const { data } =
      await this.httpService.axiosRef.post<PaypalProductResponse>(
        `https://${this.paypalDomain}/v1/catalogs/products`,
        {
          name: 'RideEasy plan premium.',
          description:
            "Accédez à une expérience exceptionnelle avec notre abonnement premium. Profitez d'avantages exclusifs, de mises à jour privilégiées et d'une immersion totale dans notre univers.",
          type: 'SERVICE',
          category: 'TRANSPORTATION_SERVICES',
          // image_url: 'https://example.com/streaming.jpg',
          // home_url: 'https://example.com/home',
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

    return data;
  }

  async createPlan({
    trial = {
      interval_count: 3,
      interval_unit: 'MONTH',
    },
    description,
    regular,
    name,
  }: {
    name: string;
    trial?: {
      interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
      interval_count: number;
    };
    regular: {
      interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
      interval_count: number;
      price: number;
    };
    description: string;
  }) {
    console.log('creating paypal plan....');
    const productId = this.configService.get('PAYPAL_PRODUCT_ID');

    const access_token = await this.getAccessToken();

    /**
     * Check if there is a current plan that has the same regular
     * pricing model (interval_unit and interval_count).
     */
    const planWithSamePricingModels = await this.getPlansByRecurringUnit({
      interval_count: regular.interval_count,
      interval_unit: regular.interval_unit,
    });

    /**
     * Deactivate the current plans (trial & non-trial) with the same pricing model.
     */
    if (planWithSamePricingModels.length) {
      await Promise.all(
        planWithSamePricingModels.map(async (plan) => {
          await this.deactivatePlan(plan.id);
        }),
      );
    }

    const CYCLES = [];
    if (trial.interval_count > 0) {
      CYCLES.unshift({
        frequency: {
          interval_unit: trial.interval_unit,
          interval_count: trial.interval_count,
        },
        tenure_type: 'TRIAL',
        sequence: 1,
        total_cycles: 1, // The number of times the trial will run.
        pricing_scheme: {
          fixed_price: {
            value: '0',
            currency_code: 'EUR',
          },
        },
      });
    }

    CYCLES.push({
      frequency: {
        interval_unit: regular.interval_unit,
        interval_count: regular.interval_count,
      },
      tenure_type: 'REGULAR',
      sequence: CYCLES.length + 1,
      total_cycles: 0, // Infinite number of times until a cancellation is made.
      pricing_scheme: {
        fixed_price: {
          value: regular.price.toFixed(2),
          currency_code: 'EUR',
        },
      },
    });

    try {
      /**
       * Create two plan, one with a trial period and the other
       * without a trial period.
       */
      const [responseWithTrial, responseWithoutTrial] = await Promise.all([
        this.httpService.axiosRef.post(
          `https://${this.paypalDomain}/v1/billing/plans`,
          {
            product_id: productId,
            name,
            description: description.slice(0, 30),
            status: 'ACTIVE',
            billing_cycles: CYCLES,
            payment_preferences: {
              auto_bill_outstanding: true,
              // setup_fee: { value: '10', currency_code: 'EUR' },
              setup_fee_failure_action: 'CONTINUE',
              payment_failure_threshold: 3,
            },
            // taxes: { percentage: '10', inclusive: false },
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'PayPal-Request-Id': `${Date.now()}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Prefer: 'return=representation',
            },
          },
        ),
        this.httpService.axiosRef.post(
          `https://${this.paypalDomain}/v1/billing/plans`,
          {
            product_id: productId,
            name,
            description: description.slice(0, 30),
            status: 'ACTIVE',
            billing_cycles: [
              {
                frequency: {
                  interval_unit: regular.interval_unit,
                  interval_count: regular.interval_count,
                },
                tenure_type: 'REGULAR',
                sequence: 1,
                total_cycles: 0, // Infinite number of times until a cancellation is made.
                pricing_scheme: {
                  fixed_price: {
                    value: regular.price.toFixed(2),
                    currency_code: 'EUR',
                  },
                },
              },
            ],
            payment_preferences: {
              auto_bill_outstanding: true,
              // setup_fee: { value: '10', currency_code: 'EUR' },
              setup_fee_failure_action: 'CONTINUE',
              payment_failure_threshold: 3,
            },
            // taxes: { percentage: '10', inclusive: false },
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'PayPal-Request-Id': `${Date.now()}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Prefer: 'return=representation',
            },
          },
        ),
      ]);

      if (
        responseWithTrial.status.toString().startsWith('2') &&
        responseWithoutTrial.status.toString().startsWith('2')
      ) {
        return {
          withTrial: responseWithTrial.data,
          withoutTrial: responseWithoutTrial.data,
        };
      }

      throw new Error('Error creating plan.');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updatePlan({
    planId,
    planWithoutTrialId,
    ...rest
  }: {
    planId: string;
    planWithoutTrialId: string;
    name: string;
    trial?: {
      interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
      interval_count: number;
    };
    regular: {
      interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
      interval_count: number;
      price: number;
    };
    description: string;
  }) {
    try {
      await Promise.all([
        this.deactivatePlan(planId),
        this.deactivatePlan(planWithoutTrialId),
      ]);
    } catch (error) {}

    return await this.createPlan(rest);
  }

  async listPlans(access_token: string) {
    let activePlans = [];
    let nextPageUrl = `https://${this.paypalDomain}/v1/billing/plans`;
    try {
      while (nextPageUrl) {
        const response = await this.httpService.axiosRef.get(nextPageUrl, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
        });

        const data = response.data;
        const plans = data.plans ?? [];
        activePlans = activePlans.concat(
          plans.filter((p) => p.status === 'ACTIVE'),
        );

        // Check for pagination links
        nextPageUrl = null;
        if (data.links) {
          const nextLink = data.links.find((link) => link.rel === 'next');
          if (nextLink) {
            nextPageUrl = nextLink.href;
          }
        }
      }

      console.log(
        'List of Active Plans:',
        JSON.stringify(activePlans, null, 2),
      );
      return activePlans;
    } catch (error) {
      console.error('Error listing plans:', error.message);
      throw error;
    }
  }

  async getPlansByRecurringUnit({
    interval_count,
    interval_unit,
  }: {
    interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
    interval_count: number;
  }) {
    const access_token = await this.getAccessToken();
    try {
      const plans = await this.listPlans(access_token);

      const plansWithSameBillingCycle = plans.filter((plan) => {
        /**
         * Check the billing cycle with the save
         * frequency intervals.
         */
        const regularCycle = plan.billing_cycles.find(
          (p) =>
            p.frequency.interval_unit === interval_unit.toUpperCase() &&
            p.frequency.interval_count === interval_count &&
            p.tenure_type === 'REGULAR',
        );
        return !!regularCycle;
      });

      return plansWithSameBillingCycle;
    } catch (error) {
      console.error('Error fetching plans:', error.message);
      throw error;
    }
  }

  async deactivatePlan(planId: string) {
    const access_token = await this.getAccessToken();
    try {
      const response = await this.httpService.axiosRef.post(
        `https://${this.paypalDomain}/v1/billing/plans/${planId}/deactivate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return { plan: response.data, success: true };
    } catch (error) {
      console.error('Error deactivating plan:', error.message);
      console.log(JSON.stringify(error.response.data, null, 2));
      return { error: error.response.data, success: false };
    }
  }

  async createSubscription({
    paymentTokenId,
    planId,
    user,
    accessToken,
  }: {
    user: UserDocument;
    planId: string;
    paymentTokenId: string;
    accessToken: string; // The access token to use in the return_url page.
  }) {
    const access_token = await this.getAccessToken();
    const tomorrow = dayjs(Date.now()).add(1, 'minute');
    const body = {
      plan_id: planId,
      start_time: tomorrow.toISOString(),
      quantity: '1',
      subscriber: {
        name: {
          given_name: user.name,
          surname: user.name,
        },
        email_address: user.email,
        payment_source: {
          paypal: {
            vault_id: paymentTokenId,
          },
        },
      },
      application_context: {
        brand_name: 'RideEasy',
        locale: 'fr-FR',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: `${this.configService.get('PAYMENT_GATEWAY_URL')}/approve-subscription?rdy_token=${accessToken}`,
        cancel_url:
          this.configService.get('PAYMENT_GATEWAY_URL') +
          '/approve-subscription-cancelled',
      },
    } as any;

    const { data } =
      await this.httpService.axiosRef.post<PaypalSubscriptionReponse>(
        `https://${this.paypalDomain}/v1/billing/subscriptions`,
        body,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

    /**
     * TODO: handle failure...
     */

    return data;
  }

  async refundCapture(capture_id: string) {
    const access_token = await this.getAccessToken();

    const { data } = await this.httpService.axiosRef.post<RefundResponse>(
      `https://${this.paypalDomain}/v2/payments/captures/${capture_id}/refund`,
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'PayPal-Request-Id': `${Date.now()}`,
        },
      },
    );

    return data;
  }

  async cancelSubscription(id: string) {
    const access_token = await this.getAccessToken();
    const data =
      await this.httpService.axiosRef.post<PaypalSubscriptionReponse>(
        `https://${this.paypalDomain}/v1/subscriptions/${id}/cancel`,
        {
          reason: 'Requested by user.',
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

    return data;
  }

  async changePlan(subscriptionId: string, planId: string) {
    const access_token = await this.getAccessToken();

    const { data } =
      await this.httpService.axiosRef.post<PaypalSubscriptionReponse>(
        `https://${this.paypalDomain}/v1/billing/subscriptions/${subscriptionId}/revise`,
        {
          plan_id: planId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

    return data;
  }

  async verifywebhookEventSig(event: any, headers: any) {
    const access_token = await this.getAccessToken();
    const { data } =
      await this.httpService.axiosRef.post<PaypalSubscriptionReponse>(
        `https://${this.paypalDomain}/v1/notifications/verify-webhook-signature`,
        {
          webhook_id: this.configService.get('PAYPAL_WEBHOOK_ID'),
          webhook_event: event,
          auth_algo: headers['paypal-auth-algo'],
          cert_url: headers['paypal-cert-url'],
          transmission_id: headers['paypal-transmission-id'],
          transmission_sig: headers['paypal-transmission-sig'],
          transmission_time: headers['paypal-transmission-time'],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Prefer: 'return=representation',
          },
        },
      );

    return data;
  }

  async getSubscriptionDetails(id: string) {
    const access_token = await this.getAccessToken();

    const { data } =
      await this.httpService.axiosRef.get<PaypalSubscriptionReponse>(
        `https://${this.paypalDomain}/v1/billing/subscriptions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'PayPal-Request-Id': `${Date.now()}`,
          },
        },
      );

    return data;
  }
}
