import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import authStrings from '../contants/auth.strings';

export class VerifyPasswordOtpDto {
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
    title: 'The OTP value to check.',
    type: String,
  })
  @IsString()
  otp: string;
}
