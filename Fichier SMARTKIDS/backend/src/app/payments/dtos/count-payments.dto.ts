import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { FilterPaymentDto } from './filter-payments.dto';

export class CountPaymentDto extends PartialType(FilterPaymentDto) {
  @ApiProperty({
    required: false,
    type: String,
    description: 'Group by field',
  })
  @IsString()
  @IsOptional()
  groupBy?: string;
}
