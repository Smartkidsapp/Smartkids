import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLanguagesDto {
  @ApiProperty({
    title: 'The languages spoken by the user.',
    type: String,
    required: true,
  })
  @IsString({
    message: 'Veuillez choisir vos langues',
    each: true,
  })
  languages: string[];
}
