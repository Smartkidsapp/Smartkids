import { forwardRef, Module } from '@nestjs/common';
import { EtablissementController } from './etablissement.controller';
import { EtablissementService } from './etablissement.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Etablissement, EtablissementSchema } from './schemas/etablissement.schema';
import { Media, MediaSchema } from '../medias/schemas/media.schema';
import { User, UserSchema } from '../users/schemas/users.schema';
import { MediaModule } from '../medias/media.module';
import { AdminEtablissementController } from './admin.etablissement.controller';

@Module({
  controllers: [EtablissementController, AdminEtablissementController],
  providers: [EtablissementService],
  imports: [
    MongooseModule.forFeature([
      { name: Etablissement.name, schema: EtablissementSchema },
      { name: Media.name, schema: MediaSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [EtablissementService],
})

export class EtablissementModule {}
