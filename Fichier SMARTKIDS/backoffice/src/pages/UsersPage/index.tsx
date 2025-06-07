import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import UserFilters from "./UserFilters";
import AppTable from "@/components/AppTable";
import { useLazyPaginateUsersQuery } from "@/redux/users/user.apiSlice";
import { USER_ROLES_LABELS, User } from "@/types/user.types";
import { IUserFilters } from "@/redux/users/users.request";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import DeleteUserBtn from "./DeleteUserBtn";
import { Link } from "react-router-dom";
import UserPreview from "@/components/UserPreview";
import { formatDistance, format } from "date-fns";
import { fr } from "date-fns/locale";

export default function UsersPage() {
  const [paginate, { data, isFetching }] = useLazyPaginateUsersQuery();
  const [filters, setFilters] = useState<IUserFilters>({});
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnDefs = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "name",
        header: "Identifiants",
        cell: ({ row: { original: user } }) => (
          <div className="w-[300px]">
            <UserPreview user={user} />
          </div>
        ),
      },
      {
        id: "role",
        header: "Rôle",
        cell: ({ row: { original: user } }) => (
          <Badge variant="outline">{USER_ROLES_LABELS[user.role]}</Badge>
        ),
      },
      {
        id: "phone",
        header: "Téléphone",
        cell: ({ row: { original: user } }) => user.phone,
      },
      {
        id: "isDriver",
        header: "Membre depuis",
        cell: ({ row: { original: user } }) => (
          <Tooltip>
            <TooltipTrigger>
              <span>
                {formatDistance(new Date(user.createdAt), new Date(), {
                  locale: fr,
                  addSuffix: true,
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent align="end">
              <Card className="p-3">
                {format(new Date(user.createdAt), "dd LLLL yyyy à HH:mm", {
                  locale: fr,
                })}
              </Card>
            </TooltipContent>
          </Tooltip>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row: { original: user } }) => {
          return (
            <div className="flex gap-2 items-center">
              <Button size="icon" variant="outline">
                <Link to={`/utilisateurs/${user.id}?name=${user.name}`}>
                  <Eye className="h-5 w-5" />
                </Link>
              </Button>

              <DeleteUserBtn userId={user.id} />
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
        filter: filters,
      },
      false
    );
  }, [paginationState, paginate, filters]);

  return (
    <>
      <AppBreadCrumb
        paths={[
          { path: "/", label: "Tableau de bord" },
          { current: true, label: "Utilisateurs" },
        ]}
      />
      <div className="grid flex-1 items-start gap-4 sm:gap-6 p-4 sm:px-6 sm:py-0 ">
        <UserFilters filters={filters} setFilters={setFilters} />
        <AppTable
          isLoading={isFetching}
          columns={columnDefs}
          data={data?.data?.items ?? []}
          onPaginationChange={setPaginationState}
          paginationState={paginationState}
          rowCount={data?.data.total ?? 10}
          title="Liste des utilisateurs"
        />
      </div>
    </>
  );
}
