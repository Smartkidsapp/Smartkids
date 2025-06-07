import { Subscription } from "@/types/subscription";

export type ISubScriptionFilters = Partial<
  Pick<Subscription, "user" | "paymentMethodType">
> & {
  query?: string;
};
