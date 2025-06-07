import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { User } from 'src/app/users/schemas/users.schema';
import { Etablissement } from '../schemas/etablissement.schema';

export class PaginateEtablissementsDto extends PaginationDto<
  Partial<
    Pick<Etablissement, 'nom'> & { query?: string }
  >
> {}
