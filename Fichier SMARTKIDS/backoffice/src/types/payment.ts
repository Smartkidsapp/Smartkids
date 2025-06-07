import { PaymentMethodType } from "@/types/subscription";
import { User } from "./user.types";

export enum PaymentTypeEnum {
  RIDE = "ride",
  SUBSCRIPTION = "subscription",
}

export const PAYMENT_TYPES = [
  PaymentTypeEnum.RIDE,
  PaymentTypeEnum.SUBSCRIPTION,
];

export interface SubscriptionInvoiceData {
  paymentId: string;
  subscribedAt: string;
  name: string;
  plateNumber: string;
  vehicleModel: string;
  price: string;
  taxAmount: string;
  totalPrice: string;
}

export interface Payment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  number: string;
  price: number;
  type: PaymentTypeEnum;
  ref: string; // Either a subscription or a ride.
  user: string | User;
  context: {
    paymentMethodType: PaymentMethodType.PAYPAL;
    recurrence: string;
    rideId?: string;
    offerId?: string;
    paypal?: {
      email: string;
      paymentMethod: string;
      orderId?: string;
      planId?: string;
    };
    stripe?: {
      paymentMethod: string;
      priceId?: string;
      paymentItent: string;
      card: {
        type: string;
        last4: string;
      };
    };
  };
}
