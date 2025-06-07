import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import authStrings from '../contants/auth.strings';
import { OTPType, OTP_TYPES } from 'src/app/tokens/schemas/otp.schema';

export class VerifyEmailDto {
  @ApiProperty({
    title: 'The email address of the user to verify the email for.',
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
    title: 'The type of the token to verify.',
    type: String,
    enum: OTP_TYPES,
  })
  @IsEnum(OTP_TYPES, {
    message: 'Type de token invalide.',
  })
  type: OTPType;

  @ApiProperty({
    title: 'The OTP value to check.',
    type: String,
  })
  @IsString()
  otp: string;
}
