import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import AppTable from "@/components/AppTable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import DeleteUserBtn from "./DeleteEtbsBtn";
import { Link } from "react-router-dom";
import { formatDistance, format } from "date-fns";
import { fr } from "date-fns/locale";
import { IEtablissementFilters } from "@/redux/etablissement/etablissement.request";
import { useLazyPaginateEtablissementsQuery } from "@/redux/etablissement/etblissement.apiSlice";
import { Etablissement } from "@/types/etablissement";
import EtablissementPreview from "@/components/EtablissementPreview";
import EtbsFilters from "./EtbsFilters";

export default function EtablissementsPage() {
  const [paginate, { data, isFetching }] = useLazyPaginateEtablissementsQuery();
  const [filters, setFilters] = useState<IEtablissementFilters>({});
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columnDefs = useMemo<ColumnDef<Etablissement>[]>(
    () => [
      {
        id: "nom",
        header: "Nom",
        cell: ({ row: { original: etablissement } }) => (
          <div className="w-[300px]">
            <EtablissementPreview etablissement={etablissement} />
          </div>
        ),
      },
      {
        id: "category",
        header: "Catégorie",
        cell: ({ row: { original: etablissement } }) => etablissement.category.titre,
      },
      {
        id: "adresse",
        header: "Adresse",
        cell: ({ row: { original: etablissement } }) => etablissement.adresse,
      },
      {
        id: "phone",
        header: "Téléphone",
        cell: ({ row: { original: etablissement } }) => etablissement.phone,
      },
      {
        id: "createdAt",
        header: "Créer",
        cell: ({ row: { original: etablissement } }) => (
          <Tooltip>
            <TooltipTrigger>
              <span>
                {formatDistance(new Date(etablissement.createdAt), new Date(), {
                  locale: fr,
                  addSuffix: true,
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent align="end">
              <Card className="p-3">
                {format(new Date(etablissement.createdAt), "dd LLLL yyyy à HH:mm", {
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
        cell: ({ row: { original: etablissement } }) => {
          return (
            <div className="flex gap-2 items-center">
              <Button size="icon" variant="outline">
                <Link to={`/etablissements/${etablissement.id}?name=${etablissement.nom}`}>
                  <Eye className="h-5 w-5" />
                </Link>
              </Button>

              <DeleteUserBtn id={etablissement.id} />
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
          { current: true, label: "Etablissements" },
        ]}
      />
      <div className="grid flex-1 items-start gap-4 sm:gap-6 p-4 sm:px-6 sm:py-0 ">
        <EtbsFilters filters={filters} setFilters={setFilters} />
        <AppTable
          isLoading={isFetching}
          columns={columnDefs}
          data={data?.data?.items ?? []}
          onPaginationChange={setPaginationState}
          paginationState={paginationState}
          rowCount={data?.data.total ?? 10}
          title="Liste des Etablissements"
        />
      </div>
    </>
  );
}
