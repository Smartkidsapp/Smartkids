import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import AppTable from "@/components/AppTable";
import { useLazyPaginateUserOffersQuery } from "@/redux/rides/ride.apiSlice";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { RIDE_OFFER_STATUS_LABELS, RideOffer } from "@/types/ride-offer";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UserOffers({ userId }: { userId: string }) {
  const [paginate, { data, isFetching }] = useLazyPaginateUserOffersQuery();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnDefs = useMemo<ColumnDef<RideOffer>[]>(
    () => [
      {
        id: "Prix",
        header: "Prix",
        cell: ({ row: { original: rideoffer } }) => (
          <div className="text-lg font-bold">
            {formatPrice(rideoffer.price)}
          </div>
        ),
      },
      {
        id: "createdAt",
        header: "Date",
        cell: ({ row: { original: rideoffer } }) => (
          <div>{new Date(rideoffer.createdAt).toLocaleString()}</div>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row: { original: rideoffer } }) => (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {RIDE_OFFER_STATUS_LABELS[rideoffer.status]}
            </Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row: { original: offer } }) => {
          return (
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon" variant="outline">
                  <Link to={`/courses/${offer.ride}`}>
                    <Eye className="h-5 w-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">Voir la course.</TooltipContent>
            </Tooltip>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    paginate(
      {
        page: paginationState.pageIndex + 1,
        limit: paginationState.pageSize,
        userId,
      },
      false
    );
  }, [paginationState, paginate, userId]);

  return (
    <>
      <AppTable
        isLoading={isFetching}
        columns={columnDefs}
        data={data?.data?.items ?? []}
        onPaginationChange={setPaginationState}
        paginationState={paginationState}
        rowCount={data?.data.total ?? 10}
        title="Liste Offres"
      />
    </>
  );
}
