import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { User } from 'src/app/users/schemas/users.schema';
import { Category } from '../schemas/category.schema';

export class PaginateCategoriesDto extends PaginationDto<
  Partial<
    Pick<Category, 'titre'> & { query?: string }
  >
> {}
