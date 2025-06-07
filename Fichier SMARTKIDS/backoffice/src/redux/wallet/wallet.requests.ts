import {
  WalletTransaction,
  WalletTransationStatusTypeEnum,
} from "@/types/wallet-transaction.types";
import { Wallet } from "@/types/wallet.types";
import zod from "zod";

const ValidatedTSchema = zod.object({
  status: zod.literal(WalletTransationStatusTypeEnum.VALIDATED),
});

const CancelledTSchema = zod.object({
  status: zod.literal(WalletTransationStatusTypeEnum.CANCELLED),
  cancelReason: zod.string(),
});

export const ValidateWithdrawalSchema = zod.discriminatedUnion("status", [
  ValidatedTSchema,
  CancelledTSchema,
]);
export type ValidateWithdrawalDto = Zod.infer<typeof ValidateWithdrawalSchema>;

export type IWalletFilters = Partial<Pick<Wallet, "user">>;
export type IWithdrawalsFilters = Partial<
  Pick<WalletTransaction, "type" | "wallet">
>;
export type ITransactionFilters = Partial<
  Pick<WalletTransaction, "type" | "wallet">
>;

export type TransactionCountReponse = {
  pending: {
    "withdraw-request"?: { count: number; price: number };
    "ride-payment"?: { count: number; price: number };
  };
  validated: {
    "withdraw-request"?: { count: number; price: number };
    "ride-payment"?: { count: number; price: number };
  };
};
