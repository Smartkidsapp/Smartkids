import { useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { selectUserCredentials, setTokens } from "@/src/features/auth/auth.slice";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/src/features/auth/auth.request";

export default function useGetAuthCreds() {
  const setup = useRef<boolean>(false);
  const creds = useAppSelector(selectUserCredentials);
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      if (!creds.accessToken) {
        setup.current = true;
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (accessToken) {
          dispatch(
            setTokens({
              access_token: accessToken,
              refresh_token: refreshToken
                ? (JSON.parse(refreshToken) as {
                    id: string;
                    value: string;
                  })
                : undefined,
            })
          );
        }
      }
    })();
  }, [setup, dispatch, creds]);

  return creds;
}
