import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RatingDocument = HydratedDocument<Rating>;

@Schema()
export class Rating {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: Number })
  mark: number;

  @Prop({ default: null, type: String })
  comment: string | null;

  @Prop({ required: true, ref: 'Etablissement', type: Types.ObjectId })
  etablissement: Types.ObjectId;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  author: Types.ObjectId;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

RatingSchema.index(
  {
    author: 1,
    etablissement: -1,
  },
  {
    unique: true,
  },
);

RatingSchema.set('timestamps', true);
const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: RatingDocument = ret as RatingDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

RatingSchema.set('toJSON', { ...serializationCfg });
// RatingSchema.set('toObject', { ...serializationCfg });
