import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from '../features/user/userSlice';
import userApiSlice from '../features/user/userApiSlice';
import { apiSlice } from './apislice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: AuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})