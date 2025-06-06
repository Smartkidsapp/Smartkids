import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PaypalForm from "./screens/PaypalForm";
import StripeForm from "./screens/StripeForm";
import PaymentSetupComplete from "./screens/PaymentSetupComplete";
import ApproveSubscription from "./screens/ApproveSubscription";
import ApproveSubscriptionCanceled from "./screens/ApproveSubscriptionCanceled";
import StripeFormDirectPayment from "./screens/StripeFormDirectPayment";
import PaymentComplete from "./screens/PaymentComplete";
import StripeFormWeb from "./screens/StripeFromWeb";
import PaymentSetupCompleteWeb from "./screens/PaymentSetupCompleteWeb";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "paypal",
        element: <PaypalForm />,
      },
      {
        path: "stripe",
        element: <StripeForm />,
      },
      {
        path: "stripe-web",
        element: <StripeFormWeb />,
      },

      // When a card is rejected for authorization error. We redirect here.
      {
        path: "stripe-direct-payment",
        element: <StripeFormDirectPayment />,
      },
      {
        path: "payment-complete",
        element: <PaymentComplete />,
      },
      // When a card is rejected for authorization error. We redirect here.

      {
        path: "setup-complete",
        element: <PaymentSetupComplete />,
      },
      {
        path: "setup-complete-web",
        element: <PaymentSetupCompleteWeb />,
      },
      {
        path: "approve-subscription",
        element: <ApproveSubscription />,
      },
      {
        path: "approve-subscription-cancelled",
        element: <ApproveSubscriptionCanceled />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
