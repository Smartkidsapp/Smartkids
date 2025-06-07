import { User } from "@/types/user.types";
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedQueryOptions,
  SuccessResponseEnum,
  apiSlice,
} from "@/redux/apiSlice";
import {
  UpdateLanguagesDto,
  UpdatePasswordDto,
  IUserFilters,
} from "@/redux/users/users.request";
import qs from "qs";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      getProfile: build.query<
        {
          status: SuccessResponseEnum;
          message?: string;
          data: User;
        },
        void
      >({
        query(body) {
          return {
            url: "/api/v1/users/me",
            method: "GET",
            body,
          };
        },
        providesTags: ["user-profile"],
      }),

      updatePassword: build.mutation<
        {
          status: SuccessResponseEnum;
          message: string;
        },
        UpdatePasswordDto
      >({
        query(body) {
          return {
            url: "/api/v1/users/me/password",
            method: "PUT",
            body,
          };
        },
      }),

      updateLanguages: build.mutation<
        ApiResponse<string[]>,
        UpdateLanguagesDto
      >({
        query(body) {
          return {
            url: "/api/v1/users/me/languages",
            method: "PUT",
            body,
          };
        },
      }),

      paginateUsers: build.query<
        PaginatedApiResponse<User>,
        PaginatedQueryOptions<IUserFilters>
      >({
        query(params) {
          const searchParams = qs.stringify(params);
          return {
            url: `/api/v1/admin/users?${searchParams}`,
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),

      deleteAccount: build.mutation<
        {
          status: SuccessResponseEnum;
          message: string;
        },
        string
      >({
        query(userId) {
          return {
            url: `/api/v1/admin/users/${userId}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["users"],
      }),

      getCanDeleteAccount: build.query<
        {
          status: SuccessResponseEnum;
        },
        string
      >({
        query(userId) {
          return {
            url: `/api/v1/admin/users/${userId}/can-delete`,
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),

      getUser: build.query<ApiResponse<User>, string>({
        query(userId) {
          return {
            url: `/api/v1/admin/users/${userId}`,
            method: "GET",
          };
        },
        providesTags: ["users"],
      }),

      getStats: build.query<
        ApiResponse<{
          users: number,
          etablissements: number,
          categories: number,
          options: number,
          subscriptionPlans: number
        }>,
        void
      >({
        query() {
          return {
            url: '/api/v1/admin/users/dashboard',
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
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdatePasswordMutation,
  useUpdateLanguagesMutation,
  usePaginateUsersQuery,
  useLazyPaginateUsersQuery,
  useDeleteAccountMutation,
  useLazyGetCanDeleteAccountQuery,
  useGetCanDeleteAccountQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetStatsQuery,
  useLazyGetStatsQuery
} = userApiSlice;

export default userApiSlice;
