import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import authApiSlice from "@/redux/auth/auth.apiSlice";
import { User, UserRoleEnum } from "@/types/user.types";
import { AuthResponse, OtpResponse } from "@/redux/auth/auth.request";
import { RootState } from "@/redux/store";
import userApiSlice from "@/redux/users/user.apiSlice";
import {
  ACCESS_TOKEN_KEY,
  ONBOARDED_KEY,
  REFRESH_TOKEN_KEY,
} from "@/redux/auth/auth.constants";

interface AuthState {
  user?: User | undefined;
  accessToken?: string | null;
  refreshToken?: {
    value: string;
    id?: string;
  } | null;
  isSwitchingRole: boolean;
}

const initialState: AuthState = {
  user: undefined,
  isSwitchingRole: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem(ONBOARDED_KEY);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);

      return {
        ...initialState,
      };
    },
    setTokens(
      state,
      {
        payload: { access_token, refresh_token },
      }: PayloadAction<{
        access_token: string;
        refresh_token?: { id: string; value: string };
      }>
    ) {
      state.accessToken = access_token;
      if (refresh_token) {
        state.refreshToken = refresh_token;
        localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refresh_token));
      }
    },

    setUserIsSwitchingRole(state, { payload }: PayloadAction<boolean>) {
      state.isSwitchingRole = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        authApiSlice.endpoints.requestOTP.matchFulfilled,
        (state, { payload }) => updateAuthState(state, payload)
      )
      .addMatcher(
        authApiSlice.endpoints.signin.matchFulfilled,
        (state, { payload }) => updateAuthState(state, payload)
      )
      .addMatcher(
        authApiSlice.endpoints.verifyPasswordOTP.matchFulfilled,
        (state, { payload }) => updateAuthState(state, payload)
      )
      .addMatcher(
        userApiSlice.endpoints.getProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.data;
        }
      );
  },
});

const updateAuthState = (
  state: AuthState,
  response: AuthResponse | OtpResponse
) => {
  if ("user" in response.data) {
    state.user = response.data.user;

    if (REFRESH_TOKEN_KEY in response.data) {
      state.refreshToken = response.data.refresh_token;
      localStorage.setItem(
        REFRESH_TOKEN_KEY,
        JSON.stringify(response.data.refresh_token)
      );
    }
  }

  state.accessToken = response.data!.access_token;
  localStorage.setItem(ACCESS_TOKEN_KEY, response.data!.access_token);

  state.accessToken = response.data!.access_token;
};

export const { logout, setTokens, setUserIsSwitchingRole } = authSlice.actions;

export const selectUserRole = (state: RootState) => {
  let role = state.auth.user?.activeRole;

  if (
    state.auth.user?.role === UserRoleEnum.DRIVER &&
    (state.auth.user?.activeRole !== UserRoleEnum.DRIVER ||
      !state.auth.user?.isDriver)
  ) {
    role = UserRoleEnum.CLIENT;
  }

  return role;
};

export const selectUser = (state: RootState) => state.auth.user;
export const selectUserCredentials = (state: RootState) => state.auth;

export const selectUserIsSwitchingRole = (state: RootState) =>
  state.auth.isSwitchingRole;

export default authSlice.reducer;
