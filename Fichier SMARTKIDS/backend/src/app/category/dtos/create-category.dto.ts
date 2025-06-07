import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {

    @ApiProperty({
        title: 'The title of the category.',
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
        title: 'The description of the category.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    description: string;
}
