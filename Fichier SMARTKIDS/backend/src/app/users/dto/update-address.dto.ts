import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ADDRESS_TYPES } from '../schemas/user-address.schemas';

export class UpdateAddressDto {
  @ApiProperty({
    title: 'The address of the user.',
    type: String,
    required: true,
  })
  @IsString({
    message: 'Veuillez choisir vos langues',
  })
  address: string;
}

export class AddressTypeDto {
  @ApiProperty({
    title: 'The address of the user.',
    type: String,
    enum: ADDRESS_TYPES,
    required: true,
  })
  @IsEnum(ADDRESS_TYPES)
  @IsString({
    message: 'Ce champ est requires.',
  })
  type: string;
}
