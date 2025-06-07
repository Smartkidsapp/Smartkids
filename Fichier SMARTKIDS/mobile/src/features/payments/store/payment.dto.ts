import { ApiResponse } from "@/src/store/apiSlice";

export interface StripePaymentMethodResponse {
  last_four: string;
  brand:
    | "amex"
    | "diners"
    | "discover"
    | "eftpos_au"
    | "jcb"
    | "mastercard"
    | "unionpay"
    | "visa";
  id: string;
  // customerId: string;
}

export interface PaypalPaymentMethodResponse {
  customerId: string;
  email: string;
  id: string;
}

export interface PaymentMethodsResponse
  extends ApiResponse<
    StripePaymentMethodResponse[] | PaypalPaymentMethodResponse[]
  > {}
