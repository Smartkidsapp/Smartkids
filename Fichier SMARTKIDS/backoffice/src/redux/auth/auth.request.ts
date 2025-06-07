import { OTPType, User } from "@/types/user.types";
import { ApiResponse } from "@/redux/apiSlice";
import { z } from "zod";

export interface SigninRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const SigninSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Ce champ est requis",
      required_error: "Ce champ est requis",
    })
    .email({
      message: "Veuillez saisir une adresse email valide",
    }),
  password: z.string({
    invalid_type_error: "Ce champ est requis",
    required_error: "Ce champ est requis",
  }),
});

export const SignupSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Ce champ est requis",
      required_error: "Ce champ est requis",
    })
    .email({
      message: "Veuillez saisir une adresse email valide",
    }),
  password: z.string({
    invalid_type_error: "Ce champ est requis",
    required_error: "Ce champ est requis",
  }),
  name: z.string({
    invalid_type_error: "Ce champ est requis",
    required_error: "Ce champ est requis",
  }),

  phone: z
    .string({
      invalid_type_error: "Ce champ est requis",
      required_error: "Ce champ est requis",
    })
    .regex(/^0\d \d{2} \d{2} \d{2} \d{2}$/, {
      message: "Format requis: 0x xx xx xx xx",
    }),
});

export interface SignupDto {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export interface PasswordForgottenRequest {
  email: string;
}

export interface VerifyRecoveryCodeRequest {
  code: number;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface RequestOTPDto {
  email: string;
  type: OTPType;
}

export interface VerifyPasswordOtpDto {
  email: string;
  otp: string;
}

export interface VerifyEmailDto {
  email: string;
  type: OTPType;
  otp: string;
}

export type AuthResponse = ApiResponse<{
  access_token: string;
  refresh_token?: { id: string; value: string };
  user: User;
}>;

export type OtpResponse = ApiResponse<{
  access_token: string;
}>;
