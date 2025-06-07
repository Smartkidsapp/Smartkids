import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedQueryOptions,
  apiSlice,
} from "@/redux/apiSlice";
import qs from "qs";
import { IPaymentFilters } from "./payments.request";
import { Payment } from "@/types/payment";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      paginatePayments: build.query<
        PaginatedApiResponse<Payment>,
        PaginatedQueryOptions<IPaymentFilters>
      >({
        query(params) {
          const searchParams = qs.stringify(params);
          return {
            url: `/api/v1/payments?${searchParams}`,
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),

      getPaymentsStats: build.query<
        ApiResponse<{
          rides: { count: number; price: number };
          subscriptions: { count: number; price: number };
        }>,
        void
      >({
        query() {
          return {
            url: `/api/v1/payments/stats`,
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),
    };
  },
  overrideExisting: true,
});

export const {
  usePaginatePaymentsQuery,
  useLazyPaginatePaymentsQuery,
  useGetPaymentsStatsQuery,
  useLazyGetPaymentsStatsQuery,
} = userApiSlice;

export default userApiSlice;
