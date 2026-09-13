import { apiSlice } from '../apiSlice';

export interface WaterLogFilter {
  year?: number;
  month?: string;
}

export const waterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWaterLogs: builder.query<any[], WaterLogFilter | void>({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter?.year) params.append('year', filter.year.toString());
        if (filter?.month && filter.month !== 'All') params.append('month', filter.month);
        const queryStr = params.toString();
        return queryStr ? `/water?${queryStr}` : '/water';
      },
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
    updateWaterLog: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/water/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Water', id: 'LIST' }],
    }),
    deleteWaterLog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/water/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Water', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWaterLogsQuery,
  useCreateWaterLogMutation,
  useUpdateWaterLogMutation,
  useDeleteWaterLogMutation,
} = waterApi;
