import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/redux/customBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api-slice",
  refetchOnMountOrArgChange: true,
  tagTypes: [
    "stripe-pms",
    "paypal-pms",
    "user-profile",
    "withdrawal-methods",
    "can-delete-user",
    "driver-requests",
    "rides",
    "users",
    "issues",
    "wallets",
    "transactions",
    "subscription-plans",
    "price-configs",
    "etablissements",
    "categories"
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

export enum SuccessResponseEnum {
  OK = "OK",
  CREATED = "CREATED",
  EMAIL_VERIFICATION_PENDING = "EMAIL_VERIFICATION_PENDING",
}

export type ApiResponse<T> = {
  status: SuccessResponseEnum;
  message?: string;
  data: T;
};

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResponse<T>>;

export interface PaginatedQueryOptions<T> {
  page: number;
  limit: number;
  filter?: Partial<{ [P in keyof T]: string | number | boolean }>;
  sort?: Partial<{ [P in keyof T]: 1 | -1 | "desc" | "asc" }>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
