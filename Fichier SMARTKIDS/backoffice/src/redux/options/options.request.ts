import { Category, Etablissement, Option } from "@/types/etablissement";
import zod, { z } from "zod";

export type IOptionFilters = Partial<Pick<Option, 'titre'>> & {
  query?: string;
};

export const OptionSchema = z.object({
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

export interface OptionDto {
  id: string;
  titre: string;
  titre_en: string;
  description: string;
  categories: string[];
}