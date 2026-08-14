import { apiSlice } from '../apiSlice';

export const complianceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComplianceOverview: builder.query<{ caps: any[]; legalDocs: any[]; committees: any[] }, void>({
      query: () => '/compliance/overview',
      transformResponse: (response: any) => response.data,
      providesTags: ['Compliance'],
    }),
    createCAP: builder.mutation<any, any>({
      query: (body) => ({
        url: '/compliance/caps',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Compliance'],
    }),
    updateCAP: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/compliance/caps/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Compliance'],
    }),
    deleteCAP: builder.mutation<any, string>({
      query: (id) => ({
        url: `/compliance/caps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Compliance'],
    }),
    createLegalDoc: builder.mutation<any, any>({
      query: (body) => ({
        url: '/compliance/legal',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Compliance'],
    }),
    deleteLegalDoc: builder.mutation<any, string>({
      query: (id) => ({
        url: `/compliance/legal/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Compliance'],
    }),
    createCommittee: builder.mutation<any, any>({
      query: (body) => ({
        url: '/compliance/committees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Compliance'],
    }),
    deleteCommittee: builder.mutation<any, string>({
      query: (id) => ({
        url: `/compliance/committees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Compliance'],
    }),
  }),
});

export const {
  useGetComplianceOverviewQuery,
  useCreateCAPMutation,
  useUpdateCAPMutation,
  useDeleteCAPMutation,
  useCreateLegalDocMutation,
  useDeleteLegalDocMutation,
  useCreateCommitteeMutation,
  useDeleteCommitteeMutation,
} = complianceApi;
