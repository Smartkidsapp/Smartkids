import { RideOffer } from "@/types/ride-offer";
import { User } from "@/types/user.types";
import { RideStatus } from "./ride-status";

export type Location = {
  lat: number;
  long: number;
  name: string;
};

export const RIDE_STATUS_LABEL: Record<RideStatusEnum, string> = {
  "in-progress": "En cours",
  started: "Chauffeur en route",
  "incoming-driver": "Chauffeur en route",
  created: "En attente",
  "offer-paid": "Payée",
  "driver-arrived": "Le Chauffeur est arrivé",
  "destination-reached": "Arrivée à destination",
  booked: "Réservé",
  cancelled: "Annulé",
  completed: "Terminé",
  refunded: "Remboursé",
} as const;

export enum RideStatusEnum {
  CREATED = "created",
  BOOKED = "booked",
  STARTED = "started",
  OFFER_PAID = "offer-paid",
  DRIVER_ARRIVED = "driver-arrived",
  INCOMING_DRIVER = "incoming-driver",
  IN_PROGRESS = "in-progress",
  DESTINATION_REACHED = "destination-reached",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export const RIDE_STATUSES = [
  RideStatusEnum.CANCELLED,
  RideStatusEnum.COMPLETED,
  RideStatusEnum.STARTED,
  RideStatusEnum.IN_PROGRESS,
  RideStatusEnum.DESTINATION_REACHED,
  RideStatusEnum.INCOMING_DRIVER,
  RideStatusEnum.CREATED,
  RideStatusEnum.BOOKED,
  RideStatusEnum.DRIVER_ARRIVED,
  RideStatusEnum.OFFER_PAID,
  RideStatusEnum.REFUNDED,
];

export interface Ride {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  status: RideStatusEnum;

  passengersCount: number;

  petsCount: number;

  lugagesCount: number;

  estimatedPrice: number;

  estimatedDuration: number;

  from: Location;

  to: Location;

  paymentIntentSecret: string;

  bookedFor: string | null;

  client: User;
  // client: string User;

  driver: string | null | User;

  offer: string | null | RideOffer;
  estimatedDistance: number;

  statuses?: RideStatus[];
}

export interface RideInvoiceData {
  paymentId: string;
  paidAt: string;
  driver: {
    phone: string;
    id: string;
    name: string;
    plateNumber: string;
    vehicleModel: string;
  };
  client: {
    id: string;
    name: string;
    phone: string;
  };
  price: string;
  taxAmount: string;
  totalPrice: string;
  appFees: string;
}
