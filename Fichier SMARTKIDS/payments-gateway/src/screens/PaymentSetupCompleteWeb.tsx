/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";

export default function PaymentSetupCompleteWeb() {
  const isFirst = useRef<boolean>(true);
  useEffect(() => {
    if (!isFirst.current) {
      return;
    }

    // @ts-ignore
    /*window.ReactNativeWebView.postMessage(
      JSON.stringify({
        status: "SUCCESS",
        message: "Méthode de paiement enregistrée avec succès !",
      })
    );*/
    isFirst.current = false;
  }, []);

  return (
    <div className="centered-container">
      <svg
        width="100"
        height="100"
        viewBox="0 0 170 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Vector">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M85 159C94.7178 159 104.34 157.086 113.319 153.367C122.297 149.648 130.454 144.197 137.326 137.326C144.197 130.454 149.648 122.297 153.367 113.319C157.086 104.34 159 94.7178 159 85C159 75.2822 157.086 65.6595 153.367 56.6814C149.648 47.7033 144.197 39.5456 137.326 32.6741C130.454 25.8026 122.297 20.3518 113.319 16.6329C104.34 12.9141 94.7178 11 85 11C65.374 11 46.5518 18.7964 32.6741 32.6741C18.7964 46.5518 11 65.374 11 85C11 104.626 18.7964 123.448 32.6741 137.326C46.5518 151.204 65.374 159 85 159ZM83.0924 114.929L124.204 65.5956L111.574 55.0711L76.2187 97.4896L57.9242 79.1869L46.298 90.8131L70.9647 115.48L77.3287 121.844L83.0924 114.929Z"
            fill="rgba(229, 215, 197, 1)"
          />
          <path
            d="M76.9596 113.697L74.8538 111.591L54.0762 90.8131L57.9233 86.9659L72.3287 101.378L76.587 105.638L80.4436 101.011L112.278 62.817L116.457 66.2998L78.8676 111.407L78.8672 111.408L76.9596 113.697ZM158.448 54.5767L153.367 56.6814L158.448 54.5767C154.453 44.9313 148.597 36.1673 141.215 28.785C133.833 21.4028 125.069 15.5468 115.423 11.5516C105.778 7.55633 95.4401 5.5 85 5.5C63.9153 5.5 43.6942 13.8759 28.785 28.785C13.8759 43.6942 5.5 63.9153 5.5 85C5.5 106.085 13.8759 126.306 28.785 141.215C43.6942 156.124 63.9153 164.5 85 164.5C95.4401 164.5 105.778 162.444 115.423 158.448C125.069 154.453 133.833 148.597 141.215 141.215C148.597 133.833 154.453 125.069 158.448 115.423C162.444 105.778 164.5 95.4401 164.5 85C164.5 74.5599 162.444 64.2221 158.448 54.5767Z"
            stroke="rgba(229, 215, 197, 1)"
            stroke-opacity="0.1"
            stroke-width="11"
          />
        </g>
      </svg>

      <div>
        <p
          style={{
            fontWeight: 500,
            fontSize: "14px",
            textAlign: "center",
            color: "rgba(8, 33, 45, 1)",
          }}
        >
          Méthode de paiement enregistrée avec succès.
        </p>
        <p
          style={{
            fontWeight: 500,
            color: "rgba(8, 33, 45, .5)",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Vous pouvez maintenant retourner sur la page et choisir ce moyen de paiment dans la liste de
          vos méthodes de paiements.
        </p>
      </div>
    </div>
  );
}
