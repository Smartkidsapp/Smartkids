import { Ride, RideInvoiceData } from "@/types/ride";
import {
    ApiResponse,
    PaginatedApiResponse,
    PaginatedQueryOptions,
    apiSlice,
} from "../apiSlice";
import QueryString from "qs";
import { Category, Etablissement } from "@/types/etablissement";
import { CategoryDto, ICategoryFilters } from "./categories.request";

const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints(build) {
        return {
            paginateCategories: build.query<
                PaginatedApiResponse<Category>,
                PaginatedQueryOptions<ICategoryFilters>
            >({
                query(params) {
                    const queryString = QueryString.stringify(params);
                    return {
                        url: "/api/v1/admin/categories" + `?${queryString}`,
                        method: "GET",
                    };
                },
                providesTags: ["categories"],
            }),
            getAllCategories: build.query<
                ApiResponse<Category[]>,
                void
            >({
                query() {
                    return {
                        url: "/api/v1/admin/categories/all",
                        method: "GET",
                    };
                },
                providesTags: ["categories"],
            }),
            getCategory: build.query<
                ApiResponse<Category>,
                string
            >({
                query(id) {
                    return {
                        url: `/api/v1/admin/categories/${id}`,
                        method: "GET",
                    };
                },
            }),
            createCategory: build.mutation<
                ApiResponse<Category>,
                CategoryDto
            >({
                query(body) {
                    const formData = new FormData();
                    formData.append('image', body.icon)
                    formData.append('titre', body.titre);
                    formData.append('titre_en', body.titre_en);
                    formData.append('description', body.description);
                    return {
                        url: '/api/v1/admin/categories',
                        method: 'POST',
                        body: formData,
                    };
                },
            }),
            updateCategory: build.mutation<
                ApiResponse<Category>,
                CategoryDto
            >({
                query(body) {
                    const formData = new FormData();
                    formData.append('image', body.icon)
                    formData.append('titre', body.titre);
                    formData.append('titre_en', body.titre_en);
                    formData.append('description', body.description);
                    return {
                        url: `/api/v1/admin/categories/${body.id}`,
                        method: 'PUT',
                        body: formData,
                    };
                },
            }),
        };
    },
    overrideExisting: true,
});

export const {
    usePaginateCategoriesQuery,
    useGetCategoryQuery,
    useLazyGetCategoryQuery,
    useLazyPaginateCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useGetAllCategoriesQuery
} = categoryApiSlice;

export default categoryApiSlice;
