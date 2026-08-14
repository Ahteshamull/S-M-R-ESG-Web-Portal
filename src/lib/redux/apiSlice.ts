import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Auth', 'Energy', 'Water', 'Carbon', 'Compliance', 'Chemicals', 'Waste', 'WorkerSocial', 'Training', 'CSR', 'Factory', 'Documents', 'Dashboard'],
  endpoints: () => ({}),
});
