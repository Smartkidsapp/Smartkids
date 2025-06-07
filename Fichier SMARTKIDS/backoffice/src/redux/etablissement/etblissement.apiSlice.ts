import { Ride, RideInvoiceData } from "@/types/ride";
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedQueryOptions,
  SuccessResponseEnum,
  apiSlice,
} from "../apiSlice";
import QueryString from "qs";
import { Etablissement } from "@/types/etablissement";
import { IEtablissementFilters } from "./etablissement.request";

const etablissementApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      paginateEtablissements: build.query<
        PaginatedApiResponse<Etablissement>,
        PaginatedQueryOptions<IEtablissementFilters>
      >({
        query(params) {
          const queryString = QueryString.stringify(params);
          return {
            url: "/api/v1/admin/etablissement" + `?${queryString}`,
            method: "GET",
          };
        },
        providesTags: ["etablissements"],
      }),

      getEtablissementByUser: build.query<
        ApiResponse<Etablissement>,
        string
      >({
        query(id) {
          return {
            url: `/api/v1/admin/etablissement/user/${id}`,
            method: "GET",
          };
        },
      }),

      getEtablissement: build.query<
        ApiResponse<Etablissement>,
        string
      >({
        query(id) {
          return {
            url: `/api/v1/admin/etablissement/${id}`,
            method: "GET",
          };
        },
      }),

      deleteEtablissement: build.mutation<
        {
          status: SuccessResponseEnum;
          message: string;
        },
        string
      >({
        query(id) {
          return {
            url: `/api/v1/admin/etablissement/${id}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["etablissements"],
      }),
    };
  },
  overrideExisting: true,
});

export const {
    usePaginateEtablissementsQuery,
    useGetEtablissementByUserQuery, 
    useLazyGetEtablissementByUserQuery,
    useLazyPaginateEtablissementsQuery,
    useGetEtablissementQuery,
    useDeleteEtablissementMutation
} = etablissementApiSlice;

export default etablissementApiSlice;
