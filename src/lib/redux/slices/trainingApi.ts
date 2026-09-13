import { apiSlice } from '../apiSlice';

export const trainingApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTrainings: builder.query<{ stats: { totalHours: number; trainedWorkers: number; upcomingSessions: number; competencyScore: number }; sessions: any[] }, void>({
      query: () => '/training',
      transformResponse: (response: any) => response.data,
      providesTags: ['Training'],
    }),
    createTraining: builder.mutation<any, any>({
      query: (body) => ({
        url: '/training',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Training'],
    }),
    updateTrainingStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/training/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Training'],
    }),
    deleteTraining: builder.mutation<any, string>({
      query: (id) => ({
        url: `/training/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Training'],
    }),
  }),
});

export const {
  useGetTrainingsQuery,
  useCreateTrainingMutation,
  useUpdateTrainingStatusMutation,
  useDeleteTrainingMutation,
} = trainingApi;
