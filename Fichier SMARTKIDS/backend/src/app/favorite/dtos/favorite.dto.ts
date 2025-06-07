import { IsArray, IsBoolean, IsEnum, IsLatitude, IsLongitude, IsMongoId, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFavoriteDto {

    @ApiProperty({
        title: 'The etablissement favorite.',
        type: String,
        required: true,
    })
    @IsString()
    @IsMongoId({ each: true, message: "The etablissement id must be a valide mongoId" })
    etablissementId: string;
}
