import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { User } from 'src/app/users/schemas/users.schema';

export class PaginateUsersDto extends PaginationDto<
  Partial<
    Pick<User, 'role' | 'email' | 'name' | 'activeRole'> & { query?: string }
  >
> {}
