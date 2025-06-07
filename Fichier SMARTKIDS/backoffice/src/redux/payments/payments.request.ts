import { Payment } from "@/types/payment";

export type IPaymentFilters = Partial<Pick<Payment, "type" | "user">> & {
  query?: string;
};
