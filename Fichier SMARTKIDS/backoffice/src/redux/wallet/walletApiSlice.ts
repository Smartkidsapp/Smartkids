import { Wallet } from "@/types/wallet.types";
import {
  ApiResponse,
  PaginatedApiResponse,
  PaginatedQueryOptions,
  apiSlice,
} from "../apiSlice";
import {
  ITransactionFilters,
  IWalletFilters,
  IWithdrawalsFilters,
  TransactionCountReponse,
  ValidateWithdrawalDto,
} from "./wallet.requests";
import QueryString from "qs";
import { WithdrawalMethod } from "@/types/withdrawal-method.types";
import { WalletTransaction } from "@/types/wallet-transaction.types";

const walletApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      getWalletBalance: build.query<
        ApiResponse<{
          available: number;
          pending: number;
        }>,
        string
      >({
        query(id) {
          return {
            url: `/api/v1/admin/users/${id}/balance`,
            method: "GET",
          };
        },
      }),

      getWithdrawalMethods: build.query<
        ApiResponse<{
          bankMethod: WithdrawalMethod | null;
          paypalMethod: WithdrawalMethod | null;
        }>,
        string
      >({
        query(id) {
          return {
            url: `/admin/users/${id}/withdrawal-methods`,
            method: "GET",
          };
        },
        providesTags: ["withdrawal-methods"],
      }),

      paginateWallets: build.query<
        PaginatedApiResponse<Wallet>,
        PaginatedQueryOptions<IWalletFilters>
      >({
        query(params) {
          const queryString = QueryString.stringify(params);
          return {
            url: "/api/v1/admin/wallets" + `?${queryString}`,
            method: "GET",
          };
        },
        providesTags: ["wallets"],
      }),

      paginateWithdrawals: build.query<
        PaginatedApiResponse<WalletTransaction>,
        PaginatedQueryOptions<IWithdrawalsFilters>
      >({
        query(params) {
          const queryString = QueryString.stringify(params);
          return {
            url: "/api/v1/admin/withdrawals" + `?${queryString}`,
            method: "GET",
          };
        },
        providesTags: ["wallets", "transactions"],
      }),

      paginateTransactions: build.query<
        PaginatedApiResponse<WalletTransaction>,
        PaginatedQueryOptions<ITransactionFilters>
      >({
        query(params) {
          const queryString = QueryString.stringify(params);
          return {
            url: "/api/v1/admin/transactions" + `?${queryString}`,
            method: "GET",
          };
        },
        providesTags: ["wallets", "transactions"],
      }),

      getTransactionCounts: build.query<
        PaginatedApiResponse<TransactionCountReponse>,
        void
      >({
        query() {
          return {
            url: "/api/v1/admin/transaction-counts",
            method: "GET",
          };
        },
        providesTags: ["wallets", "transactions"],
      }),

      validateWithdrawal: build.mutation<
        ApiResponse<WithdrawalMethod>,
        ValidateWithdrawalDto & {
          walletId: string;
          transactionId: string;
        }
      >({
        query({ transactionId, walletId, ...body }) {
          return {
            url: `/api/v1/admin/wallets/${walletId}/transactions/${transactionId}`,
            method: "PUT",
            body,
          };
        },
        invalidatesTags: ["wallets", "transactions"],
      }),
    };
  },
  overrideExisting: true,
});

export const {
  useLazyGetWalletBalanceQuery,
  useGetWalletBalanceQuery,
  useGetWithdrawalMethodsQuery,
  useLazyGetWithdrawalMethodsQuery,
  useLazyPaginateWalletsQuery,
  usePaginateWalletsQuery,
  useValidateWithdrawalMutation,
  useGetTransactionCountsQuery,
  useLazyGetTransactionCountsQuery,
  usePaginateTransactionsQuery,
  useLazyPaginateTransactionsQuery,
  useLazyPaginateWithdrawalsQuery,
  usePaginateWithdrawalsQuery,
} = walletApiSlice;

export default walletApiSlice;
