import { IsEnum, IsMongoId } from 'class-validator';
import { MEDIA_TYPES, MediaTypeEnum } from '../schemas/media.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({
    title: 'Id the document to be associated with the media.',
    type: String,
    required: true,
  })
  @IsMongoId()
  ref: string;

  @ApiProperty({
    title: 'Type of the media',
    type: String,
    enum: MEDIA_TYPES,
    required: true,
  })
  @IsEnum(MEDIA_TYPES)
  type: MediaTypeEnum;
}
