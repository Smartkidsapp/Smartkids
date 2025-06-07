import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import AppTable from "@/components/AppTable";
import { useLazyGetSubscriptionPlanQuery } from "@/redux/subscriptionPlan/subscriptionPlan.apiSlice";
import { SubscriptionPlan } from "@/types/susbcription-plan.types";
import { formatPrice } from "@/lib/utils";
import SubscriptionFormDialog from "./SubscriptionFormDialog";
import DeletePlanBtn from "./DeletePlanBtn";

export function getIntervalUnitLabel(interval: string) {
  switch (interval) {
    case "day":
      return "jour(s)";
    case "week":
      return "Semaine(s)";
    case "month":
      return "Mois";
    case "year":
      return "Année(s)";
    default:
      return "";
  }
}

export default function SubscriptionPlanPage() {
  const [paginate, { data, isFetching }] = useLazyGetSubscriptionPlanQuery();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnDefs = useMemo<ColumnDef<SubscriptionPlan>[]>(
    () => [
      {
        id: "price",
        header: "",
        cell: ({ row: { original } }) => (
          <div className="flex flex-col">
            <span>{original.name}</span>
            <span className="font-semibold">
              {formatPrice(original.price)} /{" "}
              {getIntervalUnitLabel(original.interval_unit)}
            </span>
          </div>
        ),
      },
      {
        id: "description",
        header: "Description",
        cell: ({ row: { original } }) => (
          <div className="max-w-[200px]">{original.description}</div>
        ),
      },
      {
        id: "trial",
        header: "Période d'essaie",
        cell: ({ row: { original } }) => (
          <span>
            {original.trial_interval_count}{" "}
            {getIntervalUnitLabel(original.trial_interval_unit)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row: { original } }) => {
          return (
            <div className="flex gap-2 items-center">
              <SubscriptionFormDialog subscriptionPlan={original} />
              <DeletePlanBtn planId={original.id} />
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    paginate();
  }, [paginationState, paginate]);

  return (
    <>
      <div className="flex justify-end mb-2">
        <SubscriptionFormDialog />
      </div>
      <div className="grid flex-1 items-start gap-4 sm:gap-6">
        <AppTable
          isLoading={isFetching}
          columns={columnDefs}
          data={data?.data ?? []}
          onPaginationChange={setPaginationState}
          paginationState={paginationState}
          rowCount={data?.data.length ?? 0}
          title="Liste des plans d'abonnement"
        />
      </div>
    </>
  );
}
