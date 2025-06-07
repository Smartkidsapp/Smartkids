import { ApiResponse, apiSlice } from "@/redux/apiSlice";
import {
  AuthResponse,
  OtpResponse,
  RequestOTPDto,
  ResetPasswordRequest,
  SigninRequest,
  SignupDto,
  VerifyEmailDto,
  VerifyPasswordOtpDto,
} from "@/redux/auth/auth.request";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      signin: build.mutation<AuthResponse | OtpResponse, SigninRequest>({
        query(body) {
          return {
            url: "/auth/signin",
            method: "POST",
            body,
          };
        },
      }),
      signup: build.mutation<AuthResponse, SignupDto>({
        query(body) {
          return {
            url: "/auth/signup",
            method: "POST",
            body,
          };
        },
        invalidatesTags: ["users"],
      }),
      signout: build.mutation<void, void>({
        query() {
          return {
            url: "/auth/signout",
            method: "POST",
          };
        },
      }),
      requestOTP: build.mutation<OtpResponse, RequestOTPDto>({
        query(body) {
          return {
            url: "/auth/request-otp",
            method: "POST",
            body,
          };
        },
      }),

      verifyEmail: build.mutation<AuthResponse, VerifyEmailDto>({
        query(body) {
          return {
            url: "/auth/verify-email",
            method: "POST",
            body,
          };
        },
      }),

      verifyPasswordOTP: build.mutation<OtpResponse, VerifyPasswordOtpDto>({
        query(body) {
          return {
            url: "/auth/verify-password-otp",
            method: "POST",
            body,
          };
        },
      }),

      resetPassword: build.mutation<
        ApiResponse<undefined>,
        ResetPasswordRequest
      >({
        query(body) {
          return {
            url: "/auth/reset-password",
            method: "POST",
            body,
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
