import {
  ApiResponse,
  SuccessResponseEnum,
  apiSlice,
} from '../../../store/apiSlice';
import { GoogleMapsAdresse } from '../../../types';
import { User, UserRoleEnum } from '../../../types/user.types';
import { AuthResponse } from '../../auth/auth.request';
import {
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateProfilePictureDto,
} from './users.request';

const userApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      getSubscriptionStatus: build.query<{
        status: SuccessResponseEnum;
        message?: string;
        data: {
          subscription: {
            subscriptionPlanId: string;
          };
        };
      }, void>({
        query() {
          return {
            url: "/api/v1/users/me/subscription",
            method: "GET",
          };
        },
      }),
      
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
            url: '/api/v1/users/me',
            method: 'GET',
            body,
          };
        },
        providesTags: ['user-profile'],
      }),
      updateProfile: build.mutation<
        {
          status: SuccessResponseEnum;
          message?: string;
          data: User;
        },
        UpdateProfileDto
      >({
        query(body) {
          return {
            url: '/api/v1/users/me',
            method: 'PUT',
            body,
          };
        },
      }),
      updateProfilePicture: build.mutation<
        {
          status: SuccessResponseEnum;
          message?: string;
          data: User;
        },
        UpdateProfilePictureDto
      >({
        query(body) {
          const formData = new FormData();
          //@ts-ignore
          formData.append('avatar', body);
          return {
            url: '/api/v1/users/me/avatar',
            method: 'PUT',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          };
        },
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
            url: '/api/v1/users/me/password',
            method: 'PUT',
            body,
          };
        },
      }),

      addFcmToken: build.mutation<AuthResponse, { token: string }>({
        query(body) {
          return {
            url: '/api/v1/users/me/fcm-tokens',
            method: 'PUT',
            body,
          };
        },
      }),

      deleteAccount: build.mutation<
        {
          status: SuccessResponseEnum;
          message: string;
        },
        void
      >({
        query(body) {
          return {
            url: '/api/v1/users/me',
            method: 'DELETE',
            body,
          };
        },
      }),
      searchPlace: build.query<
          {
              status: SuccessResponseEnum;
              message?: string;
              data: GoogleMapsAdresse[];
          },
          {query: string, lang?: string}
      >({
          query(params) {
              return {
                  url: '/api/v1/geo/place-search',
                  method: 'GET',
                  params,
              };
          },
          providesTags: ['options'],
      })
    };
  },
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useAddFcmTokenMutation,
  useDeleteAccountMutation,
  useSearchPlaceQuery,
  useLazySearchPlaceQuery
} = userApiSlice;

export default userApiSlice;
