interface AppConfig {
  stripePublishableKey: string;
  paypalClientId: string;
  publicUrl: string;
  apiUrl: string;
}

const config: AppConfig = {
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  publicUrl: import.meta.env.VITE_PUBLIC_URL,
  apiUrl: import.meta.env.VITE_API_URL,
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
};

export default config;
