import { apiSlice } from '../apiSlice';

export interface IDocumentItem {
  _id: string;
  id?: string;
  factoryId?: string;
  name: string;
  category: string;
  uploadedBy: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  chemicalName?: string;
  casNo?: string;
  supplierName?: string;
  month?: string;
  year?: string;
  version?: string;
  remarks?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<IDocumentItem[], { category?: string } | void>({
      query: (params) => {
        const queryParams = params && params.category ? `?category=${encodeURIComponent(params.category)}` : '';
        return `/documents${queryParams}`;
      },
      transformResponse: (response: DocumentApiResponse<IDocumentItem[]> | { data: IDocumentItem[] }) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Documents' as const, id: item._id || item.id || '' })), { type: 'Documents', id: 'LIST' }]
          : [{ type: 'Documents', id: 'LIST' }],
    }),
    uploadDocument: builder.mutation<DocumentApiResponse<IDocumentItem>, FormData>({
      query: (body) => ({
        url: '/documents',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
    deleteDocument: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `/documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Documents', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;
