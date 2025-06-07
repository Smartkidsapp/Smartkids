import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    title: 'Optionnal comment of the rating.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Comment.',
  })
  comment: string | null = null;

  @ApiProperty({
    title: 'The mark of the rating.',
    type: Number,
    required: true,
  })
  @IsNumber(
    {},
    {
      message: 'Veuillez ajouter une note.',
    },
  )
  mark: number;

  @ApiProperty({
    title: 'The etablissement being rated.',
    type: Number,
    required: true,
  })
  @IsString()
  etablissementId: string;
}
