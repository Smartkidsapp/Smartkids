import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from './users.schema';

export type UserAddressDocument = HydratedDocument<UserAddress>;

export enum AddressTypeEnum {
  PRO = 'pro',
  HOME = 'home',
}

export const ADDRESS_TYPES = [
  AddressTypeEnum.HOME,
  AddressTypeEnum.PRO,
] as const;

export const ADDRESS_TYPES_LABELS: Record<AddressTypeEnum, string> = {
  home: 'Adresse personnelle',
  pro: 'Adresse du domicile',
};

@Schema()
export class UserAddress {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ required: true, type: String, enum: ADDRESS_TYPES })
  type: AddressTypeEnum;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | UserDocument;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);
UserAddressSchema.index(
  {
    type: -1,
    user: 1,
  },
  {
    unique: true,
  },
);

UserAddressSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: UserAddressDocument = ret as UserAddressDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

UserAddressSchema.set('toJSON', { ...serializationCfg });
UserAddressSchema.set('toObject', { ...serializationCfg });
