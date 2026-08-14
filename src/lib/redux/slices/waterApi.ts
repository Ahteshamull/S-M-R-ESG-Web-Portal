import { apiSlice } from '../apiSlice';

export const waterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWaterLogs: builder.query<any[], void>({
      query: () => '/water',
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Water' as const, id: item._id || item.id })), { type: 'Water', id: 'LIST' }]
          : [{ type: 'Water', id: 'LIST' }],
    }),
    createWaterLog: builder.mutation<any, any>({
      query: (body) => ({
        url: '/water',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Water', id: 'LIST' }],
    }),
  }),
});

export const { useGetWaterLogsQuery, useCreateWaterLogMutation } = waterApi;
