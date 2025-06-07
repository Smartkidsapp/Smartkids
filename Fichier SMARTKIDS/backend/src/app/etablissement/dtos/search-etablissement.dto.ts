import { IsArray, IsBoolean, IsEnum, IsInt, IsLatitude, IsLongitude, IsMongoId, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';

export class SearchEtablissementDto {

    @ApiProperty({
        title: 'The name of the establishment.',
        type: String,
        required: true,
    })
    @IsString({
        message: 'Le nom est requis',
    })
    @IsOptional()
    nom: string;

    @ApiProperty({
        title: 'The longitude of the establishment.',
        type: String,
        required: false,
    })
    @IsLongitude()
    @IsOptional()
    longitude: number;

    @ApiProperty({
        title: 'The latitude of the establishment.',
        type: String,
        required: false,
    })
    @IsLatitude()
    @IsOptional()
    latitude: number;

    @ApiProperty({
        title: 'The category of the establishment.',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsMongoId({ each: true, message: "The category id must be a valide mongoId" })
    category: string;

    @ApiProperty({
        title: 'The page of the request.',
        type: String,
        required: false,
    })
    @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
    @IsInt()
    @IsOptional()
    page: number = 1;

    @ApiProperty({
        title: 'The limit of the request.',
        type: String,
        required: false,
    })
    @Transform(({ value }: TransformFnParams) => parseInt(value, 10))
    @IsInt()
    @IsOptional()
    limit: number = 20;

    @ApiProperty({
        title: 'The max distance between user and etablishment.',
        type: Number,
        required: false,
    })
    @IsOptional()
    distance: number;

    @ApiProperty({
        title: 'The min age of the etablishment.',
        type: Number,
        required: false,
    })
    @IsOptional()
    min_age: number = 0;

    @ApiProperty({
        title: 'The max age of the etablishment.',
        type: Number,
        required: false,
    })
    @IsOptional()
    max_age: number = 99;

    @ApiProperty({
        title: 'The options of the etablishment.',
        type: Array,
        required: false,
    })
    @IsOptional()
    options: any;

}