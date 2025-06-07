import { SetMetadata } from '@nestjs/common';
import { OTPType } from 'src/app/tokens/schemas/otp.schema';

export const OTP_JWT_SUB_DECORATOR_KEY = 'auth:otp-jwt-sub';
export const OTPJwtSub = (...handler: OTPType[]) =>
  SetMetadata(OTP_JWT_SUB_DECORATOR_KEY, handler);
