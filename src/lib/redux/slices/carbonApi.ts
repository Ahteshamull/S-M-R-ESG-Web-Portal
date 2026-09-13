import { apiSlice } from '../apiSlice';

export const carbonApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getCarbonSummary: builder.query<any, void>({
      query: () => '/carbon/summary',
      transformResponse: (response: any) => response.data,
      providesTags: ['Carbon'],
    }),
    createCarbonEntry: builder.mutation<any, any>({
      query: (body) => ({
        url: '/carbon/entry',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Carbon'],
    }),
    deleteCarbonEntry: builder.mutation<any, string>({
      query: (id) => ({
        url: `/carbon/entry/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Carbon'],
    }),
    updateEmissionFactor: builder.mutation<any, { id: string; factor: number }>({
      query: ({ id, factor }) => ({
        url: `/carbon/factors/${id}`,
        method: 'PUT',
        body: { factor },
      }),
      invalidatesTags: ['Carbon'],
    }),
  }),
});

export const {
  useGetCarbonSummaryQuery,
  useCreateCarbonEntryMutation,
  useDeleteCarbonEntryMutation,
  useUpdateEmissionFactorMutation,
} = carbonApi;
