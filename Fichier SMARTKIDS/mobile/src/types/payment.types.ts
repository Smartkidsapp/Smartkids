import { SubscriptionIntervalUnit } from "./subscription-plan.types";

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

export enum PaymentTypeEnum {
  RIDE = "ride",
  SUBSCRIPTION = "subscription",
}

export const PAYMENT_TYPES = [
  PaymentTypeEnum.RIDE,
  PaymentTypeEnum.SUBSCRIPTION,
];

export enum PaymentStatusEnum {
  COMPLETED = "completed",
  REFUNDED = "refunded",
}

export const PAYMENT_STATUSES = [
  PaymentStatusEnum.COMPLETED,
  PaymentStatusEnum.REFUNDED,
];

export interface Payment {
  id: string;
  createdAt: string;
  updatedAt: string;
  number: string;
  price: number;
  type: PaymentTypeEnum;
  status: PaymentStatusEnum;
  ref: string;
  user: string;
  context: PaymentContext;
  paymentIntentId: string;
  paypalOrderId: string;
}
