import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import { useGetWalletBalanceQuery } from "@/redux/wallet/walletApiSlice";
import React from "react";

export default function UserBalance({ userId }: { userId: string }) {
  const { data, isFetching } = useGetWalletBalanceQuery(userId);

  const isLoading = !data || isFetching;

  console.log({ data });
  return (
    <div className="grid gap-4 grid-cols-2">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardDescription>Solde disponible</CardDescription>
          <CardTitle>
            {isLoading ? (
              <Skeleton className="h-2 w-[100px]" />
            ) : (
              formatPrice(data?.data.available)
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardDescription>Solde en cours</CardDescription>
          <CardTitle>
            {isLoading ? (
              <Skeleton className="h-2 w-[100px]" />
            ) : (
              formatPrice(data?.data.pending)
            )}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
