/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import config from "../../config";
import { useSearchParams } from "react-router-dom";
import Form from "./Form";

const stripePromise = loadStripe(config.stripePublishableKey);

export default function StripeFormDirectPayment() {
  const [searchParams] = useSearchParams();
  const clientSecret = searchParams.get("payment_intent_client_secret");

  if (!clientSecret) {
    return <p color="#fff">Veuillez patienter...</p>;
  }

  const options: StripeElementsOptions = {
    clientSecret: clientSecret ?? undefined,
    fonts: [
      {
        cssSrc:
          "https://fonts.googleapis.com/css2?family=Opens-sans:wght@400;500;600;700&display=swap",
        family: "Opens-sans",
        weight: "400",
      },
    ],
    appearance: {
      theme: "stripe",
      labels: "above",
      rules: {
        /**
         * INPUT
         */
        ".Input": {
          height: "60px",
          padding: "15px",
          border: "1px solid rgba(8, 33, 45, 1)",
          boxShadow: "none",
        },
        ".Input:focus": {
          boxShadow: "none",
          borderColor: "rgba(229, 215, 197, 1)",
        },
        ".Input--invalid": {
          boxShadow: "none",
        },
        ".Input::placeholder": {},

        /**
         * LABEL
         */
        ".Label": {},
      },
      variables: {
        fontFamily: "Opens-sans, sans-serif",
        fontSizeLg: "14px",
        fontSizeBase: "14px",
        spacingUnit: "4px",
        fontSizeSm: "14px",
        fontSize2Xs: "14px",
        fontSize3Xs: "14px",
        fontSizeXl: "14px",
        fontSizeXs: "12px",
        borderRadius: "8px",
        colorPrimary: "rgba(229, 215, 197, 1)",
        colorBackground: "#ffffff",
        colorText: "rgba(8, 33, 45, 1)",
        colorDanger: "rgba(226, 63, 27, 1)",
        gridRowSpacing: "16px",
      },
    },
    locale: "fr-FR",
  };

  if (!clientSecret) {
    return <p>Veuillez patienter...</p>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <Form />
    </Elements>
  );
}

export interface SetupIntentResponse {
  client_secret: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
}
