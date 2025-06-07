import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from '../../users/schemas/users.schema';

export type OTPDocument = HydratedDocument<OTP>;

export enum OTPType {
  RESET_PASSWORD = 'psd',
  EMAIL_VERIFICATION = 'evf',
}

export const OTP_TYPES = [OTPType.EMAIL_VERIFICATION, OTPType.RESET_PASSWORD];

@Schema()
export class OTP {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: String, enum: OTP_TYPES, required: true })
  type: OTPType;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  user?: UserDocument;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

OTPSchema.set('timestamps', true);

/**
 * For security reason one user cannot have multiple OTP.
 * And OTPs are single usage.
 */
OTPSchema.index({
  userId: 1,
  type: -1,
});

OTPSchema.virtual('user', {
  foreignField: '_id',
  localField: 'userId',
  justOne: true,
});

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (doc, ret) {
    const item: OTPDocument = ret as OTPDocument;

    item.id = `${item._id}`;
    delete item._id;
    delete item.__v;

    return item;
  },
};

OTPSchema.set('toJSON', { ...serializationCfg });
// OTPSchema.set('toObject', { ...serializationCfg });
