import { IsDateString, IsString, Matches } from 'class-validator';

export class CreateOrUpdateVehicleDto {
  @IsString()
  vehicleModel: string;

  @IsDateString()
  date: Date;

  @IsString()
  @Matches(/^[A-Z]{2}-\d{3}-[A-Z]{2}$/, {
    message: 'Format: AA-123-AA',
  })
  plateNumber: string;

  @IsString({
    each: true,
  })
  languages: string[];
}
