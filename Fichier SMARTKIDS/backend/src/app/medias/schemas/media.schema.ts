import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CategoryDocument } from 'src/app/category/schemas/category.schema';
import { EtablissementDocument } from 'src/app/etablissement/schemas/etablissement.schema';
import { OptionDocument } from 'src/app/option/schemas/option.schema';
import { UserDocument } from 'src/app/users/schemas/users.schema';
import {
  CATEGORY_UPLOAD_DIR,
  ETBS_UPLOAD_DIR,
  OPTION_UPLOAD_DIR,
  USERS_UPLOAD_DIR,
} from 'src/core/constants/upload-dirs.contant';

export type MediaDocument<T extends MediaRefEntity> = HydratedDocument<
  Media<T>
>;

// TODO: add all enity type -> subscription, transaction...
export type MediaRefEntity =
  | CategoryDocument
  | UserDocument
  | EtablissementDocument
  | OptionDocument;

export enum MediaTypeEnum {
  USER_PHOTO = 'user-photo',
  ETBS_IMAGE = 'etbs-image',
  CATEGORY_IMAGE = 'category-image',
  OPTION_IMAGE = 'option-image',
}

export const MEDIA_TYPES = [
  MediaTypeEnum.USER_PHOTO,
  MediaTypeEnum.ETBS_IMAGE,
  MediaTypeEnum.CATEGORY_IMAGE,
  MediaTypeEnum.OPTION_IMAGE
] as const;

export const MEDIA_PATHS: Record<MediaTypeEnum, string> = {
  [MediaTypeEnum.USER_PHOTO]: USERS_UPLOAD_DIR,
  [MediaTypeEnum.ETBS_IMAGE]: ETBS_UPLOAD_DIR,
  [MediaTypeEnum.CATEGORY_IMAGE]: CATEGORY_UPLOAD_DIR,
  [MediaTypeEnum.OPTION_IMAGE]: OPTION_UPLOAD_DIR,
};

@Schema()
export class Media<T extends MediaRefEntity> {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true, enum: MEDIA_TYPES })
  type: MediaTypeEnum;

  @Prop({ required: true })
  mime: string;

  @Prop({ required: true })
  src: string;

  @Prop({ required: true, type: Number })
  size: number;

  @Prop({ required: true, type: Types.ObjectId })
  ref: Types.ObjectId | T;
}

export const MediaSchema = SchemaFactory.createForClass(Media);

MediaSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: MediaDocument<MediaRefEntity> =
      ret as MediaDocument<MediaRefEntity>;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    if (item.src && !item.src.startsWith('http')) {
      item.src =
        process.env.SERVER_URL + `/${MEDIA_PATHS[item.type]}/${item.src}`;
    }

    return item;
  },
};

MediaSchema.set('toJSON', { ...serializationCfg });
MediaSchema.set('toObject', { ...serializationCfg });

export const getMEdiaPhotoPath = () => {};
