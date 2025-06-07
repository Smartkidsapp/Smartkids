import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import authStrings from 'src/app/auth/contants/auth.strings';
import { UserRoleEnum } from 'src/app/users/schemas/users.schema';

const ROLES = [UserRoleEnum.CLIENT, UserRoleEnum.DRIVER];
export class SwitchRoleDto {
  @ApiProperty({
    title: 'The new role the user wants to use the application with.',
    type: String,
    required: false,
    enum: ROLES,
  })
  @IsEnum(ROLES, {
    message: authStrings.E_FORBIDEN_ROLE,
  })
  role: UserRoleEnum = UserRoleEnum.CLIENT;
}
