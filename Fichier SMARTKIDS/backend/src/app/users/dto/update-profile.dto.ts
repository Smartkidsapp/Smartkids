import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import authStrings from 'src/app/auth/contants/auth.strings';
import { IsUniqueMongoose } from 'src/core/validators/IsUniqueMongoose.validator';

export class UpdateProfileDto {
  @ApiProperty({
    title: 'The email of the user.',
    type: String,
    format: 'email',
    required: true,
  })
  @IsString({
    message: authStrings.E_VALID_EMAIL_REQUIRED,
  })
  email: string;

  @ApiProperty({
    title: 'The name of the user.',
    type: String,
    required: true,
  })
  @IsString({
    message: authStrings.E_NAME_REQUIRED,
  })
  name: string;

  @ApiProperty({
    title: 'The phone number of the user.',
    type: String,
    required: true,
  })
  @IsOptional()
  @IsString({
    message: authStrings.E_VALID_PHONE_REQUIRED,
  })
  /*
  @Matches(/^0\d \d{2} \d{2} \d{2} \d{2}$/, {
    message: 'Format requis: 0x xx xx xx xx',
  })
  */
  @IsUniqueMongoose('User', 'phone', {
    message: 'Un utilisateur existe déjà avec ce numéro de téléphone.',
  })
  phone: string;
}
