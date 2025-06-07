import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import AppTable from "@/components/AppTable";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import UserPreview from "@/components/UserPreview";
import { useLazyPaginateSubscriptionsQuery } from "@/redux/subscriptions/subscription.apiSlice";
import { Subscription } from "@/types/subscription";
import { User } from "@/types/user.types";
import { formatPrice } from "@/lib/utils";
import { SubscriptionPlan } from "@/types/susbcription-plan.types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export default function UsersPage() {
  const [paginate, { data, isFetching }] = useLazyPaginateSubscriptionsQuery();
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnDefs = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        id: "name",
        header: "Utilisateur",
        cell: ({ row: { original: subscription } }) => (
          <div className="w-[300px]">
            <UserPreview user={subscription.user as User} />
          </div>
        ),
      },
      {
        id: "role",
        header: "Formule",
        cell: ({ row: { original: subscription } }) => {
          if (!subscription.price) {
            return;
          }

          return (
            <span>
              {formatPrice(subscription.price)} /{" "}
              {getIntervalLabel({
                interval_count: subscription.interval_count,
                interval_unit: subscription.interval_unit,
              })}
            </span>
          );
        },
      },
      {
        id: "role",
        header: "Créé le",
        cell: ({ row: { original: subscription } }) =>
          subscription.createdAt
            ? new Date(subscription.createdAt).toLocaleString()
            : "--",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row: { original: subscription } }) => {
          return (
            <div className="flex gap-2 items-center">
              <Button size="icon" variant="outline">
                <Link
                  target="_blank"
                  to={`https://dashboard.stripe.com/test/subscriptions/${subscription.externalSubscriptionRef}`}
                >
                  <Eye className="h-5 w-5" />
                </Link>
              </Button>
            </div>
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
      },
      false
    );
  }, [paginationState, paginate]);

  return (
    <>
      <AppBreadCrumb
        paths={[
          { path: "/", label: "Tableau de bord" },
          { current: true, label: "Abonnements" },
        ]}
      />
      <div className="grid flex-1 items-start gap-4 sm:gap-6 p-4 sm:px-6 sm:py-0 ">
        <AppTable
          isLoading={isFetching}
          columns={columnDefs}
          data={data?.data?.items ?? []}
          onPaginationChange={setPaginationState}
          paginationState={paginationState}
          rowCount={data?.data.total ?? 10}
          title="Liste des abonnements."
        />
      </div>
    </>
  );
}

export function getIntervalLabel({
  interval_count,
  interval_unit,
}: Pick<SubscriptionPlan, "interval_count" | "interval_unit">) {
  switch (interval_unit) {
    case "month":
      if (interval_count === 1) {
        return "mois";
      }

      return `${interval_count} mois`;

    case "year":
      if (interval_count === 1) {
        return "année";
      }

      return `${interval_count} ans`;

    case "day":
      if (interval_count === 1) {
        return "jour";
      }

      return `${interval_count} jours`;

    case "week":
      if (interval_count === 1) {
        return "semaine";
      }

      return `${interval_count} semaines`;
  }
}
