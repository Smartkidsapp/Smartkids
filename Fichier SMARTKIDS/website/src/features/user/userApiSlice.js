import { apiSlice } from "../../redux/apislice";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints(build) {
    return {
      signin: build.mutation({
        query(body) {
          return {
            url: '/auth/signin',
            method: 'POST',
            body,
          };
        },
      }),
      signup: build.mutation({
        query(body) {
          return {
            url: '/auth/signup',
            method: 'POST',
            body,
          };
        },
      }),
      getProfile: build.query({
        query(body) {
          return {
            url: '/api/v1/users/me',
            method: 'GET',
          };
        },
      }),
      requestOTP: build.mutation({
        query(body) {
          return {
            url: '/auth/request-otp',
            method: 'POST',
            body,
          };
        },
      }),
      verifyPasswordOTP: build.mutation({
        query({ token, ...body }) {
          return {
            url: '/auth/verify-password-otp',
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),

      verifyEmail: build.mutation({
        query({ token, ...body }) {
          return {
            url: '/auth/verify-email',
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),
      resetPassword: build.mutation({
        query({ token, ...body }) {
          return {
            url: '/auth/reset-password',
            method: 'POST',
            body,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
        },
      }),
      getCategories: build.query({
        query(body) {
          return {
            url: '/api/v1/category',
            method: 'GET',
            params: body,
          };
        },
      }),
      getOptions: build.query({
        query(body) {
          return {
            url: '/api/v1/option',
            method: 'GET',
            params: body,
          };
        },
      }),
      searchPlace: build.query({
        query(params) {
          return {
            url: '/api/v1/geo/place-search',
            method: 'GET',
            params,
          };
        },
      }),
      createEtablissement: build.mutation({
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
              formData.append('longitude', body.longitude.toString());
              formData.append('latitude', body.latitude.toString());
              formData.append('category', body.category);
              if (body.min_age.toString().length > 0 && body.max_age.toString().length > 0) {
                  formData.append('min_age', body.min_age.toString());
                  formData.append('max_age', body.max_age.toString());
              }
              if(body.options) {
                body.options.forEach((option) => {
                    formData.append('options', option)
                });
              } else {
                formData.append('options', [])
              }
              body.dailyOpeningHours.forEach((dailyOpeningHour) => {
                  formData.append('dailyOpeningHours', JSON.stringify(dailyOpeningHour))
              });
              body.services.forEach((service) => {
                  formData.append('services', JSON.stringify(service))
              });
              return {
                  url: '/api/v1/etablissement',
                  method: 'POST',
                  body: formData,
              };
          },
      }),
      listPlans: build.query({
        query: () => "/subscription-plans",
      }),
      listStripePaymentMethods: build.query({
        query() {
          return {
            method: "GET",
            url: "/payment-methods",
            params: {
              type: "stripe",
            },
          };
        },
      }),

      paySubscription: build.mutation({
        query({ changePlan, subscriptionId, ...body }) {
          return {
            url:
              changePlan && subscriptionId
                ? `/subscriptions/${subscriptionId}/change-plan`
                : "/subscriptions/setup",
            method: "PUT",
            body,
          };
        },
      }),
      getSubscriptionStatus: build.query({
        query(body) {
          return {
            url: "/users/me/subscription",
            method: "GET",
          };
        },
      }),
      updateProfile: build.mutation({
        query(body) {
          return {
            url: '/api/v1/users/me',
            method: 'PUT',
            body,
          };
        },
      }),     
      getMyEtablissement: build.query({
        query() {
          return {
            url: '/api/v1/etablissement/me/user',
            method: 'GET',
          };
        },
      }),       
      editEtablissement: build.mutation({
        query: (formData) => ({
          url: '/api/v1/etablissement',
          method: 'PUT',
          body: formData,
        })
      }),
      deleteEtablissementImage: build.mutation({
        query({ etablissementId, mediaId }) {
          return {
            url: `/api/v1/etablissement/${etablissementId}/images/${mediaId}`,
            method: 'DELETE',
          };
        },
      }),
    };
  },
});

export const {
  useSigninMutation,
  useSignupMutation,
  useGetCategoriesQuery,
  useLazyGetCategoriesQuery,
  useGetOptionsQuery,
  useLazyGetOptionsQuery,
  useSearchPlaceQuery, 
  useLazySearchPlaceQuery,
  useCreateEtablissementMutation,
  useListPlansQuery,
  useLazyListStripePaymentMethodsQuery,
  useListStripePaymentMethodsQuery,
  usePaySubscriptionMutation,
  useGetSubscriptionStatusQuery,
  useLazyGetSubscriptionStatusQuery,
  useRequestOTPMutation,
  useVerifyPasswordOTPMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useGetMyEtablissementQuery,
  useUpdateProfileMutation,
  useEditEtablissementMutation,
  useDeleteEtablissementImageMutation
} = userApiSlice;

export default userApiSlice;
