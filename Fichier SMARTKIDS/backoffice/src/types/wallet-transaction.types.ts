import { Wallet } from "./wallet.types";
import { WithdrawalMethod } from "./withdrawal-method.types";

export enum WalletTransationTypeEnum {
  WITHDRAWAL_REQUEST = "withdraw-request",
  WITHDRAWAL = "withdraw",
  RIDE_PAYMENT = "ride-payment",
}


export enum WalletTransationStatusTypeEnum {
  PENDING = "pending",
  VALIDATED = "validated",
  CANCELLED = "cancelled",
}

export const WALLER_TRANSACTIONS_STATUS_TYPES = [
  WalletTransationStatusTypeEnum.PENDING,
  WalletTransationStatusTypeEnum.VALIDATED,
  WalletTransationStatusTypeEnum.CANCELLED,
];

export const TRANSACTION_TYPE_LABELS: Record<WalletTransationTypeEnum, string> =
  {
    [WalletTransationTypeEnum.WITHDRAWAL]: "Retrait de gains",
    [WalletTransationTypeEnum.RIDE_PAYMENT]: "Encaissement course",
    [WalletTransationTypeEnum.WITHDRAWAL_REQUEST]: "Demande de retrait",
  } as const;

export const TRANSACTION_STATUS_LABELS: Record<
  WalletTransationStatusTypeEnum,
  string
> = {
  [WalletTransationStatusTypeEnum.CANCELLED]: "Annulée",
  [WalletTransationStatusTypeEnum.PENDING]: "En attente",
  [WalletTransationStatusTypeEnum.VALIDATED]: "Confirmée",
} as const;

export const WALLER_TRANSACTIONS_TYPES = [
  WalletTransationTypeEnum.RIDE_PAYMENT,
  WalletTransationTypeEnum.WITHDRAWAL,
  WalletTransationTypeEnum.WITHDRAWAL_REQUEST,
];



export interface WalletTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;

  amount: number;

  type: WalletTransationTypeEnum;

  status: WalletTransationStatusTypeEnum;
  cancelReason?: string;

  withdrawMethod: string | WithdrawalMethod;

  wallet: string | Wallet;
}
