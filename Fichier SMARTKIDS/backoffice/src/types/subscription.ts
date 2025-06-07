import { SubscriptionPlan } from "./susbcription-plan.types";
import { User } from "./user.types";

export type SubscriptionIntervalUnit = "day" | "week" | "month" | "year";

export enum StripeSubscriptionStatusEnum {
  CREATED = "created",
  ACTIVE = "active",
  PAYMENT_DUE = "payment-due",
  CANCELLED = "canceled",
  UNPAID = "unpaid",
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  TRIALING = "trialing",
  PAST_DUE = "past_due",
}

export enum PayPalSubscriptionStatusEnum {
  CREATED = "created",
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  SUSPENDED = "SUSPENDED",
  APPROVAL_PENDING = "APPROVAL_PENDING",
  INITIALLY_FAILED = "INITIALLY_FAILED",
  PROCESSING = "PROCESSING",
  PENDING = "PENDING",
  INCOMPLETE = "INCOMPLETE",
  DEACTIVATED = "DEACTIVATED",
}

export enum PaymentMethodType {
  PAYPAL = "paypal",
  STRIPE = "stripe",
}

export const SUBSCRIPTION_STATUSES = [
  StripeSubscriptionStatusEnum.ACTIVE,
  StripeSubscriptionStatusEnum.CREATED,
  StripeSubscriptionStatusEnum.CANCELLED,
  StripeSubscriptionStatusEnum.PAYMENT_DUE,
];

export const PAYMENT_METHOD_TYPES = [
  PaymentMethodType.PAYPAL,
  PaymentMethodType.STRIPE,
];

export interface Subscription {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  user: User;

  /**
   * Attached either to paypal or stripe.
   * Must be one of them, can't be both at the same time.
   * When changing from one to another, cancel the other.
   */
  externalSubscriptionRef: string | null;

  stripeSubscriptionStatus: StripeSubscriptionStatusEnum | null;

  stripePaymentErrorMessage: string | null;

  paypalSubscriptionStatus: PayPalSubscriptionStatusEnum | null;

  paymentMethodType: PaymentMethodType | null;

  price: number;

  canceledAt: Date | null;

  paypal_plan_id: string;

  stripe_price_id: string;

  plan: SubscriptionPlan;

  /**
   * The interval count for the subscription.
   * Saving this because the plan can be changed.
   */
  interval_count: number;

  /**
   * The interval unit for the subscription.
   * Saving this because the plan can be changed.
   */
  interval_unit: SubscriptionIntervalUnit;

  isTrialing: boolean;
}
