import { ApiResponse, apiSlice } from "@/src/store/apiSlice";
import { PaymentMethodsResponse } from "./payment.dto";
import { Payment, PaymentTypeEnum } from "@/src/types";
import { useLazyGetBoostedEtablissementsQuery } from "../../etablissement/etablissement.apiSlice";

const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      listStripePaymentMethods: build.query<PaymentMethodsResponse, void>({
        query() {
          return {
            method: "GET",
            url: "/payment-methods",
            params: {
              type: "stripe",
            },
          };
        },
        providesTags: ["stripe-pms"],
      }),
      listPaypalPaymentMethods: build.query<PaymentMethodsResponse, void>({
        query() {
          return {
            method: "GET",
            url: "/payment-methods",
            params: {
              type: "paypal",
            },
          };
        },
        providesTags: ["paypal-pms"],
      }),
      deletePaymentMethod: build.mutation<
        PaymentMethodsResponse,
        { type: "stripe" | "paypal"; id: string }
      >({
        query({ id, type }) {
          return {
            method: "DELETE",
            url: `/payment-methods/${id}`,
            params: {
              type,
            },
          };
        },
        async onQueryStarted({ type }, { dispatch, queryFulfilled }) {
          try {
            await queryFulfilled;
            setTimeout(() => {
              dispatch(
                apiSlice.util.invalidateTags([
                  type === "paypal" ? "paypal-pms" : "stripe-pms",
                ])
              );
            }, 500);
          } catch {}
        },
      }),
      listUserBoostagesPayments: build.query<ApiResponse<Payment[]>, PaymentTypeEnum>({
        query(type) {
          return {
            method: "GET",
            url: "/api/v1/payments/user",
            params: {type},
          };
        },
        providesTags: ["subscriptions"],
      }),
    };
  },
  overrideExisting: true,
});

export const {
  useDeletePaymentMethodMutation,
  useListPaypalPaymentMethodsQuery,
  useListStripePaymentMethodsQuery,
  useLazyListPaypalPaymentMethodsQuery,
  useLazyListStripePaymentMethodsQuery,
  useListUserBoostagesPaymentsQuery,
  useLazyListUserBoostagesPaymentsQuery
} = paymentApiSlice;

export default paymentApiSlice;
