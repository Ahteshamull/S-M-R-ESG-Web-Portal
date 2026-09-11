import { apiSlice } from '../apiSlice';

export const chemicalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChemicals: builder.query<any[], void>({
      query: () => '/chemicals',
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Chemicals' as const, id: item._id || item.id })), { type: 'Chemicals', id: 'LIST' }]
          : [{ type: 'Chemicals', id: 'LIST' }],
    }),
    createChemical: builder.mutation<any, any>({
      query: (body) => ({
        url: '/chemicals',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),
    updateChemical: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/chemicals/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),
    deleteChemical: builder.mutation<any, string>({
      query: (id) => ({
        url: `/chemicals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetChemicalsQuery, 
  useCreateChemicalMutation, 
  useUpdateChemicalMutation,
  useDeleteChemicalMutation 
} = chemicalsApi;

