import { apiSlice } from '../apiSlice';

export const csrApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCsrEvents: builder.query<{ stats: { totalEventsCount: number; totalBudgetSpent: number }; events: any[] }, void>({
      query: () => '/csr',
      transformResponse: (response: any) => response.data,
      providesTags: ['CSR'],
    }),
    createCsrEvent: builder.mutation<any, any>({
      query: (body) => ({
        url: '/csr',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CSR'],
    }),
    deleteCsrEvent: builder.mutation<any, string>({
      query: (id) => ({
        url: `/csr/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CSR'],
    }),
  }),
});

export const {
  useGetCsrEventsQuery,
  useCreateCsrEventMutation,
  useDeleteCsrEventMutation,
} = csrApi;
