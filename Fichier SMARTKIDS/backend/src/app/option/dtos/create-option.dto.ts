import { IsArray, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOptionDto {

    @ApiProperty({
        title: 'The title of the option.',
        type: String,
        required: true,
    })
    @IsString({
        message: 'Le titre est requis',
    })
    titre: string;

    @ApiProperty({
        title: 'The title in english of the category.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    titre_en: string;

    @ApiProperty({
        title: 'The description of the option.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    description: string;

    @IsMongoId({ each: true, message: "The category id must be a valide mongoId" })
    @Type(() => String)
    categories: string[];
}
