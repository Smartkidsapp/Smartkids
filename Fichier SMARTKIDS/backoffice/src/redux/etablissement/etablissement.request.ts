import { Etablissement } from "@/types/etablissement";
import { RIDE_STATUSES, Ride } from "@/types/ride";
import { PAYMENT_METHOD_TYPES } from "@/types/subscription";
import zod from "zod";

export type IEtablissementFilters = Partial<Pick<Etablissement, 'nom'>> & {
  query?: string;
};
