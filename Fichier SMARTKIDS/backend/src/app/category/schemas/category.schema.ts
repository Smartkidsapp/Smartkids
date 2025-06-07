import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MediaDocument } from 'src/app/medias/schemas/media.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
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

  @Prop({ required: false, ref: 'Media', type: Types.ObjectId })
  icon?: Types.ObjectId | MediaDocument<CategoryDocument>;

}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: CategoryDocument = ret as CategoryDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

CategorySchema.set('toJSON', { ...serializationCfg });
CategorySchema.set('toObject', { ...serializationCfg });
