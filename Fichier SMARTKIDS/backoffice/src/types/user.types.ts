import { Vehicle } from "@/types/vehicle.types";

export enum UserRoleEnum {
  DRIVER = "driver",
  ADMIN = "admin",
  CLIENT = "client",
}

export const USER_ROLES = [UserRoleEnum.CLIENT, UserRoleEnum.DRIVER] as const;

export const USER_ROLES_LABELS: Record<UserRoleEnum, string> = {
  client: "Client",
  driver: "Chauffeur",
  admin: "Administrateur",
};

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  role: UserRoleEnum;
  isDriver: boolean;
  activeRole: UserRoleEnum; // Allows the user to swicth his role.
  password: string;
  deletedAt: string | null;
  emailVerified: boolean;
  avatar?: string;
  rating?: {
    avg: number;
    total: number;
  };
  vehicle: Vehicle | null;
  languages: string[];
}

export enum OTPType {
  RESET_PASSWORD = "psd",
  EMAIL_VERIFICATION = "evf",
}

export const OTP_TYPES = [OTPType.EMAIL_VERIFICATION, OTPType.RESET_PASSWORD];
