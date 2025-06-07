import { Issue } from "@/types/issue.types";
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedQueryOptions,
  apiSlice,
} from "../apiSlice";
import { IIssueFilters } from "./issue.request";
import QueryString from "qs";

const issueApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      paginateIssues: build.query<
        PaginatedApiResponse<Issue>,
        PaginatedQueryOptions<IIssueFilters>
      >({
        query(params) {
          const searchParams = QueryString.stringify(params);
          return {
            url: `/api/v1/admin/issues?${searchParams}`,
            method: "GET",
          };
        },
        providesTags: ["issues"],
      }),

      deleteIssue: build.mutation<ApiResponse<void>, string>({
        query(rideId) {
          return {
            url: `/api/v1/admin/issues/${rideId}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["issues"],
      }),
    };
  },
  overrideExisting: true,
});

export const {
  usePaginateIssuesQuery,
  useLazyPaginateIssuesQuery,
  useDeleteIssueMutation,
} = issueApiSlice;

export default issueApiSlice;
