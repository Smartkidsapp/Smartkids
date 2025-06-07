import { ApiProperty, PartialType } from '@nestjs/swagger';
import { FilterSubscriptionsDto } from './filter-subscriptions.dto';
import { IsOptional, IsString } from 'class-validator';

export class CountSubscriptionsDto extends PartialType(FilterSubscriptionsDto) {
  @ApiProperty({
    required: false,
    type: String,
    description: 'Group by field',
  })
  @IsString()
  @IsOptional()
  groupBy?: string;
}
