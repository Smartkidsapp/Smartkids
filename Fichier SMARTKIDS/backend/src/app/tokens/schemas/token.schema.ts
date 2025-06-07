import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from '../../users/schemas/users.schema';

export type TokenDocument = HydratedDocument<Token>;

export enum TokenType {
  RESET_PASSWORD = 'psswd',
  EMAIL_VERIFICATION = 'otp',
  REFRESH_TOKEN = 'jwt',
}

export const TOKEN_TYPES = [
  TokenType.EMAIL_VERIFICATION,
  TokenType.REFRESH_TOKEN,
  TokenType.RESET_PASSWORD,
];

@Schema()
export class Token {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: String, enum: TOKEN_TYPES, required: true })
  type: TokenType;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  user?: UserDocument;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.set('timestamps', true);

TokenSchema.virtual('user', {
  foreignField: '_id',
  localField: 'userId',
  justOne: true,
});

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (doc, ret) {
    const item: TokenDocument = ret as TokenDocument;

    item.id = `${item._id}`;
    delete item._id;
    delete item.__v;

    return item;
  },
};

TokenSchema.set('toJSON', { ...serializationCfg });
// TokenSchema.set('toObject', { ...serializationCfg });
