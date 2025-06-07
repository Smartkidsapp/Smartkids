import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import authStrings from 'src/app/auth/contants/auth.strings';

export class UpdatePasswordDto {
  @ApiProperty({
    title: 'The new password of the user.',
    type: String,
    required: true,
  })
  @IsString({
    message: authStrings.E_PASSWORD_REQUIRED,
  })
  newPassword: string;

  @ApiProperty({
    title: 'The current password of the user.',
    type: String,
    required: true,
  })
  @IsString({
    message: authStrings.E_PASSWORD_REQUIRED,
  })
  currentPassword: string;
}
