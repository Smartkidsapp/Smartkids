import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from './users.schema';

export type FCMTokenDocument = HydratedDocument<FCMToken>;

@Schema()
export class FCMToken {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: String })
  value: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | UserDocument;
}

export const FCMTokenSchema = SchemaFactory.createForClass(FCMToken);

FCMTokenSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: FCMTokenDocument = ret as FCMTokenDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

FCMTokenSchema.set('toJSON', { ...serializationCfg });
FCMTokenSchema.set('toObject', { ...serializationCfg });
