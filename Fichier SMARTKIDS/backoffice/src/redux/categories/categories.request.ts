import { Category, Etablissement } from "@/types/etablissement";
import { RIDE_STATUSES, Ride } from "@/types/ride";
import { PAYMENT_METHOD_TYPES } from "@/types/subscription";
import zod, { z } from "zod";

export type ICategoryFilters = Partial<Pick<Category, 'titre'>> & {
  query?: string;
};

export const CategorySchema = z.object({
  titre: z.string({
    invalid_type_error: "Ce champ est requis",
    required_error: "Ce champ est requis",
  }),
  titre_en: z.string({
    invalid_type_error: "Ce champ est requis",
    required_error: "Ce champ est requis",
  }),
  description: z.string({
    invalid_type_error: "Ce champ est requis",
    required_error: "Ce champ est requis",
  }),
});

export interface CategoryDto {
  id: string;
  titre: string;
  titre_en: string;
  description: string;
  icon?: any
}