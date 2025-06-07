import { ApiResponse, apiSlice } from '../../store/apiSlice';
import {
  AuthResponse,
  OtpResponse,
  RequestOTPDto,
  ResetPasswordRequest,
  SigninRequest,
  SignupDto,
  VerifyEmailDto,
  VerifyPasswordOtpDto,
} from './auth.request';

const authApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      signin: build.mutation<AuthResponse | OtpResponse, SigninRequest>({
        query(body) {
          return {
            url: '/auth/signin',
            method: 'POST',
            body,
          };
        },
      }),
      signup: build.mutation<AuthResponse, SignupDto>({
        query(body) {
          return {
            url: '/auth/signup',
            method: 'POST',
            body,
          };
        },
      }),
      signout: build.mutation<
        void,
        {
          refreshToken?: string | null;
          fcmToken?: string | null;
        }
      >({
        query({ fcmToken, refreshToken }) {
          const headers: Record<string, string> = {};
          if (refreshToken) {
            headers['X-Refresh-Token-Id'] = refreshToken;
          }

          if (fcmToken) {
            headers['X-FCM-Token'] = fcmToken;
          }

          return {
            url: '/auth/signout',
            method: 'POST',
            headers,
          };
        },
      }),
      requestOTP: build.mutation<OtpResponse, RequestOTPDto>({
        query(body) {
          return {
            url: '/auth/request-otp',
            method: 'POST',
            body,
          };
        },
      }),

      verifyEmail: build.mutation<
        AuthResponse,
        VerifyEmailDto & { token: string }
      >({
        query({ token, ...body }) {
          return {
            url: '/auth/verify-email',
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),

      verifyPasswordOTP: build.mutation<
        OtpResponse,
        VerifyPasswordOtpDto & { token: string }
      >({
        query({ token, ...body }) {
          return {
            url: '/auth/verify-password-otp',
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),

      resetPassword: build.mutation<
        ApiResponse<undefined>,
        ResetPasswordRequest
      >({
        query({ token, ...body }) {
          return {
            url: '/auth/reset-password',
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),
    };
  },
});

export const {
  useSigninMutation,
  useRequestOTPMutation,
  useResetPasswordMutation,
  useSignoutMutation,
  useSignupMutation,
  useVerifyEmailMutation,
  useVerifyPasswordOTPMutation,
} = authApiSlice;

export default authApiSlice;
