/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    PaymentElement,
    useElements,
    useStripe,
  } from "@stripe/react-stripe-js";
  import { FormEvent, useState } from "react";
  import config from "../../config";
  
  export default function Form() {
    const stripe = useStripe();
    const [loading, setLoading] = useState<boolean>(false);
    const elements = useElements();
  
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      setLoading(true);
      try {
        event.preventDefault();
        setErrorMessage(null);
  
        if (!stripe || !elements) {
          return null;
        }
  
        const { error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            payment_method_data: {
              billing_details: {
                address: {
                  country: "FR",
                },
              },
            },
            return_url: `${config.publicUrl}/stripe-web`,
          },
        });
  
        if (error) {
          // alert(JSON.stringify({ error }));
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
        }
      } catch (e) {
        // @ts-ignore
        setErrorMessage("Un problème est survenue, veuillez réessayer !");
      } finally {
        setLoading(false);
      }
    };
  
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
  