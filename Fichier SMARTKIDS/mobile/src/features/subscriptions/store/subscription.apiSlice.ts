import { ApiResponse, apiSlice } from "@/src/store/apiSlice";
import {
  CreateBoostageDto,
  PaySubscriptionDto,
  SubscriptionResponse,
} from "./subscription.request";
import { SubscriptionPlan } from "@/src/types/subscription-plan.types";
import { Boostage, Payment } from "@/src/types";

const subscriptionApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      getSubscriptionStatus: build.query<SubscriptionResponse, void>({
        query(body) {
          return {
            url: "/users/me/subscription",
            method: "GET",
            body,
          };
        },
        providesTags: ["subscriptions"],
      }),

      paySubscription: build.mutation<
        SubscriptionResponse,
        PaySubscriptionDto & {
          changePlan?: boolean;
          subscriptionId?: string;
        }
      >({
        query({ changePlan, subscriptionId, ...body }) {
          return {
            url:
              changePlan && subscriptionId
                ? `/subscriptions/${subscriptionId}/change-plan`
                : "/subscriptions/setup",
            method: "PUT",
            body,
          };
        },
        invalidatesTags: ["user-profile", "subscriptions"],
      }),

      cancelSubscription: build.mutation<ApiResponse<{}>, string>({
        query(id) {
          return {
            url: `/subscriptions/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["subscriptions", "user-profile"],
      }),

      cancelSubscriptionCancelation: build.mutation<ApiResponse<{}>, string>({
        query(id) {
          return {
            url: `/subscriptions/${id}/cancelation`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["subscriptions", "user-profile"],
      }),

      listPlans: build.query<ApiResponse<SubscriptionPlan[]>, void>({
        query: () => "/subscription-plans",
      }),

      approvePaypalSubscription: build.mutation<ApiResponse<{}>, string>({
        query(id) {
          return {
            url: `/subscriptions/${id}/paypal/approve`,
            method: "PUT",
          };
        },
        invalidatesTags: ["subscriptions"],
      }),

      payBoostage: build.mutation<
        ApiResponse<{boostage: Boostage, payment: Payment}>,CreateBoostageDto
      >({
        query(body) {
          return {
            url: "/api/v1/boostage",
            method: "POST",
            body,
          };
        },
        invalidatesTags: ["subscriptions"],
      }),
    };
  },
  overrideExisting: true,
});

export const {
  useGetSubscriptionStatusQuery,
  useLazyGetSubscriptionStatusQuery,
  usePaySubscriptionMutation,
  useCancelSubscriptionMutation,
  useListPlansQuery,
  useLazyListPlansQuery,
  useApprovePaypalSubscriptionMutation,
  useCancelSubscriptionCancelationMutation,
  usePayBoostageMutation
} = subscriptionApiSlice;

export default subscriptionApiSlice;
