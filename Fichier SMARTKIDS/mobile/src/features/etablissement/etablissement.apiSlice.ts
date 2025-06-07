import { User } from "@/src/types/user.types";
import { ApiResponse, apiSlice, PaginatedApiResponse, SuccessResponseEnum } from "../../store/apiSlice";
import { Category, Etablissement, Favorite, Media, Option, Rating } from "../../types";
import { CreateEtablissementDto, RateUserDto, SearchEtablissementDto } from "./etablissement.request";

const etablissementApiSlice = apiSlice.injectEndpoints({
    endpoints(build) {
        return {
            createEtablissement: build.mutation<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: { etablissement: Etablissement, user: User };
                },
                CreateEtablissementDto
            >({
                query(body) {
                    const formData = new FormData();
                    body.images.forEach((image) => {
                        formData.append('images', image)
                    });
                    formData.append('nom', body.nom);
                    formData.append('description', body.description);
                    formData.append('code_promo', body.code_promo);
                    formData.append('phone', body.phone);
                    formData.append('adresse', body.adresse);
                    formData.append('longitude', body.longitude?.toString());
                    formData.append('latitude', body.latitude?.toString());
                    formData.append('category', body.category);

                    if (body.min_age?.toString().length > 0 && body.max_age?.toString().length > 0) {
                        formData.append('min_age', body.min_age.toString());
                        formData.append('max_age', body.max_age.toString());
                    }
                    body.options.forEach((option) => {
                        formData.append('options', option)
                    });
                    body.dailyOpeningHours.forEach((dailyOpeningHour) => {
                        formData.append('dailyOpeningHours', JSON.stringify(dailyOpeningHour))
                    });
                    body.services.forEach((service) => {
                        formData.append('services', JSON.stringify(service))
                    });
                    return {
                        url: '/api/v1/etablissement',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    };
                },
            }),
            getCategories: build.query<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: Category[];
                },
                void
            >({
                query(body) {
                    return {
                        url: '/api/v1/category',
                        method: 'GET',
                        body,
                    };
                },
                providesTags: ['categories'],
            }),
            getOptions: build.query<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: Option[];
                },
                { category?: string }
            >({
                query(params) {
                    return {
                        url: '/api/v1/option',
                        method: 'GET',
                        params,
                    };
                },
                providesTags: ['options'],
            }),
            getEtablissements: build.query<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: Etablissement[];
                },
                SearchEtablissementDto
            >({
                query(params) {
                    return {
                        url: '/api/v1/etablissement',
                        method: 'GET',
                        params,
                    };
                },
                providesTags: ['etablissement'],
            }),
            paginateEtablissements: build.query<
                PaginatedApiResponse<Etablissement>,
                SearchEtablissementDto
            >({
                query(params) {
                    return {
                        url: '/api/v1/etablissement/paginate',
                        method: 'GET',
                        params,
                    };
                },
                providesTags: ['etablissement'],
            }),
            getEtablissement: build.query<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: Etablissement;
                },
                { id: string }
            >({
                query(params) {
                    return {
                        url: `/api/v1/etablissement/${params.id}`,
                        method: 'GET',
                    };
                },
                providesTags: ['etablissement'],
            }),
            getMyEtablissement: build.query<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: Etablissement;
                },
                void
            >({
                query(body) {
                    return {
                        url: '/api/v1/etablissement/me/user',
                        method: 'GET',
                        body,
                    };
                },
                providesTags: ['etablissement'],
            }),
            editEtablissement: build.mutation<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: { etablissement: Etablissement, user: User };
                },
                CreateEtablissementDto
            >({
                query(body) {
                    const formData = new FormData();
                    body.images.forEach((image) => {
                        formData.append('images', image)
                    });
                    formData.append('nom', body.nom);
                    formData.append('description', body.description);
                    formData.append('code_promo', body.code_promo);
                    formData.append('phone', body.phone);
                    formData.append('adresse', body.adresse);
                    formData.append('longitude', body.longitude?.toString());
                    formData.append('latitude', body.latitude?.toString());
                    formData.append('category', body.category);

                    if (body.min_age?.toString().length > 0 && body.max_age?.toString().length > 0) {
                        formData.append('min_age', body.min_age.toString());
                        formData.append('max_age', body.max_age.toString());
                    }
                    body.options.forEach((option) => {
                        formData.append('options', option)
                    });
                    body.dailyOpeningHours.forEach((dailyOpeningHour) => {
                        formData.append('dailyOpeningHours', JSON.stringify(dailyOpeningHour))
                    });
                    body.services.forEach((service) => {
                        formData.append('services', JSON.stringify(service))
                    });
                    return {
                        url: '/api/v1/etablissement',
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        body: formData,
                    };
                },
            }),
            deleteMedia: build.mutation<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: Media;
                },
                { id: string }
            >({
                query(params) {
                    return {
                        url: `/api/v1/medias/${params.id}`,
                        method: 'DELETE',
                    };
                },
            }),
            getBoostedEtablissements: build.query<
                {
                    status: SuccessResponseEnum;
                    message?: string;
                    data: Etablissement[];
                },
                SearchEtablissementDto
            >({
                query(params) {
                    return {
                        url: '/api/v1/boostage/etablissements',
                        method: 'GET',
                        params
                    };
                },
                providesTags: ['etablissement'],
            }),

            rateUser: build.mutation<
                ApiResponse<Rating>,
                RateUserDto
            >({
                query(body) {
                    return {
                        url: `/api/v1/ratings`,
                        method: 'POST',
                        body,
                    };
                },
            }),
            canUserRate: build.query<
                ApiResponse<Boolean>,
                { etablissementId: String }
            >({
                query(body) {
                    return {
                        url: '/api/v1/ratings/user/can-rate',
                        method: 'GET',
                        params: { etablissementId: body.etablissementId }
                    };
                },
                providesTags: ['etablissement'],
            }),
            getEtablissementRattings: build.query<
                ApiResponse<Rating[]>,
                { id: string }

            >({
                query(params) {
                    return {
                        url: `/api/v1/ratings/etablissement/${params.id}`,
                        method: 'GET',
                    };
                },
                providesTags: ['etablissement'],
            }),

            favorite: build.mutation<
                ApiResponse<Favorite>,
                { etablissementId: string }
            >({
                query(body) {
                    return {
                        url: `/api/v1/favorites`,
                        method: 'POST',
                        body,
                    };
                },
            }),

            getUserFavorites: build.query<
                ApiResponse<Favorite[]>,
                void

            >({
                query(params) {
                    return {
                        url: `/api/v1/favorites`,
                        method: 'GET',
                    };
                },
                providesTags: ['etablissement'],
            }),

            isFavorite: build.query<
                ApiResponse<boolean>,
                { id: string }

            >({
                query(params) {
                    return {
                        url: `/api/v1/favorites/${params.id}`,
                        method: 'GET',
                    };
                },
                providesTags: ['etablissement'],
            }),
        };
    },
});

export const {
    useCreateEtablissementMutation,
    useGetCategoriesQuery,
    useGetOptionsQuery,
    useLazyGetOptionsQuery,
    useGetEtablissementsQuery,
    useLazyGetEtablissementsQuery,
    useGetEtablissementQuery,
    useGetMyEtablissementQuery,
    useEditEtablissementMutation,
    useDeleteMediaMutation,
    useGetBoostedEtablissementsQuery,
    useLazyGetBoostedEtablissementsQuery,
    useRateUserMutation,
    useCanUserRateQuery,
    useLazyCanUserRateQuery,
    useGetEtablissementRattingsQuery,
    useLazyGetEtablissementRattingsQuery,
    useGetUserFavoritesQuery,
    useLazyGetUserFavoritesQuery,
    useFavoriteMutation,
    useIsFavoriteQuery,
    useLazyIsFavoriteQuery,
    usePaginateEtablissementsQuery,
    useLazyPaginateEtablissementsQuery
} = etablissementApiSlice;

export default etablissementApiSlice;
