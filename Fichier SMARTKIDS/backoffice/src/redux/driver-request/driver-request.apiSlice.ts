import { DriverRequest } from "@/types/driver-request.types";
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedQueryOptions,
  apiSlice,
} from "../apiSlice";
import {
  IDriverRequestFilters,
  ReviewRequestDto,
} from "./driver-request.request";
import QueryString from "qs";

const driverRequestApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      getDriverRequest: build.query<ApiResponse<DriverRequest>, string>({
        query(id) {
          return {
            url: "/api/v1/admin/driver-requests/" + id,
            method: "GET",
          };
        },
        providesTags: ["driver-requests"],
      }),

      paginateDriverRequests: build.query<
        PaginatedApiResponse<DriverRequest>,
        PaginatedQueryOptions<IDriverRequestFilters>
      >({
        query(params) {
          const searchParams = QueryString.stringify(params);
          return {
            url: `/api/v1/admin/driver-requests?${searchParams}`,
            method: "GET",
          };
        },
        providesTags: ["driver-requests"],
      }),

      reviewDriverRequest: build.mutation<
        ApiResponse<DriverRequest>,
        ReviewRequestDto & { id: string }
      >({
        query({ id, ...body }) {
          return {
            url: `/api/v1/admin/driver-requests/${id}/reviews`,
            method: "POST",
            body,
          };
        },
      }),
    };
  },
  overrideExisting: true,
});

export const {
  usePaginateDriverRequestsQuery,
  useLazyGetDriverRequestQuery,
  useGetDriverRequestQuery,
  useLazyPaginateDriverRequestsQuery,
  useReviewDriverRequestMutation,
} = driverRequestApiSlice;

export default driverRequestApiSlice;
