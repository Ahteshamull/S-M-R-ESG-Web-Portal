import { apiSlice } from '../apiSlice';

export const factoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryProfile: builder.query<any, void>({
      query: () => '/factory',
      transformResponse: (response: any) => response.data,
      providesTags: ['Factory'],
    }),
    updateFactoryProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: '/factory',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Factory'],
    }),
    addFactoryCertification: builder.mutation<any, any>({
      query: (body) => ({
        url: '/factory/certifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Factory'],
    }),
    deleteFactoryCertification: builder.mutation<any, number>({
      query: (index) => ({
        url: `/factory/certifications/${index}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Factory'],
    }),
  }),
});

export const {
  useGetFactoryProfileQuery,
  useUpdateFactoryProfileMutation,
  useAddFactoryCertificationMutation,
  useDeleteFactoryCertificationMutation,
} = factoryApi;
