import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import authStrings from '../contants/auth.strings';
import { UserRoleEnum } from 'src/app/users/schemas/users.schema';
import { IsUniqueMongoose } from 'src/core/validators/IsUniqueMongoose.validator';

export class SignupDto {
  @ApiProperty({
    title: 'The email of the new user.',
    type: String,
    format: 'email',
    required: true,
  })
  @IsUniqueMongoose('User', 'email', {
    message: 'Un utilisateur existe déjà avec cette adresse email.',
  })
  @IsEmail(
    {},
    {
      message: authStrings.E_VALID_EMAIL_REQUIRED,
    },
  )
  email: string;

  @ApiProperty({
    title: 'The name of the new user.',
    type: String,
    required: true,
  })
  @IsString({
    message: authStrings.E_NAME_REQUIRED,
  })
  name: string;

  @ApiProperty({
    title: 'The password of the new user.',
    type: String,
    required: true,
  })
  @IsString({
    message: authStrings.E_PASSWORD_REQUIRED,
  })
  password: string;

  role: UserRoleEnum = UserRoleEnum.CLIENT;
}
