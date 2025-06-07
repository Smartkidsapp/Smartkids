import { useEffect, useMemo, useState } from "react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
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
import { Edit, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import AppBreadCrumb from "../Layouts/DashboardLayout/AppBreadCrumb";
import { Link } from "react-router-dom";
import UserPreview from "@/components/UserPreview";
import { formatDistance, format } from "date-fns";
import { fr } from "date-fns/locale";
import { useLazyPaginateCategoriesQuery } from "@/redux/categories/categories.apiSlice";
import { Category } from "@/types/etablissement";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initial } from "@/lib/utils";
import avatarImg from "@/assets/images/avatar.png";
import CategoryFilters from "./CategoryFilters";

export default function CategoriesPage() {
    const [paginate, { data, isFetching }] = useLazyPaginateCategoriesQuery();
    const [filters, setFilters] = useState<IUserFilters>({});
    const [paginationState, setPaginationState] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const columnDefs = useMemo<ColumnDef<Category>[]>(
        () => [
            {
                id: "titre",
                header: "Titre",
                cell: ({ row: { original: category } }) => (
                    <div className="w-[300px]">
                        <Link to={`/categories/${category.id}?name=${category.titre}`}>
                            <div className="flex items-center gap-2">
                                {
                                    category.icon && (
                                        <img
                                            className="h-10 w-10"
                                            src={category.icon?.src ?? avatarImg}
                                            alt={category.titre}
                                        />
                                    )
                                }
                                <div>
                                    <div>{category.titre}</div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ),
            },
            {
                id: "description",
                header: "Description",
                cell: ({ row: { original: category } }) => category.description,
            },
            {
                id: "createdAt",
                header: "Créer le",
                cell: ({ row: { original: category } }) => (
                    <Tooltip>
                        <TooltipTrigger>
                            <span>
                                {formatDistance(new Date(category.createdAt), new Date(), {
                                    locale: fr,
                                    addSuffix: true,
                                })}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent align="end">
                            <Card className="p-3">
                                {format(new Date(category.createdAt), "dd LLLL yyyy à HH:mm", {
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
                cell: ({ row: { original: category } }) => {
                    return (
                        <div className="flex gap-2 items-center">
                            <Button size="icon" variant="outline">
                                <Link to={`/categories/${category.id}?name=${category.titre}`}>
                                    <Edit className="h-5 w-5" />
                                </Link>
                            </Button>

                            {/*<DeleteUserBtn userId={user.id} />*/}
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
                    { current: true, label: "Catégories" },
                ]}
            />
            <div className="grid flex-1 items-start gap-4 sm:gap-6 p-4 sm:px-6 sm:py-0 ">
                <CategoryFilters filters={filters} setFilters={setFilters} />
                <AppTable
                    isLoading={isFetching}
                    columns={columnDefs}
                    data={data?.data?.items ?? []}
                    onPaginationChange={setPaginationState}
                    paginationState={paginationState}
                    rowCount={data?.data.total ?? 10}
                    title="Liste des catégories"
                />
            </div>
        </>
    );
}
