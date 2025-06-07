import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MediaDocument } from 'src/app/medias/schemas/media.schema';

export type OptionDocument = HydratedDocument<Option>;

@Schema()
export class Option {
  _id: Types.ObjectId;

  id: string;
  
  createdAt: Date;
  
  updatedAt: Date;

  @Prop({ required: true, type: String })
  titre: string;

  @Prop({ required: false, type: String })
  titre_en: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  categories: Types.ObjectId[];

  @Prop({ required: false, ref: 'Media', type: Types.ObjectId })
  icon?: Types.ObjectId | MediaDocument<OptionDocument>;

}

export const OptionSchema = SchemaFactory.createForClass(Option);

OptionSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: OptionDocument = ret as OptionDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

OptionSchema.set('toJSON', { ...serializationCfg });
OptionSchema.set('toObject', { ...serializationCfg });
