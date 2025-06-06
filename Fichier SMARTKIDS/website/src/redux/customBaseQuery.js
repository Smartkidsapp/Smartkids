import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '../config';

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiURL,
  prepareHeaders: async (headers, api) => {
    const state = api.getState();
    let { accessToken } = state.auth;

    if (!accessToken) {
      try {
        accessToken = localStorage.getItem("access_token");
      } catch {}
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  return result;
};
