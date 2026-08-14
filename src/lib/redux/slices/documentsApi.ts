import { apiSlice } from '../apiSlice';

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<any[], void>({
      query: () => '/documents',
      transformResponse: (response: any) => response.data,
      providesTags: ['Documents'],
    }),
    uploadDocument: builder.mutation<any, FormData | any>({
      query: (body) => ({
        url: '/documents',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Documents'],
    }),
    deleteDocument: builder.mutation<any, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Documents'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;
