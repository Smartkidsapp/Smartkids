import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class FilterPaymentDto {
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
    description: 'The client ID, to filter payments made by the client.',
    type: 'string',
  })
  @IsMongoId()
  @IsOptional()
  client?: string;

  @ApiProperty({
    required: false,
    description:
      'The driver ID, to filter payments (received by rides and pay by subscriptions.) by driver',
    type: 'string',
  })
  @IsMongoId()
  @IsOptional()
  driver?: string;
}
