import { Subscription } from "@/types/subscription";
import {
  PaginatedApiResponse,
  PaginatedQueryOptions,
  apiSlice,
} from "@/redux/apiSlice";
import QueryString from "qs";
import { ISubScriptionFilters } from "./subscription.request";

const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      paginateSubscriptions: build.query<
        PaginatedApiResponse<Subscription>,
        PaginatedQueryOptions<ISubScriptionFilters>
      >({
        query(params) {
          const searchParams = QueryString.stringify(params);
          return {
            url: `/api/v1/admin/subscriptions?${searchParams}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const {
  usePaginateSubscriptionsQuery,
  useLazyPaginateSubscriptionsQuery,
} = subscriptionApiSlice;

export default subscriptionApiSlice;
