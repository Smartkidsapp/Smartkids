import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import authStrings from 'src/app/auth/contants/auth.strings';
import { SignupDto } from 'src/app/auth/dtos/signup.dto';
import { USER_ROLES, UserRoleEnum } from '../schemas/users.schema';

export class CreateUserDto extends SignupDto {
  @ApiProperty({
    title: 'The role of the new user.',
    type: String,
    required: false,
    enum: USER_ROLES,
  })
  @IsOptional()
  @IsEnum(USER_ROLES, {
    message: authStrings.E_FORBIDEN_ROLE,
  })
  role: UserRoleEnum = UserRoleEnum.CLIENT;
}
