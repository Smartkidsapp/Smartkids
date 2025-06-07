import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema()
export class Favorite {
  _id: Types.ObjectId;

  id: string;
  
  createdAt: Date;
  
  updatedAt: Date;

  @Prop({ required: false, ref: 'Etablissement', type: Types.ObjectId })
  etablissement: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  user: Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);

FavoriteSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: FavoriteDocument = ret as FavoriteDocument;

    item.id = `${item._id}`;
    
    delete item._id;

    delete item.__v;

    return item;
  },
};

FavoriteSchema.set('toJSON', { ...serializationCfg });
FavoriteSchema.set('toObject', { ...serializationCfg });