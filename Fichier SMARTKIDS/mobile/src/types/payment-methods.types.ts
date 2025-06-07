export enum PaymentMethodTypeEnum {
  STRIPE = "stripe",
  PAYPAL = "paypal",
}

export const PAYMENT_METHOD_TYPES = [
  PaymentMethodTypeEnum.STRIPE,
  PaymentMethodTypeEnum.PAYPAL,
];

export interface PaymentMethod {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: PaymentMethodTypeEnum;
  value: string; // stripeIntentId or email address
  user: string;
}
