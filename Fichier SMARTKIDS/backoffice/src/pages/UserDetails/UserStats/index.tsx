import { useGetUserRideStatsQuery } from "@/redux/rides/ride.apiSlice";
import Loader from "./Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNUmber, formatPrice } from "@/lib/utils";
import { useMemo } from "react";
import { RIDE_STATUS_LABEL, RideStatusEnum } from "@/types/ride";
import { StackedBarChartCard } from "@/pages/DashboardPage/RideStats/StackedBarChartCard";
import {
  RIDE_OFFER_STATUS_LABELS,
  RideOfferStatusEnum,
} from "@/types/ride-offer";

export default function UserStats({ userId }: { userId: string }) {
  const { data, isFetching } = useGetUserRideStatsQuery(userId);

  const { offers, rides } = data?.data ?? {};

  const ridesData = useMemo(() => {
    const _data: {
      status: string;
      nombre: number;
      prix: number;
    }[] = [];

    if (!rides) {
      return _data;
    }

    for (const status in rides.statuses) {
      _data.push({
        status: RIDE_STATUS_LABEL[status as RideStatusEnum],
        nombre: rides.statuses[status].count,
        prix: rides.statuses[status].count,
      });
    }

    return _data;
  }, [rides]);

  const offersData = useMemo(() => {
    const _data: {
      status: string;
      nombre: number;
      prix: number;
    }[] = [];

    if (!offers) {
      return _data;
    }

    for (const status in offers.statuses) {
      _data.push({
        status: RIDE_OFFER_STATUS_LABELS[status as RideOfferStatusEnum],
        nombre: offers.statuses[status].count,
        prix: offers.statuses[status].price,
      });
    }

    return _data;
  }, [offers]);

  if (!rides || !offers || isFetching) {
    return <Loader />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4">
      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Prix total des courses</CardDescription>
          <CardTitle className="text-4xl">
            {formatPrice(rides.total.price)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les courses créées par l'utilisateur.
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Nombre total des courses</CardDescription>
          <CardTitle className="text-4xl">
            {formatNUmber(rides.total.count)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les courses créées par l'utilisateur.
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Prix total des offres</CardDescription>
          <CardTitle className="text-4xl">
            {formatPrice(offers.total.price)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les offres emises par l'utilisateur.
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 2xl:col-span-1">
        <CardHeader className="pb-2">
          <CardDescription>Nombre total des offres</CardDescription>
          <CardTitle className="text-4xl">
            {formatNUmber(offers.total.count)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            Inclus toutes les offres emises par l'utilisateur.
          </div>
        </CardContent>
      </Card>

      <StackedBarChartCard
        title="Courses"
        firstKey="nombre"
        verticalKey="status"
        className="sm:col-span-4 2xl:col-span-2"
        secondKey="prix"
        data={ridesData}
      />

      <StackedBarChartCard
        verticalKey={"status"}
        className="sm:col-span-4 2xl:col-span-2"
        title="Offres"
        firstKey="nombre"
        secondKey="prix"
        data={offersData}
      />
    </div>
  );
}
