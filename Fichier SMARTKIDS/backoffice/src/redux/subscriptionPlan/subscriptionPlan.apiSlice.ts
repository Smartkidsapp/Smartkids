import { SubscriptionPlan } from "@/types/susbcription-plan.types";
import { ApiResponse, apiSlice } from "../apiSlice";
import { CreateSubscriptionPlanDTO } from "./subscription-plan.request";

export const subscriptionPlanApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlan: builder.query<ApiResponse<SubscriptionPlan[]>, void>({
      query: () => "/subscription-plans",
      providesTags: ["subscription-plans"],
    }),
    createOrUpdateSubscriptionPlan: builder.mutation<
      ApiResponse<SubscriptionPlan>,
      CreateSubscriptionPlanDTO & { id?: string }
    >({
      query: ({ id, ...body }) => ({
        url: id
          ? `/subscription-plans/${id}`
          : "/subscription-plans",
        method: id ? "PUT" : "POST",
        body,
      }),
      invalidatesTags: ["subscription-plans"],
    }),
    deleteSubscriptionPlan: builder.mutation({
      query: (id) => ({
        url: `/subscription-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subscription-plans"],
    }),
  }),
});

export const {
  useGetSubscriptionPlanQuery,
  useLazyGetSubscriptionPlanQuery,
  useCreateOrUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
} = subscriptionPlanApiSlice;
