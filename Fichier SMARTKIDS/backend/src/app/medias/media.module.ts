import { forwardRef, Global, Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schemas/media.schema';
import { Etablissement, EtablissementSchema } from '../etablissement/schemas/etablissement.schema';

@Global()
@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    MongooseModule.forFeature([{ name: Etablissement.name, schema: EtablissementSchema }]),
  ],
  exports: [MediaService],
})
export class MediaModule {}
