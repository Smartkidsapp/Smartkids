import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import authStrings from '../contants/auth.strings';

export class SigninDto {
  @ApiProperty({
    title: 'The email address of the user to login.',
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
    title: 'The password of the user to login.',
    type: String,
  })
  @IsString({
    message: authStrings.E_PASSWORD_REQUIRED,
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  rememberMe: boolean = true;
}
