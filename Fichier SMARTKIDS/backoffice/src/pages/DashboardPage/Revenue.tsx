import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNUmber, formatPrice } from "@/lib/utils";
import { useGetPaymentsStatsQuery } from "@/redux/payments/payment.apiSlice";
import { DollarSign } from "lucide-react";

export default function Revenue() {
  const { data, isFetching } = useGetPaymentsStatsQuery();

  if (isFetching || !data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[50px]" />
        </CardContent>
      </Card>
    );
  }

  const { rides, subscriptions } = data.data;
  console.log({ rides, subscriptions });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatPrice(rides.price + subscriptions.price)}
        </div>

        <div className="text-md">
          {formatPrice(rides.price)} <small className="font-light">{formatNUmber(rides.count)} courses</small>
        </div>
        <div className="text-md">
          {formatPrice(subscriptions.price)} <small className="font-light">{formatNUmber(subscriptions.count)} Abonnements</small>
        </div>
      </CardContent>
    </Card>
  );
}
