import zod from "zod";

export const createSubscriptionPlanSchema = zod.object({
  trial_interval_unit: zod.enum(["day", "week", "month", "year"]),
  trial_interval_count: zod.number(),

  interval_unit: zod.enum(["day", "week", "month", "year"]),
  interval_count: zod.number(),

  price: zod.number(),

  name: zod.string(),
  description: zod.string(),
});

export type CreateSubscriptionPlanDTO = zod.infer<
  typeof createSubscriptionPlanSchema
>;
