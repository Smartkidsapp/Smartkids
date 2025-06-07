import {
    ApiResponse,
    PaginatedApiResponse,
    PaginatedQueryOptions,
    SuccessResponseEnum,
    apiSlice,
} from "../apiSlice";
import QueryString from "qs";
import { IOptionFilters, OptionDto } from "./options.request";
import { Option } from "@/types/etablissement";

const optionApiSlice = apiSlice.injectEndpoints({
    endpoints(build) {
        return {
            paginateOptions: build.query<
                PaginatedApiResponse<Option>,
                PaginatedQueryOptions<IOptionFilters>
            >({
                query(params) {
                    const queryString = QueryString.stringify(params);
                    return {
                        url: "/api/v1/admin/options" + `?${queryString}`,
                        method: "GET",
                    };
                },
                providesTags: ["categories"],
            }),

            getOption: build.query<
                ApiResponse<Option>,
                string
            >({
                query(id) {
                    return {
                        url: `/api/v1/admin/options/${id}`,
                        method: "GET",
                    };
                },
            }),
            createOption: build.mutation<
                ApiResponse<Option>,
                OptionDto
            >({
                query(body) {
                    return {
                        url: '/api/v1/admin/options',
                        method: 'POST',
                        body,
                    };
                },
            }),
            updateOption: build.mutation<
                ApiResponse<Option>,
                {data: OptionDto, id: string}
            >({
                query(body) {
                    return {
                        url: `/api/v1/admin/options/${body.id}`,
                        method: 'PUT',
                        body: body.data,
                    };
                },
            }),
            deleteOption: build.mutation<
              {
                status: SuccessResponseEnum;
                message: string;
              },
              string
            >({
              query(id) {
                return {
                  url: `/api/v1/admin/options/${id}`,
                  method: "DELETE",
                };
              },
              invalidatesTags: ["categories"],
            }),
        };
    },
    overrideExisting: true,
});

export const {
    usePaginateOptionsQuery,
    useGetOptionQuery,
    useLazyGetOptionQuery,
    useLazyPaginateOptionsQuery,
    useCreateOptionMutation,
    useUpdateOptionMutation,
    useDeleteOptionMutation
} = optionApiSlice;

export default optionApiSlice;
