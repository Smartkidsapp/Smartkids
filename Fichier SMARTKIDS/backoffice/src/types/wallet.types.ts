import { User } from "./user.types";

export interface Wallet {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  available: number;
  pending: number;
  user: string | User;
}
