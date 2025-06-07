export enum UserRoleEnum {
  VENDEUR = 'vendeur',
  CLIENT = 'client',
}

export const USER_ROLES = [UserRoleEnum.CLIENT, UserRoleEnum.VENDEUR] as const;

export const USER_ROLES_LABELS: Record<UserRoleEnum, string> = {
  client: 'Client',
  vendeur: 'Vendeur',
};

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  role: UserRoleEnum;
  isSeller: boolean;
  activeRole: UserRoleEnum; // Allows the user to swicth his role.
  password: string;
  deletedAt: string | null;
  emailVerified: boolean;
  avatar?: string;
}

export enum OTPType {
  RESET_PASSWORD = 'psd',
  EMAIL_VERIFICATION = 'evf',
}

export const OTP_TYPES = [OTPType.EMAIL_VERIFICATION, OTPType.RESET_PASSWORD];
