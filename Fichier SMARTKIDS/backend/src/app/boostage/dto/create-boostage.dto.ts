import { IsArray, IsBoolean, IsDate, IsEnum, IsLatitude, IsLongitude, IsMongoId, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBoostageDto {

    @ApiProperty({
        title: 'The started date of the boostage.',
        type: Date,
        required: true,
    })
    @IsString({
        message: 'La date de debut est requise',
    })
    date_debut: Date;

    @ApiProperty({
        title: 'The ended date of the boostage.',
        type: Date,
        required: true,
    })
    @IsString({
        message: 'La date de fin est requise',
    })
    date_fin: Date;

    @ApiProperty({
        title: 'The etablissement to boost.',
        type: String,
        required: true,
    })
    @IsString()
    @IsMongoId({ each: true, message: "The etablissement id must be a valide mongoId" })
    etablissement: string;

    @IsString()
    paymentMethod: string;
}
