import { createSlice } from '@reduxjs/toolkit'
import userApiSlice from './userApiSlice';

const initialState = {
  createEtablissement: null,
  accessToken: null,
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout() {
      localStorage.removeItem("access_token");
      return {
        ...initialState,
      };
    },
    setToken(
      state,
      {
        payload,
      }
    ) {
      state.accessToken = payload;
    },
    setCreateEtablissement(state, { payload }) {
      if (state.createEtablissement) {
        state.createEtablissement = { ...state.createEtablissement, ...payload };
      } else {
        state.createEtablissement = payload;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        userApiSlice.endpoints.signin.matchFulfilled,
        (state, { payload }) => updateAuthState(state, payload)
      ).addMatcher(
        userApiSlice.endpoints.signup.matchFulfilled,
        (state, { payload }) => updateAuthState(state, payload)
      ).addMatcher(
        userApiSlice.endpoints.verifyEmail.matchFulfilled,
        (state, { payload }) => updateAuthState(state, payload)
      );
  },
})

const updateAuthState = (state, response) => {
  console.log("🔁 Réponse login/signup :", response);

  if ("user" in response.data) {
    state.user = response.data.user;
  }

  state.accessToken = response.data?.access_token;
  localStorage.setItem("access_token", response.data?.access_token);
};


// Action creators are generated for each case reducer function
export const { setCreateEtablissement, logout, setToken } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer