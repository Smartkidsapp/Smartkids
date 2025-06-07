import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import authStrings from '../contants/auth.strings';

export class ResetPasswordDto {
  @ApiProperty({
    title: 'The email address of the user to update the password for.',
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
    title: 'The new password.',
    type: String,
  })
  @IsString()
  password: string;
}
