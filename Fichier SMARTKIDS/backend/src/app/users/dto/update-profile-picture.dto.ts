import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfilePictureDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  profilePicture: any;
}
