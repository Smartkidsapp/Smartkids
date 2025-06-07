import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum } from 'class-validator';
import authStrings from '../contants/auth.strings';
import { OTPType, OTP_TYPES } from 'src/app/tokens/schemas/otp.schema';

export class RequestOTPDto {
  @ApiProperty({
    title: 'The email address of the user to generate a new OTP for.',
    type: String,
    format: 'email',
  })
  @IsEmail(
    {},
    {
      message: authStrings.E_VALID_EMAIL_REQUIRED,
    },
  )
  email: string;

  @ApiProperty({
    title: 'The type of the OTP to verify.',
    type: String,
    enum: OTP_TYPES,
  })
  @IsEnum(OTP_TYPES, {
    message: "Type d'OTP invalide.",
  })
  type: OTPType = OTPType.EMAIL_VERIFICATION;
}
