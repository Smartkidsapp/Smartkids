/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";
import config from "../../config";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Form() {
  const stripe = useStripe();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirect_status = searchParams.get("redirect_status");
  const payment_intent_id = searchParams.get("payment_intent");
  const clientSecret = searchParams.get("payment_intent_client_secret");

  useEffect(() => {
    if (redirect_status === "succeeded") {
      navigate("/payment-complete");
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
          navigate("/payment-complete");
          break;

        case "processing":
          // @ts-ignore
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              status: "SUCCESS",
              message:
                "Paiement en cours de traitement, vous recevrez une notification.",
            })
          );
          break;

        case "requires_payment_method":
          // @ts-ignore
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              status: "FAILURE",
              message:
                "Paiement echoué, veuillez réessayer avec une autre méthode de paiement.",
            })
          );
          break;

        default:
          // @ts-ignore
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              status: "FAILURE",
              message: "Un problème est survenue, veuillez réessayer !",
            })
          );
          break;
      }
    });
  }, [redirect_status, navigate, payment_intent_id, clientSecret, stripe]);

  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event?.preventDefault();

      if (!stripe || !elements) {
        return null;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${config.publicUrl}/payment-complete`,
          payment_method_data: {
            billing_details: {
              address: {
                country: "FR",
              },
            },
          },
        },
      });

      if (error) {
        const message = [
          "card_error",
          "validation_error",
          "invalid_request_error",
        ].includes(error.type)
          ? error.message
          : "Une erreur inattendue est survenue lors du traitement de votre requête. Veuillez réessayer.";
        setErrorMessage(
          message ??
            "Une erreur inattendue est survenue lors du traitement de votre requête. Veuillez réessayer."
        );

        // @ts-ignore
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            status: "FAILURE",
            message: message,
          })
        );

        return;
      } else {
        // Redirected.
        // @ts-ignore
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            status: "SUCCESS",
            message: "Offre payée avec succès.",
          })
        );
      }
    } catch (e) {
      // @ts-ignore
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          status: "FAILURE",
          message:
            "Une erreur inattendue est survenue lors du traitement de votre requête. Veuillez réessayer.",
        })
      );
    } finally {
      setLoading(false);
    }
  };
  // @ts-ignore
  window.handleSubmit = handleSubmit;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        paddingInline: "18px",
      }}
    >
      {errorMessage && (
        <div
          style={{
            fontFamily: "Opens-sans",
            fontSize: "14px",
            border: "1px solid red",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "16px",
            color: "#fff",
            backgroundColor: "rgba(226, 3, 29, 0.5)",
            borderColor: "rgba(226, 63, 27, 1)",
          }}
        >
          {errorMessage}
        </div>
      )}

      <PaymentElement
        options={{
          fields: {
            billingDetails: {
              address: {
                country: "never",
              },
            },
          },
        }}
      />

      <button
        disabled={!stripe || !elements}
        style={{
          backgroundColor:
            !stripe || !elements
              ? "rgba(226, 226, 226, 1)"
              : "rgba(229, 215, 197, 1)",
          color: "#fff",
        }}
        className="btn"
      >
        {loading ? "chargement..." : "Confirmer"}
      </button>
    </form>
  );
}
