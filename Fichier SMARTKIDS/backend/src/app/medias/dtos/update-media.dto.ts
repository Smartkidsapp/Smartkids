import { IsEnum } from 'class-validator';
import { MEDIA_TYPES, MediaTypeEnum } from '../schemas/media.schema';

export class UpdateMediaDto {
  // @ApiProperty({
  //   title: 'Type of the media',
  //   type: String,
  //   enum: MEDIA_TYPES,
  //   required: true,
  // })
  @IsEnum(MEDIA_TYPES)
  type: MediaTypeEnum;
}
