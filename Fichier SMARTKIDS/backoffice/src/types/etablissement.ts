export interface Etablissement {
    id: string;
    createdAt: string;
    updatedAt: string;
    nom: string;
    description: string;
    code_promo: string;
    phone: string;
    adresse: string;
    longitude: number;
    latitude: number;
    userId: string;
    images: Media[];
    category: Category;
    options: Option[];
    dailyOpeningHours: DailyOpeningHours[];
    services?: Services[]; 
    distance?: number;
}

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | number;

export interface DailyOpeningHours {
    day: DayIndex;
    available: boolean;
    from: string;
    to: string;
}

export interface Services {
  title: string;
  price: number;
}

export interface Category {
    id: string;
    titre: string;
    titre_en?: string;
    description: string;
    icon?: Media;
    createdAt: string;
    updatedAt: string;
}

export interface Option {
    id: string;
    titre: string;
    titre_en?: string;
    description: string;
    categories: string[];
    icon?: Media;
    createdAt: string;
    updatedAt: string;
}

export interface Media {
    id: string;
    originalName: string;
    type: MediaTypeEnum;
    mime: string;
    src: string;
    size: number;
    ref: string;
}

export enum MediaTypeEnum {
  USER_PHOTO = 'user-photo',
  ETBS_IMAGE = 'etbs-image',
}
