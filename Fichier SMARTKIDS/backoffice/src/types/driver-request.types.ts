  import { Media } from "@/types/media.types";
  import { Vehicle } from "@/types/vehicle.types";
  import { DriverRequestReview } from "./driver-request-review.types";
  import { User } from "./user.types";

  export enum DriverRequestStatusEnum {
    DRAFT = "draft",
    SUBMITTED = "pending",
    VALIDATED = "validated",
    REJECTED = "rejected",
  }

  export const DRIVER_REQUEST_STATUSE_LABELS: Record<
    DriverRequestStatusEnum,
    string
  > = {
    draft: "Brouillon",
    pending: "Requête soumise et en attente de traitement.",
    rejected: "Requête rejettée",
    validated: "Requête validée",
  };

  export const DRIVER_REQUEST_STATUSES = [
    DriverRequestStatusEnum.SUBMITTED,
    DriverRequestStatusEnum.REJECTED,
    DriverRequestStatusEnum.VALIDATED,
    DriverRequestStatusEnum.DRAFT,
  ] as const;

  export interface DriverRequest {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    vehicle: Vehicle | null;
    userId: string;
    language: string;
    idCard: Media<DriverRequest>[];
    driverLicense: Media<DriverRequest>[];
    insurance: Media<DriverRequest>[];
    technicalControl: Media<DriverRequest>[];
    macaronVtc: Media<DriverRequest>[];
    trainingCertificate: Media<DriverRequest>[];
    kbitsRegister: Media<DriverRequest>[];
    vtcApproval: Media<DriverRequest>[];
    submittedAt: Date | null;
    lastReviewAt: Date | null;
    reviewed: boolean;
    lastReview: string | null;
    status: DriverRequestStatusEnum;

    reviews?: DriverRequestReview[];
    user?: User;
  }
