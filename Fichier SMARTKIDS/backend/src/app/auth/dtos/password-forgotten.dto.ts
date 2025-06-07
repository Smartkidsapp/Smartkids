import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import authStrings from '../contants/auth.strings';

export class PasswordForgottenDto {
  @ApiProperty({
    title: 'The email address of the user to reset password for.',
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
}
