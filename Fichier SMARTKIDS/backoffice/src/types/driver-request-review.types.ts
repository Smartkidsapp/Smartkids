import {
  DriverRequest,
  DriverRequestStatusEnum,
} from "@/types/driver-request.types";

export const DRIVER_REQUEST_REJECT_REASON = [
  "vehicle.photos",
  'vehicle.vehicleCertificate',
  "idCard",
  "driverLicense",
  "insurance",
  "technicalControl",
  "macaronVtc",
  "trainingCertificate",
  "kbitsRegister",
  "vtcApproval",
] as const;

export type DriverRequestRejectReason =
  (typeof DRIVER_REQUEST_REJECT_REASON)[number];


export const DRIVER_REQUEST_REJECT_REASON_LABELS: Record<
  DriverRequestRejectReason,
  string
> = {
  'vehicle.photos': 'Photos du véhicule',
  'vehicle.vehicleCertificate': 'Carte grise',
  macaronVtc: 'Casier judiciaire',
  driverLicense: 'Permis de conduire',
  idCard: "Pièce d'identité",
  insurance: "Document d'assurance",
  kbitsRegister: 'Registre k-bits',
  vtcApproval: 'Certificat de régularité fiscale',
  technicalControl: 'Contrôle technique',
  trainingCertificate: 'Certificat de formation',
};

export interface DriverRequestReview {
  id: string;
  createdAt: string;
  updatedAt: string;
  request: string | DriverRequest;
  comment: string | null;
  status: DriverRequestStatusEnum;
}
