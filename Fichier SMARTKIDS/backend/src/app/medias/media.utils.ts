import { MediaTypeEnum } from './schemas/media.schema';

export function isDriverDoc(type: MediaTypeEnum) {
  return [
    MediaTypeEnum.ETBS_IMAGE,
    MediaTypeEnum.USER_PHOTO,
  ].includes(type);
}
