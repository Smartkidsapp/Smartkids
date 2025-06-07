import { Ride, RideInvoiceData } from "@/types/ride";
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedQueryOptions,
  apiSlice,
} from "../apiSlice";
import { Payment } from "@/types/payment";
import QueryString from "qs";
import {
  IRideFilters,
  PriceConfig,
  RideStatsReponse,
  UpdatePricesConfigDto,
} from "./ride.request";
import { RideOffer } from "@/types/ride-offer";

const rideApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      paginateRides: build.query<
        PaginatedApiResponse<Ride>,
        PaginatedQueryOptions<IRideFilters>
      >({
        query(params) {
          const queryString = QueryString.stringify(params);
          return {
            url: "/api/v1/admin/rides" + `?${queryString}`,
            method: "GET",
          };
        },
        providesTags: ["rides"],
      }),

      deleteRide: build.mutation<ApiResponse<Ride>, string>({
        query(rideId) {
          return {
            url: `/api/v1/rides/${rideId}`,
            method: "DELETE",
          };
        },
      }),

      eraseRide: build.mutation<ApiResponse<void>, string>({
        query(rideId) {
          return {
            url: `/api/v1/admin/rides/${rideId}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["rides"],
      }),

      getRide: build.query<ApiResponse<Ride>, string>({
        query(rideId) {
          return {
            url: `/api/v1/rides/${rideId}`,
            method: "GET",
          };
        },
      }),

      paginateRideOffers: build.query<
        PaginatedApiResponse<RideOffer>,
        PaginatedQueryOptions<Partial<RideOffer>> & { rideId: string }
      >({
        query({ rideId, ...rest }) {
          const queryString = QueryString.stringify(rest);
          return {
            url: `/api/v1/admin/rides/${rideId}/ride-offers?${queryString}`,
            method: "GET",
          };
        },
      }),

      paginateUserOffers: build.query<
        PaginatedApiResponse<RideOffer>,
        PaginatedQueryOptions<Partial<RideOffer>> & { userId: string }
      >({
        query({ userId, ...rest }) {
          const queryString = QueryString.stringify(rest);
          return {
            url: `/api/v1/admin/users/${userId}/ride-offers?${queryString}`,
            method: "GET",
          };
        },
      }),

      getRideInvoice: build.query<
        ApiResponse<{
          payment: Payment;
          invoiceData: RideInvoiceData;
        }>,
        string
      >({
        query(id) {
          return {
            url: `/api/v1/admin/rides/${id}/invoice`,
            method: "GET",
          };
        },
      }),

      getUserRideStats: build.query<ApiResponse<RideStatsReponse>, string>({
        query(id) {
          return {
            url: `/api/v1/admin/users/${id}/stats`,
            method: "GET",
          };
        },
      }),

      getRideStats: build.query<ApiResponse<RideStatsReponse>, void>({
        query() {
          return {
            url: `/api/v1/admin/ride-stats`,
            method: "GET",
          };
        },
      }),

      updatePricesConfig: build.mutation<
        ApiResponse<PriceConfig>,
        UpdatePricesConfigDto
      >({
        query(body) {
          return {
            url: "/api/v1/price-configs",
            method: "PUT",
            body,
          };
        },
        invalidatesTags: ["price-configs"],
      }),

      getPricesConfig: build.query<ApiResponse<PriceConfig>, void>({
        query() {
          return {
            url: "/api/v1/price-configs",
            method: "GET",
          };
        },
        providesTags: ["price-configs"],
      }),
    };
  },
  overrideExisting: true,
});

export const {
  useLazyPaginateRidesQuery,
  usePaginateRidesQuery,
  useDeleteRideMutation,
  useGetRideInvoiceQuery,
  useLazyGetRideInvoiceQuery,
  useGetRideQuery,
  useLazyGetRideQuery,
  usePaginateRideOffersQuery,
  useLazyPaginateRideOffersQuery,
  useEraseRideMutation,
  useGetUserRideStatsQuery,
  useLazyGetUserRideStatsQuery,
  useLazyPaginateUserOffersQuery,
  usePaginateUserOffersQuery,
  useGetRideStatsQuery,
  useLazyGetRideStatsQuery,
  useUpdatePricesConfigMutation,
  useGetPricesConfigQuery,
  useLazyGetPricesConfigQuery,
} = rideApiSlice;

export default rideApiSlice;
