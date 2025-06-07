import { DriverRequest } from "./driver-request.types";
import { Issue } from "./issue.types";
import { User } from "./user.types";

export enum MediaTypeEnum {
  USER_PHOTO = "user-photo",
  ISSUE_DOC = "issue-doc",
  DRIVER_VEHICLE = "vehicle",
  DRIVER_VEHICLE_CERTIFICATE = "vehicleCertificate",
  DRIVER_ID_CARD = "idCard",
  DRIVER_LICENSE = "driverLicense",
  DRIVER_INSURANCE = "insurance",
  DRIVER_TECH_CONTROL = "technicalControl",
  DRIVER_MACARON_VTC = "macaronVtc",
  DRIVER_TRAINING_CERT = "trainingCertificate",
  DRIVER_KBITS_REGISTER = "kbitsRegister",
  DRIVER_VTC_APPROVAL = "vtcApproval",

  RIDE_OBSERVATION = "driver-obs",
}

export const DRIVER_DOC_REF_MEDIA_PROP: Record<string, string> = {
  [MediaTypeEnum.DRIVER_VEHICLE]: "vehicle",
  [MediaTypeEnum.DRIVER_VEHICLE_CERTIFICATE]: "vehicleCertificate",
  [MediaTypeEnum.DRIVER_ID_CARD]: "idCard",
  [MediaTypeEnum.DRIVER_LICENSE]: "driverLicense",
  [MediaTypeEnum.DRIVER_INSURANCE]: "insurance",
  [MediaTypeEnum.DRIVER_TECH_CONTROL]: "technicalControl",
  [MediaTypeEnum.DRIVER_MACARON_VTC]: "macaronVtc",
  [MediaTypeEnum.DRIVER_TRAINING_CERT]: "trainingCertificate",
  [MediaTypeEnum.DRIVER_KBITS_REGISTER]: "kbitsRegister",
  [MediaTypeEnum.DRIVER_VTC_APPROVAL]: "vtcApproval",
} as const;

export const MEDIA_TYPES = [
  MediaTypeEnum.USER_PHOTO,
  MediaTypeEnum.ISSUE_DOC,
  MediaTypeEnum.DRIVER_VEHICLE,
  MediaTypeEnum.DRIVER_ID_CARD,
  MediaTypeEnum.DRIVER_LICENSE,
  MediaTypeEnum.DRIVER_INSURANCE,
  MediaTypeEnum.DRIVER_TECH_CONTROL,
  MediaTypeEnum.DRIVER_MACARON_VTC,
  MediaTypeEnum.DRIVER_TRAINING_CERT,
  MediaTypeEnum.DRIVER_KBITS_REGISTER,
  MediaTypeEnum.DRIVER_VTC_APPROVAL,
  MediaTypeEnum.DRIVER_VEHICLE_CERTIFICATE,
  MediaTypeEnum.RIDE_OBSERVATION,
] as const;

export type MediaRefEntity = DriverRequest | User | Issue;
//   | InvoiceDocument<InvoiceEntity>;

export interface Media<T extends MediaRefEntity> {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  originalName: string;
  type: MediaTypeEnum;
  mime: string;
  src: string;
  size: number;
  ref: string | T;
}
