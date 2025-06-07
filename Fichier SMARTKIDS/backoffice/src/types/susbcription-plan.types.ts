export type SubscriptionIntervalUnit = "day" | "week" | "month" | "year";

export interface SubscriptionPlan {
  _id: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  trial_interval_unit: SubscriptionIntervalUnit;

  trial_interval_count: number;

  stripe_price_id: string;

  paypal_plan_id: string;

  paypal_plan_without_trial_id: string;

  interval_unit: SubscriptionIntervalUnit;

  interval_count: number;

  name: string;

  description: string;

  price: number;
}
