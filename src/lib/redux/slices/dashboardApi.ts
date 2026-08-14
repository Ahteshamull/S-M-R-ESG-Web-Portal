import { apiSlice } from '../apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<any, void>({
      query: () => '/dashboard/summary',
      transformResponse: (response: any) => response.data,
      providesTags: ['Dashboard', 'Energy', 'Water', 'Carbon', 'Compliance', 'Waste'],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
