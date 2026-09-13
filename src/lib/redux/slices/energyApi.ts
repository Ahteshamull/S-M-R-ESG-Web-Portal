import { apiSlice } from '../apiSlice';

export const energyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEnergyLogs: builder.query<any[], { year?: number; month?: string } | void>({
      query: (params) => ({
        url: '/energy',
        params: params || {},
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Energy' as const, id: item._id || item.id })), { type: 'Energy', id: 'LIST' }]
          : [{ type: 'Energy', id: 'LIST' }],
    }),
    createEnergyLog: builder.mutation<any, any>({
      query: (body) => ({
        url: '/energy',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Energy', id: 'LIST' }],
    }),
  }),
});

export const { useGetEnergyLogsQuery, useCreateEnergyLogMutation } = energyApi;
