/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import config from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaypalForm() {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("token");
  const [loaded, setLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: 400,
        paddingInline: "24px",
      }}
    >
      {!loaded ? (
        <div
          style={{
            textAlign: "center",
            paddingTop: "10px",
          }}
        >
          Chargement en cours...
        </div>
      ) : null}
      <PayPalScriptProvider options={{ clientId: config.paypalClientId }}>
        <PayPalButtons
          onInit={() => setLoaded(true)}
          createVaultSetupToken={async () => {
            try {
              const res = await fetch(
                config.apiUrl + "/v1/payment-methods?type=paypal",
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              if (res.ok) {
                const data = (await res.json()) as {
                  data: {
                    tokenId: string;
                  };
                };

                return data.data.tokenId;
              }
            } catch (error) {
              // @ts-ignore
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  status: "FAILURE",
                  message: "Un problème est survenue, veuillez réessayer !---",
                })
              );
            }

            return "";
          }}
          // @ts-ignore
          onApprove={async ({ vaultSetupToken }) => {
            try {
              const res = await fetch(config.apiUrl + "/v1/ppl-pm-tokens", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  vaultSetupToken,
                }),
              });

              if (res.ok) {
                navigate("/setup-complete");
                return;
              }

              // @ts-ignore
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  status: "FAILURE",
                  message: "Un problème est survenue, veuillez réessayer !",
                })
              );
            } catch (error) {
              // @ts-ignore
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  status: "FAILURE",
                  message: "Un problème est survenue, veuillez réessayer !",
                })
              );
            }
          }}
          onError={(err) => {
            /**
             * This error handler is a catch-all.
             * Errors at this point are not expected to be handled beyond showing a generic error message or page.
             * @see https://developer.paypal.com/docs/checkout/advanced/customize/handle-errors/
             */
            // @ts-ignore
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                status: "FAILURE",
                message:
                  "Un problème est survenue, veuillez réessayer !" +
                  err.message,
              })
            );
          }}
          style={{
            height: 50,
            shape: "pill",
            color: "gold",
            tagline: true,
            label: "paypal",
          }}
          fundingSource="paypal"
        />
      </PayPalScriptProvider>
    </div>
  );
}
