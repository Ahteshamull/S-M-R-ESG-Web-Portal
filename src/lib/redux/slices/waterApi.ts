import { apiSlice } from '../apiSlice';

export interface WaterLogFilter {
  year?: number;
  month?: string;
}

export const waterApi = apiSlice.injectEndpoints({
  overrideExisting: true,
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
      invalidatesTags: [{ type: 'Water', id: 'LIST' }, { type: 'Water', id: 'TELEMETRY' }, { type: 'Water' }],
    }),
    updateWaterLog: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/water/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'Water', id: 'LIST' }, { type: 'Water', id: 'TELEMETRY' }, { type: 'Water' }],
    }),
    deleteWaterLog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/water/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Water', id: 'LIST' }, { type: 'Water', id: 'TELEMETRY' }, { type: 'Water' }],
    }),
    getWaterDepartmentTelemetry: builder.query<any, { area: string; year?: number; month?: string }>({
      query: ({ area, year, month }) => {
        const params = new URLSearchParams();
        params.append('area', area);
        if (year) params.append('year', year.toString());
        if (month && month !== 'All') params.append('month', month);
        return `/water/department-telemetry?${params.toString()}`;
      },
      transformResponse: (response: any) => response.data,
      providesTags: [{ type: 'Water', id: 'TELEMETRY' }],
    }),
  }),
});

export const {
  useGetWaterLogsQuery,
  useGetWaterDepartmentTelemetryQuery,
  useCreateWaterLogMutation,
  useUpdateWaterLogMutation,
  useDeleteWaterLogMutation,
} = waterApi;
