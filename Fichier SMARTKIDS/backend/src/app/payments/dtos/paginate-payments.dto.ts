import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { FilterPaymentDto } from './filter-payments.dto';

export class PaginatePaymentsDto extends FilterPaymentDto {
  @ApiProperty({
    required: false,
    description: 'Page number',
    format: 'number',
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number = 1;

  @ApiProperty({
    required: false,
    description: 'Page size',
    format: 'number',
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number = 10;
}
