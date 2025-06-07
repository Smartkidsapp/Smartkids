import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class LatLngDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}

export class GetDirectionDto {
  @ApiProperty({
    description: 'Latitude and longitude of the starting point',
    type: 'object',
    properties: {
      latitude: {
        type: 'number',
        example: 48.8566,
      },
      longitude: {
        type: 'number',
        example: 2.3522,
      },
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => LatLngDto)
  from: LatLngDto;

  @ApiProperty({
    description: 'Latitude and longitude of the starting point',
    type: 'object',
    properties: {
      latitude: {
        type: 'number',
        example: 48.8566,
      },
      longitude: {
        type: 'number',
        example: 2.3522,
      },
    },
  })
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => LatLngDto)
  to: LatLngDto;

  @ApiProperty({
    description: 'Latitude and longitude of the starting point',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        latitude: {
          type: 'number',
          example: 48.8566,
        },
        longitude: {
          type: 'number',
          example: 2.3522,
        },
      },
    },
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LatLngDto)
  waypoints: LatLngDto[] = [];
}
