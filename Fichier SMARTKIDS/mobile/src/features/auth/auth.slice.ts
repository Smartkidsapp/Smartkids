import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { User, UserRoleEnum } from '../../types/user.types';
import { ACCESS_TOKEN_KEY, AuthResponse, ONBOARDED_KEY, OtpResponse, REFRESH_TOKEN_KEY } from '../auth/auth.request';
import { deleteItemAsync, setItemAsync, getItemAsync } from 'expo-secure-store';
import userApiSlice from '../users/store/user.apiSlice';
import authApiSlice from './auth.apiSlice';
import etablissementApiSlice from '../etablissement/etablissement.apiSlice';

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
  name: 'auth',
  initialState,
  reducers: {
    logout() {
      deleteItemAsync(ONBOARDED_KEY).catch();
      deleteItemAsync(ACCESS_TOKEN_KEY).catch();
      deleteItemAsync(REFRESH_TOKEN_KEY).catch();

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
      }>,
    ) {
      state.accessToken = access_token;
      if (refresh_token) {
        state.refreshToken = refresh_token;
        setItemAsync(
          REFRESH_TOKEN_KEY,
          JSON.stringify(refresh_token),
        ).catch();
      }
    },

    setUserIsSwitchingRole(state, { payload }: PayloadAction<boolean>) {
      state.isSwitchingRole = payload;
    },
  },
  extraReducers(builder) {
    builder
    .addMatcher(
      authApiSlice.endpoints.signin.matchFulfilled,
      (state, { payload }) => updateAuthState(state, payload),
    )
    .addMatcher(
      authApiSlice.endpoints.signup.matchFulfilled,
      (state, { payload }) => updateAuthState(state, payload),
    )
    .addMatcher(
      authApiSlice.endpoints.verifyEmail.matchFulfilled,
      (state, { payload }) => updateAuthState(state, payload),
    )
    .addMatcher(
      userApiSlice.endpoints.getProfile.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data;
      },
    )
    .addMatcher(
      userApiSlice.endpoints.updateProfile.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data;
      },
    )
    .addMatcher(
      userApiSlice.endpoints.updateProfilePicture.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data;
      },
    )
    .addMatcher(
      etablissementApiSlice.endpoints.createEtablissement.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.data.user;
      },
    );
  },
});

const updateAuthState = (
  state: AuthState,
  response: AuthResponse | OtpResponse,
) => {
  if ('user' in response.data) {
    state.user = response.data.user;

    if (REFRESH_TOKEN_KEY in response.data) {
      state.refreshToken = response.data.refresh_token;
      setItemAsync(
        REFRESH_TOKEN_KEY,
        JSON.stringify(response.data.refresh_token),
      ).catch();
    }
  }

  state.accessToken = response.data!.access_token;
  setItemAsync(ACCESS_TOKEN_KEY, response.data!.access_token).catch();

  state.accessToken = response.data!.access_token;
};

export const { logout, setTokens, setUserIsSwitchingRole } = authSlice.actions;

export const selectUserRole = (state: RootState) => {
  let role = state.auth.user?.activeRole;

  if (
    state.auth.user?.role === UserRoleEnum.VENDEUR &&
    (state.auth.user?.activeRole !== UserRoleEnum.VENDEUR ||
      !state.auth.user?.isSeller)
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
