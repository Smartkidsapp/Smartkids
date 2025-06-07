import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import config from "@/config";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { RootState } from "@/redux/store";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/redux/auth/auth.constants";
import { AuthResponse } from "@/redux/auth/auth.request";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: config.serverUrl,
  prepareHeaders: async (headers, api) => {
    const state = api.getState() as RootState;
    let { accessToken } = state.auth;

    if (!accessToken) {
      try {
        accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      } catch {}
    }

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // IF token has expired.
  if (
    result.error &&
    result.error.status === 401 &&
    // @ts-expect-error TODO: add ts for api error.
    result.error.data.error === "E_AUTH_UNAUTHORIZED"
  ) {
    const state = api.getState() as RootState;
    let { refreshToken } = state.auth;

    if (!refreshToken) {
      try {
        // const value = await RNSecureStorage.getItem(REFRESH_TOKEN_KEY);
        const value = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (value) {
          refreshToken = JSON.parse(value) as { id: string; value: string };
        }
      } catch {}
    }

    if (!refreshToken) {
      api.dispatch({ type: "auth/logout" });
      return result;
    }

    try {
      const url = typeof args === "string" ? args : args.url;
      // refresh the token.
      const res = await fetch(
        `${config.serverUrl}/auth/refresh-token?with-refresh=${
          url.endsWith("signout") ? 0 : 1
        }`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken.value}`,
            "X-Refresh-Token-Id": refreshToken.id!,
          },
        }
      );

      if (res.ok) {
        const data = (await res.json()) as AuthResponse;

        // redo the request with the new token.
        api.dispatch({ type: "auth/setTokens", payload: data.data });
        let nextArgs = {} as FetchArgs;
        if (typeof args === "string") {
          nextArgs.url = args;
          nextArgs.headers = {
            Authorization: `Bearer ${data.data.access_token}`,
          };
        } else {
          nextArgs = {
            ...args,
            headers: {
              ...args.headers,
              Authorization: `Bearer ${data.data.access_token}`,
            },
          };
        }

        result = await baseQuery(
          {
            ...nextArgs,
          },
          api,
          extraOptions
        );
        return result;
      }

      toast.error("Votre session a expiré vous devez vous reconnecter.");
      api.dispatch({ type: "auth/logout" });
    } catch (error) {
      toast.error("Votre session a expiré vous devez vous reconnecter.");
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};
