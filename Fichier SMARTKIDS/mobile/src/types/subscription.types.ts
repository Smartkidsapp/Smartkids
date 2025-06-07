import { PaymentMethodTypeEnum } from "./payment-methods.types";
import { SubscriptionPlan } from "./subscription-plan.types";

export const PAYMENT_METHOD_TYPES = [
  PaymentMethodTypeEnum.PAYPAL,
  PaymentMethodTypeEnum.STRIPE,
];

export interface Subscription {
  id: string;
  createdAt: string;
  updatedAt: string;
  user: string;
  paymentMethodType: PaymentMethodTypeEnum;
  plan: SubscriptionPlan | string;
  stripeSubscriptionId: string | null;
  stripePriceId: string;
  paypalSubscriptionId: string | null;
  paypalPlanId: string | null;
}
