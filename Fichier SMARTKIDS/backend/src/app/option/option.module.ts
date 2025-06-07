import { forwardRef, Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Option, OptionSchema } from './schemas/option.schema';
import { MediaModule } from '../medias/media.module';
import { Media, MediaSchema } from '../medias/schemas/media.schema';
import { AdminOptionController } from './admin.option.controller';
import { Etablissement, EtablissementSchema } from '../etablissement/schemas/etablissement.schema';

@Module({
  controllers: [OptionController, AdminOptionController],
  providers: [OptionService],
  imports: [
    MongooseModule.forFeature([
      { name: Option.name, schema: OptionSchema },
      { name: Media.name, schema: MediaSchema },
      { name: Etablissement.name, schema: EtablissementSchema },
    ]),
  ],
  exports: [OptionService],
})
export class OptionModule {}
