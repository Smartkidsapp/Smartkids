import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/app/users/schemas/users.schema';

export const ONLY_ROLES_DECORATOR_KEY = 'auth:only-roles';
export const OnlyRoles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ONLY_ROLES_DECORATOR_KEY, roles);
