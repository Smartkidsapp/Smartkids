import PaypalPaymentMethodsSheet from "@/src/features/payments/PaymentMethods/PaypalPaymentMethodsSheet";
import StripePaymentMethodsSheet from "@/src/features/payments/PaymentMethods/StripePaymentMethodsSheet";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import ConfirmSheet from "./ConfirmSheet";
import { PaymentMethodValue } from "@/src/features/payments/PaymentMethods";

registerSheet("confirm-sheet", ConfirmSheet);
registerSheet("stripe-payment-methods-sheet", StripePaymentMethodsSheet);
registerSheet("paypal-payment-methods-sheet", PaypalPaymentMethodsSheet);

declare module "react-native-actions-sheet" {
  interface Sheets {
    "stripe-payment-methods-sheet": SheetDefinition<{
      payload: {
        onMethodSelected: (method: PaymentMethodValue) => void;
        selectedMethod: string;
      };
      returnValue: PaymentMethodValue;
    }>;
    "paypal-payment-methods-sheet": SheetDefinition<{
      payload: {
        onMethodSelected: (method: PaymentMethodValue) => void;
        selectedMethod: string;
      };
      returnValue: PaymentMethodValue;
    }>;
    "confirm-sheet": SheetDefinition<{
      payload: {
        title: string;
        description: string;
      };
      returnValue: boolean;
    }>;
  }
}

export {};
