import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { SortOrder } from 'mongoose';

export class PaginationDto<
  T extends Record<
    string,
    string | number | boolean | any[] | Record<string, any>
  >,
> {
  @ApiProperty({
    title: 'Sort the items by the provided key.',
    type: Object,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const dir = parseInt(value[key], 10);
        if (!isNaN(dir)) {
          value[key] = dir;
        }
      }
    }

    return value;
  })
  sort: Record<string, SortOrder> = { createdAt: -1 };

  @ApiProperty({
    title: 'The page to show.',
    type: Number,
    required: false,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  @IsInt()
  page: number = 1;

  @ApiProperty({
    title: 'Number of items per page.',
    type: Number,
    required: false,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
  @IsInt()
  limit: number = 10;

  @ApiProperty({
    title: 'Filters items.',
    type: Object,
    required: false,
  })
  @IsOptional()
  filter?: T = {};
}
