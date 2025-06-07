import { RIDE_STATUSES, Ride } from "@/types/ride";
import { PAYMENT_METHOD_TYPES } from "@/types/subscription";
import zod from "zod";

const createRideSchma = zod.object({
  from_lat: zod.number(),
  from_long: zod.number(),
  from_name: zod.string(),
  to_lat: zod.number(),
  to_long: zod.number(),
  to_name: zod.string(),
  passengersCount: zod.number(),
  lugagesCount: zod.number(),
  petsCount: zod.number(),
  date: zod.string().datetime().optional(),
  estimatedDuration: zod.number(),
  estimatedDistance: zod.number(),
});
export type CreateRideDto = Zod.infer<typeof createRideSchma>;

const getEstimatedPriceSchema = zod.object({
  from_lat: zod.number(),
  from_long: zod.number(),
  to_lat: zod.number(),
  to_long: zod.number(),
  passengersCount: zod.number(),
  lugagesCount: zod.number(),
  petsCount: zod.number(),
  estimatedDuration: zod.number(),
  estimatedDistance: zod.number(),
  date: zod.string().optional(),
});
export type GetEstimatedPriceDto = Zod.infer<typeof getEstimatedPriceSchema>;

const makeRideOfferSchema = zod.object({
  price: zod.number(),
  lat: zod.number(),
  long: zod.number(),
});
export type MakeRideOfferDto = Zod.infer<typeof makeRideOfferSchema>;

const updateRideStatusSchema = zod.object({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  status: zod.enum(RIDE_STATUSES),
});
export type UpdateRideStatusDto = Zod.infer<typeof updateRideStatusSchema>;

const payRideSchema = zod.object({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  paymentMethodType: zod.enum(PAYMENT_METHOD_TYPES),
  paymentMethod: zod.string(),
});
export type PayRideDto = Zod.infer<typeof payRideSchema>;

const rateUserSchema = zod.object({
  comment: zod.string(),
  mark: zod.number(),
  subjectId: zod.string(),
});
export type RateUserDto = Zod.infer<typeof rateUserSchema>;

const cancelRideSchema = zod.object({
  reason: zod.string(),
});
export type CancelRideDto = Zod.infer<typeof cancelRideSchema>;

export type IRideFilters = Partial<Pick<Ride, "status">> & {
  query?: string;
  client?: string;
  driver?: string;
};

export type ICountStats = {
  count: number;
  price: number;
};

export interface RideStatsReponse {
  rides: {
    total: ICountStats;
    statuses: { [key: string]: ICountStats };
  };
  offers: {
    total: ICountStats;
    statuses: { [key: string]: ICountStats };
  };
}

export const updatePricesConfigSchema = zod.object({
  basePrice: zod.number(),
  pricePerKmNight: zod.number(),
  pricePerKmDay: zod.number(),
  pricePerMinutesNight: zod.number(),
  pricePerMinutesDay: zod.number(),
  luggagePriceNight: zod.number(),
  luggagePriceDay: zod.number(),
  animalPriceNight: zod.number(),
  animalPriceDay: zod.number(),
  personPriceNight: zod.number(),
  personPriceDay: zod.number(),
});
export type UpdatePricesConfigDto = Zod.infer<typeof updatePricesConfigSchema>;

export interface PriceConfig {
  base_price: number;
  price_per_km: {
    night: number;
    day: number;
  };
  price_per_minute: {
    night: number;
    day: number;
  };
  supplements: {
    night: {
      luggage: number;
      animal: number;
      person: number;
    };
    day: {
      luggage: number;
      animal: number;
      person: number;
    };
  };
}
