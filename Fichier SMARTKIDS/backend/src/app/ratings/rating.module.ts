import { Module, forwardRef } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schemas/rating.schema';
import { UserModule } from '../users/user.module';
import { EtablissementModule } from '../etablissement/etablissement.module';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    forwardRef(() => UserModule),
    forwardRef(() => EtablissementModule),
  ],
  exports: [RatingService],
})
export class RatingModule {}
