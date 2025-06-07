import { SubscriptionIntervalUnit } from "src/app/subscriptions/schemas/subscription-plan.schema";

export interface PaypalRidePaymentContext {
  paypal: {
    email: string;
    paymentMethod: string;
    orderId: string;
    /** Usefull later to handle refunds. */
    capture_id: string;
  };
}

export interface StripeRidePaymentContext {
  boostageId: string;
  stripe: {
    paymentMethod: string;
    paymentItent: string;
    card: {
      type: string;
      last4: string;
    };
  };
}

export type StripeSubscriptionPaymentContext = {
  interval: {
    unit: SubscriptionIntervalUnit;
    count: number;
  };
  stripe: {
    paymentMethod: string;
    priceId: string;
    card: {
      type: string;
      last4: string;
    };
  };
};

export type PaypalSubscriptionPaymentContext = {
  interval: {
    unit: SubscriptionIntervalUnit;
    count: number;
  };
  paypal: {
    paymentMethod: string;
    planId: string;
  };
};

export type PaymentContext =
  | StripeSubscriptionPaymentContext
  | PaypalSubscriptionPaymentContext
  | PaypalRidePaymentContext
  | StripeRidePaymentContext;
