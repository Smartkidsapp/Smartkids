import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BoostageDocument = HydratedDocument<Boostage>;

export enum BoostageStatusEnum {
  CREATED = 'created',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export const BOOSTAGE_STATUSES = [
  BoostageStatusEnum.CANCELLED,
  BoostageStatusEnum.CREATED,
  BoostageStatusEnum.PAID,
];

@Schema()
export class Boostage {
  _id: Types.ObjectId;

  id: string;
  
  createdAt: Date;
  
  updatedAt: Date;

  @Prop({ type: String, enum: BOOSTAGE_STATUSES, default: BoostageStatusEnum.CREATED })
  status: BoostageStatusEnum;

  @Prop({ required: true, type: Date })
  date_debut: Date;

  @Prop({ required: true, type: Date })
  date_fin: Date;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Etablissement', required: true })
  etablissement: Types.ObjectId;

  @Prop({ default: null, type: Date })
  paidAt: Date | null;

  @Prop({ default: null, type: String })
  paymentIntentId: string;
}

export const BoostageSchema = SchemaFactory.createForClass(Boostage);

BoostageSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: BoostageDocument = ret as BoostageDocument;

    item.id = `${item._id}`;
    
    delete item._id;

    delete item.__v;

    return item;
  },
};

BoostageSchema.set('toJSON', { ...serializationCfg });
BoostageSchema.set('toObject', { ...serializationCfg });