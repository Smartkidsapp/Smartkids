import * as Joi from 'joi';

export interface AppConfig {
  ENV: string;
  PORT: number;
  SERVER_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  MONGODB_URI: string;
  DB_NAME: string;
  MAILER_DSN: string;
  APP_EMAIL: string;

  ADMIN_EMAIL: string;
  ADMIN_NAME: string;
  ADMIN_PHONE: string;
  ADMIN_PASSWORD: string;

  ACCESS_TOKEN_TIME_VALUE: string;
  ACCESS_TOKEN_TIME_UNIT: string;
  REFRESH_TOKEN_TIME_VALUE: string;
  REFRESH_TOKEN_TIME_UNIT: string;
  APP_LOGO: string;
  CONTACT_EMAIL: string;
  CONTACT_PHONE: string;

  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_SUBSCRIPTION_PRODUCT_ID: string;
  STRIPE_MONTHLY_PRICE_ID: string;
  STRIPE_YEARLY_PRICE_ID: string;

  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_ENV: string;
  PAYPAL_PRODUCT_ID: string;
  PAYPAL_MONTHLY_PLAN_ID: string;
  PAYPAL_YEARLY_PLAN_ID: string;

  BACKOFFICE_URL: string;
  PAYMENT_GATEWAY_URL: string;

  REDIS_URL: string;
  MONTHLY_PLAN_PRICE: string;
  YEARLY_PLAN_PRICE: string;

  PAYPAL_WEBHOOK_ID: string;
}

export const configValidationSchema = Joi.object({
  PORT: Joi.string().required(),
  SERVER_URL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  MONGODB_URI: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  MAILER_DSN: Joi.string().required(),
  APP_EMAIL: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().required(),
  ACCESS_TOKEN_TIME_VALUE: Joi.string().required(),
  ACCESS_TOKEN_TIME_UNIT: Joi.string().required(),
  REFRESH_TOKEN_TIME_VALUE: Joi.string().required(),
  REFRESH_TOKEN_TIME_UNIT: Joi.string().required(),
  APP_LOGO: Joi.string().required(),
  CONTACT_EMAIL: Joi.string().required(),
  CONTACT_PHONE: Joi.string().required(),

  STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_WEBHOOK_SECRET: Joi.string().required(),
  STRIPE_SUBSCRIPTION_PRODUCT_ID: Joi.string().required(),
  STRIPE_MONTHLY_PRICE_ID: Joi.string().required(),
  STRIPE_YEARLY_PRICE_ID: Joi.string().required(),

  PAYPAL_CLIENT_ID: Joi.string().required(),
  PAYPAL_CLIENT_SECRET: Joi.string().required(),
  PAYPAL_ENV: Joi.string().allow('sandbox', 'live').required(),
  PAYPAL_PRODUCT_ID: Joi.string().required(),
  PAYPAL_MONTHLY_PLAN_ID: Joi.string().required(),
  PAYPAL_YEARLY_PLAN_ID: Joi.string().required(),

  BACKOFFICE_URL: Joi.string().required(),
  PAYMENT_GATEWAY_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),

  ADMIN_NAME: Joi.string().required(),
  ADMIN_PHONE: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  PAYPAL_WEBHOOK_ID: Joi.string().required(),

  MONTHLY_PLAN_PRICE: Joi.string().required(),
  YEARLY_PLAN_PRICE: Joi.string().required(),
});

export default (): AppConfig => ({
  ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  SERVER_URL: process.env.SERVER_URL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  MAILER_DSN: process.env.MAILER_DSN,
  APP_EMAIL: process.env.APP_EMAIL,

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_PHONE: process.env.ADMIN_PHONE,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  ACCESS_TOKEN_TIME_VALUE: process.env.ACCESS_TOKEN_TIME_VALUE,
  ACCESS_TOKEN_TIME_UNIT: process.env.ACCESS_TOKEN_TIME_UNIT,
  REFRESH_TOKEN_TIME_VALUE: process.env.REFRESH_TOKEN_TIME_VALUE,
  REFRESH_TOKEN_TIME_UNIT: process.env.REFRESH_TOKEN_TIME_UNIT,
  APP_LOGO: process.env.APP_LOGO,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  CONTACT_PHONE: process.env.CONTACT_PHONE,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_SUBSCRIPTION_PRODUCT_ID: process.env.STRIPE_SUBSCRIPTION_PRODUCT_ID,
  STRIPE_MONTHLY_PRICE_ID: process.env.STRIPE_MONTHLY_PRICE_ID,
  STRIPE_YEARLY_PRICE_ID: process.env.STRIPE_YEARLY_PRICE_ID,

  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
  PAYPAL_ENV: process.env.PAYPAL_ENV,
  PAYPAL_PRODUCT_ID: process.env.PAYPAL_PRODUCT_ID,
  PAYPAL_MONTHLY_PLAN_ID: process.env.PAYPAL_MONTHLY_PLAN_ID,
  PAYPAL_YEARLY_PLAN_ID: process.env.PAYPAL_YEARLY_PLAN_ID,

  BACKOFFICE_URL: process.env.BACKOFFICE_URL,
  PAYMENT_GATEWAY_URL: process.env.PAYMENT_GATEWAY_URL,
  REDIS_URL: process.env.REDIS_URL,
  PAYPAL_WEBHOOK_ID: process.env.PAYPAL_WEBHOOK_ID,

  MONTHLY_PLAN_PRICE: process.env.MONTHLY_PLAN_PRICE,
  YEARLY_PLAN_PRICE: process.env.YEARLY_PLAN_PRICE,
});
