import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { Option } from '../schemas/option.schema';

export class PaginateOptionsDto extends PaginationDto<
  Partial<
    Pick<Option, 'titre'> & { query?: string }
  >
> {}
