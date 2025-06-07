import { deleteItemAsync, setItemAsync, getItemAsync } from 'expo-secure-store';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { Alert } from 'react-native';
import config from '../config';
import { RootState } from '.';
import { ACCESS_TOKEN_KEY, AuthResponse, REFRESH_TOKEN_KEY } from '../features/auth/auth.request';

const baseQuery = fetchBaseQuery({
  baseUrl: config.apiURL,
  prepareHeaders: async (headers, api) => {
    const state = api.getState() as RootState;
    let { accessToken } = state.auth;

    if (!accessToken) {
      try {
        accessToken = await getItemAsync(ACCESS_TOKEN_KEY);
      } catch (error) {
        // console.log({ error });
      }
    }

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    headers.set('Accept', 'application/json');
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
    // TODO: add ts for api error.
    // @ts-ignore
    result.error.data.error === 'E_AUTH_UNAUTHORIZED'
  ) {
    const state = api.getState() as RootState;
    let { refreshToken } = state.auth;

    if (!refreshToken) {
      try {
        // const value = await RNSecureStorage.getItem(REFRESH_TOKEN_KEY);
        const value = await getItemAsync(REFRESH_TOKEN_KEY);
        if (value) {
          refreshToken = JSON.parse(value) as { id: string; value: string };
        }
      } catch (error) {}
    }

    if (!refreshToken) {
      api.dispatch({ type: 'auth/logout' });
      return result;
    }

    try {
      const url = typeof args === 'string' ? args : args.url;
      // refresh the token.
      const res = await fetch(
        `${config.apiURL}/auth/refresh-token?with-refresh=${
          url.endsWith('signout') ? 0 : 1
        }`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${refreshToken.value}`,
            'X-Refresh-Token-Id': refreshToken.id!,
          },
        },
      );

      if (res.ok) {
        const data = (await res.json()) as AuthResponse;

        // redo the request with the new token.
        api.dispatch({ type: 'auth/setTokens', payload: data.data });
        let nextArgs = {} as FetchArgs;
        if (typeof args === 'string') {
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
          extraOptions,
        );
        return result;
      }

      Alert.alert('Votre session a expiré vous devez vous reconnecter.');
      api.dispatch({ type: 'auth/logout' });
    } catch (error) {
      Alert.alert('Votre session a expiré vous devez vous reconnecter.');
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};
