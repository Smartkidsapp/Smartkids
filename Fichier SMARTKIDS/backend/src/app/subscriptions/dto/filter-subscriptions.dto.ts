import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class FilterSubscriptionsDto {
  @ApiProperty({
    required: false,
    description: 'Search query',
    format: 'string',
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({
    required: false,
    description: 'The author of the rating',
    type: 'string',
  })
  @IsMongoId()
  @IsOptional()
  user?: string;
}
