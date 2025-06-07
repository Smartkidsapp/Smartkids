import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MediaDocument } from 'src/app/medias/schemas/media.schema';
import { VehicleDocument } from './vehicle.schema';

export enum UserStatusEnum {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  SUBSCRIPTION_INACTIVE = 'sub-inac',
}

export const BASE_POPULATE = ['media', 'vehicle'];

export type UserDocument = HydratedDocument<User>;

export enum UserRoleEnum {
  DRIVER = 'driver',
  CLIENT = 'client',
  ADMIN = 'admin',
}

export const USER_STATUSES = [
  UserStatusEnum.ACTIVE,
  UserStatusEnum.INACTIVE,
  UserStatusEnum.SUBSCRIPTION_INACTIVE,
] as const;

export const USER_ROLES = [
  UserRoleEnum.CLIENT,
  UserRoleEnum.ADMIN,
  UserRoleEnum.DRIVER,
] as const;

export const USER_ROLES_LABELS: Record<UserRoleEnum, string> = {
  admin: 'Administrateur',
  client: 'Client',
  driver: 'Chauffeur',
};

@Schema()
export class User {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String, default: null })
  stripeCustomerId: string;

  /**
   * Since paypal uses internal wallets.
   * Customer's ids are not managed by the application developer.
   * So one user can actually use many paypal account/customer id.
   */
  @Prop({ required: false, type: [String], default: [] })
  paypalCustomerIds: string[];

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: false, unique: false, type: String })
  phone: string;

  @Prop({ required: false, ref: 'Media', type: Types.ObjectId })
  media?: Types.ObjectId | MediaDocument<UserDocument>;

  /**
   * This role field is changed when the admin validate the request.
   */
  @Prop({ default: UserRoleEnum.CLIENT, type: String, enum: [...USER_ROLES] })
  role: UserRoleEnum;

  @Prop({ type: String, enum: USER_STATUSES, required: true })
  status: UserStatusEnum;

  @Prop({ default: ['fr'], type: [String] })
  languages: string[];

  /**
   * This is what gives drivers full rigths as a driver.
   * The user must have a validated request and have
   * an active subscription to have this property equal to `true`.
   */
  @Prop({ default: false, type: Boolean })
  isSeller: boolean;

  /**
   * Allows the user to swicth his role.
   * This is the role that will be used for JWT credentials
   * & will allow drivers to navigate the appilication with client
   * interfaces.
   */
  @Prop({ default: UserRoleEnum.CLIENT, type: String, enum: [...USER_ROLES] })
  activeRole: UserRoleEnum;

  @Prop({
    ref: 'Vehicle',
    type: Types.ObjectId,
    unique: true,
    default: undefined,
    sparse: true,
  })
  vehicle: VehicleDocument | Types.ObjectId | null;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ default: null, type: Date })
  deletedAt: Date | null;

  @Prop({ default: false, type: Boolean })
  emailVerified: boolean;

  @Prop({ default: false, type: Boolean })
  trialled?: boolean;

  avatar?: string;

  rating?: {
    avg: number;
    total: number;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: UserDocument = ret as UserDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    if (!item.deletedAt) {
      delete item.deletedAt;
    }

    delete item.password;

    delete item.stripeCustomerId;

    delete item.paypalCustomerIds;

    if (item.media && 'src' in item.media && !item.avatar?.startsWith('http')) {
      const avatar = item.media.src;
      item.avatar = !avatar.startsWith('http')
        ? process.env.SERVER_URL + `/${avatar}`
        : avatar;
    }

    delete item.media;
    delete item.media;

    return item;
  },
};

UserSchema.set('toJSON', { ...serializationCfg });
UserSchema.set('toObject', { ...serializationCfg });
