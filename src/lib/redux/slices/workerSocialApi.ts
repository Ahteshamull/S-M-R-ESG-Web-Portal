import { apiSlice } from '../apiSlice';

export const workerSocialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkerSocialData: builder.query<{ activeCommitteesCount: number; maternityLeavesCount: number; openGrievancesCount: number; grievances: any[] }, void>({
      query: () => '/worker-social',
      transformResponse: (response: any) => response.data,
      providesTags: ['WorkerSocial'],
    }),
    createGrievance: builder.mutation<any, any>({
      query: (body) => ({
        url: '/worker-social/grievance',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WorkerSocial'],
    }),
    updateGrievanceStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/worker-social/grievance/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['WorkerSocial'],
    }),
    deleteGrievance: builder.mutation<any, string>({
      query: (id) => ({
        url: `/worker-social/grievance/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WorkerSocial'],
    }),
  }),
});

export const {
  useGetWorkerSocialDataQuery,
  useCreateGrievanceMutation,
  useUpdateGrievanceStatusMutation,
  useDeleteGrievanceMutation,
} = workerSocialApi;
