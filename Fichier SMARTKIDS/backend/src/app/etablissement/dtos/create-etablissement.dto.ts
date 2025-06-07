import { IsArray, IsBoolean, IsEnum, IsLatitude, IsLongitude, IsMongoId, IsNumber, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Services } from '../schemas/etablissement.schema';


export class CreateEtablissementDto {

    @ApiProperty({
        title: 'The name of the establishment.',
        type: String,
        required: true,
    })
    @IsString({
        message: 'Le nom est requis',
    })
    nom: string;

    @ApiProperty({
        title: 'The description of the establishment.',
        type: String,
        required: false,
    })
    @IsString({
        message: 'La description est requise',
    })
    description: string;

    @ApiProperty({
        title: 'The promo code of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    code_promo: string;

    @ApiProperty({
        title: 'The phone number of the establishment.',
        type: String,
        required: false,
    })
    @IsString({
        message: 'Le numéro de téléphone est requis',
    })
    phone: string;

    @ApiProperty({
        title: 'The address of the establishment.',
        type: String,
        required: false,
    })
    @IsString({
        message: "L'adresse est requise",
    })
    adresse: string;

    @ApiProperty({
        title: 'The longitude of the establishment.',
        type: String,
        required: false,
    })
    @IsLongitude()
    @IsOptional()
    longitude: string;

    @ApiProperty({
        title: 'The latitude of the establishment.',
        type: String,
        required: false,
    })
    @IsLatitude()
    @IsOptional()
    latitude: string;

    @ApiProperty({
        title: 'The opening hours of the establishment.',
        type: String,
        required: false,
    })
    @IsArray()
    @IsOptional()
    dailyOpeningHours: string[];

    @ApiProperty({
        title: 'The services of the establishment.',
        type: String,
        required: false,
    })
    @IsOptional()
    services: string[] | string;

    @ApiProperty({
        title: 'The category of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsMongoId({ each: true, message: "The category id must be a valide mongoId" })
    category: string;

    @ApiProperty({
        title: 'The option of the establishment.',
        type: String,
        required: false,
    })
    @IsMongoId({ each: true, message: "The option id must be a valide mongoId" })
    @Type(() => String)
    @IsOptional()
    options: string;

    @ApiProperty({
        title: 'The minimum age of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    min_age: string;

    @ApiProperty({
        title: 'The maximum age of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    max_age: string;

    @ApiProperty({
        title: 'Number of clicks on the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    click: string;

    @ApiProperty({
        title: 'Number of views on the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    vue: string;

    @ApiProperty({
        title: 'The website URL of the establishment.',
        type: String,
        required: false,
        example: 'https://www.mon-etablissement.fr',
      })
      @IsString()
      @IsOptional()
      website?: string;  


    @ApiProperty({
        title: 'Facebook of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    facebook: string;

    @ApiProperty({
        title: 'instagram of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    instagram: string;

    @ApiProperty({
        title: 'tiktok of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    tiktok: string;

    @ApiProperty({
        title: 'linkedin of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    linkedin: string;
    
}

class OpeningHours {
  @IsEnum([0, 1, 2, 3, 4, 5, 6])
  day: number;

  @IsBoolean()
  available: boolean;

  @IsString()
  @Matches(/^\d{2}h\d{2}$/)
  from: string;

  @IsString()
  @Matches(/^\d{2}h\d{2}$/)
  to: string;
}
