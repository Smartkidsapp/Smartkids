import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import AppTable from "@/components/AppTable";
import { IUserFilters } from "@/redux/users/users.request";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import { Link } from "react-router-dom";
import { formatDistance, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLazyPaginateCategoriesQuery } from "@/redux/categories/categories.apiSlice";
import { Category, Option } from "@/types/etablissement";
import avatarImg from "@/assets/images/avatar.png";
import OptionFilters from "./OptionFilters";
import { useLazyPaginateOptionsQuery } from "@/redux/options/options.apiSlice";
import { IOptionFilters } from "@/redux/options/options.request";
import { Badge } from "@/components/ui/badge";
import DeleteOptionBtn from "./DeleteOptionBtn";

export default function OptionsPage() {
    const [paginate, { data, isFetching }] = useLazyPaginateOptionsQuery();
    const [filters, setFilters] = useState<IOptionFilters>({});
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    console.log(data?.data);

    const columnDefs = useMemo<ColumnDef<Option>[]>(
        () => [
            {
                id: "titre",
                header: "Titre",
                cell: ({ row: { original: option } }) => (
                    <div className="w-[80px]">
                        <Link to={`/options/${option.id}?name=${option.titre}`}>
                            <div className="flex items-center gap-2">
                                {
                                    option.icon && (
                                        <img
                                            className="h-10 w-10"
                                            src={option.icon?.src ?? avatarImg}
                                            alt={option.titre}
                                        />
                                    )
                                }
                                <div>
                                    <div>{option.titre}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ),
            },
            {
                id: "categories",
                header: "Catégories",
                cell: ({ row: { original: option } }) => (
                    <div className="flex flex-col flex-warp gap-2">
                        {
                            option.categories.map((category: any, key) => (
                                <Badge key={key} variant="secondary" style={{width: 'fit-content'}}>
                                    {category.titre}
                                </Badge>
                            ))
                        }
                    </div>
                ),
            },
            {
                id: "description",
                header: "Description",
                cell: ({ row: { original: option } }) => option.description,
            },
            {
                id: "createdAt",
                header: "Créer le",
                cell: ({ row: { original: option } }) => (
                    <Tooltip>
                        <TooltipTrigger>
                            <span>
                                {formatDistance(new Date(option.createdAt), new Date(), {
                                    locale: fr,
                                    addSuffix: true,
                                })}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent align="end">
                            <Card className="p-3">
                                {format(new Date(option.createdAt), "dd LLLL yyyy à HH:mm", {
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
                cell: ({ row: { original: option } }) => {
                    return (
                        <div className="flex gap-2 items-center">
                            <Button size="icon" variant="outline">
                                <Link to={`/options/${option.id}?name=${option.titre}`}>
                                    <Edit className="h-5 w-5" />
                                </Link>
                            </Button>

                            <DeleteOptionBtn id={option.id} />
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
                    { current: true, label: "Options" },
                ]}
            />
            <div className="grid flex-1 items-start gap-4 sm:gap-6 p-4 sm:px-6 sm:py-0 ">
                <OptionFilters filters={filters} setFilters={setFilters} />
                <AppTable
                    isLoading={isFetching}
                    columns={columnDefs}
                    data={data?.data?.items ?? []}
                    onPaginationChange={setPaginationState}
                    paginationState={paginationState}
                    rowCount={data?.data.total ?? 10}
                    title="Liste des options"
                />
            </div>
        </>
    );
}
