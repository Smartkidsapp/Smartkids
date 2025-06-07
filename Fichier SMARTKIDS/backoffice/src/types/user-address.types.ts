import { User } from "@/types/user.types";

export enum AddressTypeEnum {
  PRO = "pro",
  HOME = "home",
}

export const ADDRESS_TYPES = [
  AddressTypeEnum.HOME,
  AddressTypeEnum.PRO,
] as const;

export const ADDRESS_TYPES_LABELS: Record<AddressTypeEnum, string> = {
  home: "Adresse personnelle",
  pro: "Adresse du domicile",
};

export interface UserAddress {
  id: string;
  createdAt: string;
  updatedAt: string;

  value: string;

  type: AddressTypeEnum;

  user: string | User;
}
