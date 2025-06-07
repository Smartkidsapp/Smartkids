import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFCMTokenDto {
  @ApiProperty({
    title: 'The FCM token to add.',
    type: String,
    required: false,
  })
  @IsString()
  token: string;
}
