/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import config from "../../config";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Form from "./Form";

const stripePromise = loadStripe(config.stripePublishableKey);

export default function StripeFormWeb() {
  const [searchParams] = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const clientSecret_ = searchParams.get("payment_intent_client_secret");
  const redirect_status = searchParams.get("redirect_status");
  const setup = useRef<boolean>(false);

  const accessToken = searchParams.get("token");

  const fetchSetupIntent = async () => {
    try {
      const res = await fetch(
        config.apiUrl + "/payment-methods?type=stripe",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = (await res.json()) as { data: SetupIntentResponse };
        setClientSecret(data.data.client_secret);
        return;
      }

      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          status: "FAILURE",
          message: "Une erreur est survenue, veuillez réessayer !",
        })
      );
    } catch (error) {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          status: "FAILURE",
          message: "Une erreur est survenue, veuillez réessayer !",
        })
      );
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (redirect_status === "succeeded") {
      navigate("/setup-complete-web");
      return;
    }

    if (!setup.current && !clientSecret_) {
      setup.current = true;
      fetchSetupIntent();
    }

    if (!clientSecret && clientSecret_) {
      setup.current = true;
      setClientSecret(clientSecret_);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientSecret_]);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret ?? undefined,
    fonts: [
      {
        cssSrc:
          "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap",
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
      <StripeForm_ />
    </Elements>
  );
}

function StripeForm_() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const redirect_status = searchParams.get("redirect_status");
  const payment_intent_id = searchParams.get("payment_intent");
  const clientSecret = searchParams.get("payment_intent_client_secret");

  const stripe = useStripe();
  useEffect(() => {
    if (!clientSecret && !redirect_status && !payment_intent_id) {
      return;
    }

    if (redirect_status === "succeeded") {
        navigate("/setup-complete-web");
      return;
    }

    /**
     * This wasn't redirected by stripe.
     */
    if (!payment_intent_id) {
      return;
    }

    /**
     * Fetch the payment itent innformation and display errors.
     */
    stripe!.retrievePaymentIntent(clientSecret!).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        return;
      }

      switch (paymentIntent.status) {
        case "succeeded":
            navigate("/setup-complete-web");
          break;

        case "processing":
          // @ts-ignore
          /*window.ReactNativeWebView.postMessage(
            JSON.stringify({
              status: "SUCCESS",
              message: "Traitement en cours, vous recevrez une notification.",
            })
          );*/
          break;

        case "requires_payment_method":
          // @ts-ignore
          /*window.ReactNativeWebView.postMessage(
            JSON.stringify({
              status: "FAILURE",
              message:
                "Echec, veuillez réessayer avec une autre méthode de paiement.",
            })
          );*/
          break;

        default:
          // @ts-ignore
          /*window.ReactNativeWebView.postMessage(
            JSON.stringify({
              status: "FAILURE",
              message: "Un problème est survenue, veuillez réessayer !",
            })
          );*/
          break;
      }
    });
  }, [redirect_status, navigate, payment_intent_id, clientSecret, stripe]);

  return <Form />;
}

export interface SetupIntentResponse {
  client_secret: string;
  ephemeralKey: string;
  customer: string;
  publishableKey: string;
}
