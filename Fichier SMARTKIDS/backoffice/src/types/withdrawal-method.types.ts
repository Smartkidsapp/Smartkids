import { User } from '@/types/user.types';

export enum WithdrawalMethodTypeEnum {
  BANK = 'bank-account',
  PAYPAL = 'paypal',
}

export const WITHDRAWAL_METHOD_TYPES = [
  WithdrawalMethodTypeEnum.BANK,
  WithdrawalMethodTypeEnum.PAYPAL,
];

export interface WithdrawalMethod {
  id: string;
  createdAt: string;
  updatedAt: string;

  type: WithdrawalMethodTypeEnum;
  value: string; // rib or email address
  user: string | User;
  nameOnCard?: string | null;
}
