import { forwardRef, Module } from '@nestjs/common';
import { BoostageController } from './boostage.controller';
import { BoostageService } from './boostage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Boostage, BoostageSchema } from './schemas/boostage.schema';
import { Etablissement, EtablissementSchema } from '../etablissement/schemas/etablissement.schema';
import { PaymentModule } from '../payments/payments.module';
import { User, UserSchema } from '../users/schemas/users.schema';

@Module({
  controllers: [BoostageController],
  providers: [BoostageService],
  imports: [
    MongooseModule.forFeature([
      { name: Boostage.name, schema: BoostageSchema },
      { name: Etablissement.name, schema: EtablissementSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => PaymentModule),
  ],
  exports: [BoostageService],
})
export class BoostageModule {}
