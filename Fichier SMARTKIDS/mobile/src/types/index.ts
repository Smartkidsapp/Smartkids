import { User } from "./user.types";

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
  min_age?: number;
  max_age?: number;
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
  price: string;
}

export interface Category {
  id: string;
  titre: string;
  titre_en: string;
  description: string;
  icon?: Media;
}

export interface Option {
  id: string;
  titre: string;
  titre_en: string;
  description: string;
  categories: Category[];
  icon?: Media;
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

export interface GoogleMapsAdresse {
  name: string;
  formatted_address: string;
  lat: number;
  lng: number;
}

export interface Boostage {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  date_debut: Date;
  date_fin: Date;
  userId: string;
  etablissement: Etablissement;
  paidAt: Date | null;
  paymentIntentId: string;
}


export interface Payment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  number: string;
  price: number;
  status: string;
  ref: any;
  user: User
  paymentIntentId: string;
  paypalOrderId: string;
}

export enum PaymentTypeEnum {
  RIDE = 'ride',
  SUBSCRIPTION = 'subscription',
}

export interface Rating {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  mark: number;
  comment: string | null;
  etablissement: Etablissement;
  author: User;
}

export interface Favorite {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  etablissement: Etablissement;
  user: User;
}