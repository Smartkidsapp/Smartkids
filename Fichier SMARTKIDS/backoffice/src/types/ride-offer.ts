import { Ride } from "@/types/ride";
import { User } from "@/types/user.types";
import { Vehicle } from "@/types/vehicle.types";

export enum RideOfferStatusEnum {
  PENDING = "pending",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
}

export const RIDE_OFFER_STATUSES = [
  RideOfferStatusEnum.PENDING,
  RideOfferStatusEnum.REJECTED,
  RideOfferStatusEnum.ACCEPTED,
];

export const RIDE_OFFER_STATUS_LABELS = {
  pending: "En attente",
  rejected: "Rejetée",
  accepted: "Acceptée",
};

export interface RideOffer {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  price: number;

  driver: User & {
    vehicle: Vehicle;
  };

  ride: Ride;

  lat: number;
  long: number;
  status: RideOfferStatusEnum;
}
