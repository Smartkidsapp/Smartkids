import { Ride, RideStatusEnum } from "./ride";

export interface RideStatus {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;

  status: RideStatusEnum;

  rideId: string | Ride;

  ride?: Ride;
}
