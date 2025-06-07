import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionIntervalUnit } from '../schemas/subscription-plan.schema';

export class CreateSubscriptionPlansDto {
  @ApiProperty({
    title: 'Trial interval unit.',
    type: String,
    enum: ['day', 'week', 'month', 'year'],
  })
  @IsEnum(['day', 'week', 'month', 'year'], {
    message:
      "Veuillez ajouter l'unité d'intervalle pour la période d'essaie ('day', 'week', 'month' ou 'year')",
  })
  trial_interval_unit: SubscriptionIntervalUnit;

  @ApiProperty({
    title: 'Trial interval count.',
    type: Number,
  })
  @IsInt({
    message: "Veuillez ajouter le nombre d'intervalle pour la période d'essaie",
  })
  trial_interval_count: number;

  @ApiProperty({
    title: 'Interval unit.',
    type: String,
    enum: ['day', 'week', 'month', 'year'],
  })
  @IsEnum(['day', 'week', 'month', 'year'], {
    message:
      "Veuillez ajouter l'unité d'intervalle ('day', 'week', 'month' ou 'year')",
  })
  interval_unit: SubscriptionIntervalUnit;

  @ApiProperty({
    title: 'Interval count.',
    type: Number,
  })
  @IsInt({
    message: "Veuillez ajouter le nombre d'intervalle",
  })
  interval_count: number;

  @ApiProperty({
    title: 'Plan price.',
    type: Number,
  })
  @IsNumber({}, { message: 'Veuillez ajouter le prix de la formule.' })
  price: number;

  @ApiProperty({
    title: 'Plan name.',
    type: String,
  })
  @IsString({ message: 'Veuillez ajouter le nom de la formule' })
  name: string;

  @ApiProperty({
    title: 'Plan description.',
    type: String,
  })
  @IsString({ message: 'Veuillez ajouter la description de la formule' })
  description: string;
}
