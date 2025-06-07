import { z } from 'zod';
import { ApiResponse } from '../../store/apiSlice';
import { Category, DailyOpeningHours, Etablissement, Option, Services } from '../../types';

export interface EtablissementResponse extends ApiResponse<Etablissement> { }

export const CreateEtablissementStep2Schema = z.object({
    phone: z.string({message: 'Le numéro de téléphone est requis'}),
    nom: z.string({message: "Le nom de l'établissement est requis"}),
    description: z.string({message: 'Le description est requise'}),
    code_promo: z.string().optional(),
});

const rateUserSchema = z.object({
  comment: z.string(),
  mark: z.number(),
  etablissementId: z.string(),
});

export type RateUserDto = Zod.infer<typeof rateUserSchema>;

export interface CreateEtablissementDto {
    nom: string;
    description: string;
    code_promo: string;
    phone: string;
    adresse: string;
    longitude: number;
    latitude: number;
    images: any[];
    category: string;
    options: string[];
    dailyOpeningHours: DailyOpeningHours[];
    services: Services[] | [];
    min_age: number;
    max_age: number;
}

export interface CreateEtablissementStep2Dto {
    nom: string;
    description: string;
    code_promo: string;
    phone: string;
}

export interface SearchEtablissementDto {
    nom?: string;
    longitude?: number | null;
    latitude?: number | null;
    category?: string;
    page?: number;
    limit?: number; 
    distance?: number;
    max_age?: number;
    min_age?: number;
    options?: string[];
}