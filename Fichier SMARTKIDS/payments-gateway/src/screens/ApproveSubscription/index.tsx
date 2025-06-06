import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import config from "../../config";

export default function ApproveSubscription() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const subscrition_id = searchParams.get("subscription_id");
  const access_token = searchParams.get("rdy_token");

  useEffect(() => {
    async function approveSubscription() {
      setLoading(true);
      try {
        const res = await fetch(
          `${config.apiUrl}/paypal-subscriptions/${subscrition_id}/approve`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setMessage(data?.message);

          // @ts-ignore
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              approved: true,
            })
          );

          return;
        } else {
          alert(JSON.stringify(res.status));
          setMessage("Une erreur s'est produite. Veuillez réessayer.");
          return;
        }
      } catch (error) {
        setMessage("Une erreur s'est produite. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    }

    approveSubscription();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>Chargement...</div>
        ) : (
          <div style={{ textAlign: "center" }}>{message}</div>
        )}
      </div>
    </div>
  );
}
