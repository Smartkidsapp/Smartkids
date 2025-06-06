import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './customBaseQuery';

export const apiSlice = createApi({
  reducerPath: 'api-slice',
  refetchOnMountOrArgChange: true,
  tagTypes: [
  ],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
