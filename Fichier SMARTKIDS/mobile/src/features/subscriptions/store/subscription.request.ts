import zod from "zod";
import type { Stripe } from "stripe";
import { ApiResponse } from "@/src/store/apiSlice";
import { Subscription } from "@/src/types/subscription.types";

export interface SubscriptionResponse
  extends ApiResponse<{
    subscription: Subscription;
    providerSubscription?: Stripe.Subscription | PayPalSubscription;
  }> {}

const PaySubscriptionSchema = zod.object({
  planId: zod.string(),
  paymentMethodType: zod.string(),
  paymentMethod: zod.string(),
});

export type PaySubscriptionDto = Zod.infer<typeof PaySubscriptionSchema>;

export interface CreateBoostageDto {
  date_debut: Date;
  date_fin: Date;
  etablissement: string;
  paymentMethod: string;
}

export interface PayPalSubscription {
  id: string;
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED" | "EXPIRED";
  create_time: string; // ISO 8601 date-time format
  update_time: string; // ISO 8601 date-time format
  plan_id: string;
  start_time: string; // ISO 8601 date-time format
  quantity: number;
  shipping_amount?: {
    currency_code: string;
    value: string;
  };
  subscriber: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
    shipping_address?: {
      address_line_1: string;
      address_line_2?: string;
      admin_area_2: string; // City or town
      admin_area_1: string; // State or province
      postal_code: string;
      country_code: string;
    };
  };
  billing_info: {
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    cycle_executions: Array<{
      tenure_type: "REGULAR" | "TRIAL";
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
      current_pricing_scheme_version: number;
    }>;
    last_payment: {
      amount: {
        currency_code: string;
        value: string;
      };
      time: string; // ISO 8601 date-time format
    };
    next_billing_time: string; // ISO 8601 date-time format
    final_payment_time: string; // ISO 8601 date-time format
    failed_payments_count: number;
  };
}
