import { apiSlice } from '../apiSlice';

export interface IAssessmentItem {
  _id?: string;
  standard: string;
  auditType: string;
  auditDate?: string;
  score?: number;
  certValidUntil?: string;
  certStatus?: 'Valid' | 'Expiring Soon' | 'Expired';
  reportLink?: string;
  approval: 'Approved' | 'Conditionally Approved' | 'Pending' | 'Rejected';
  conditions?: string;
  approvedBy?: string;
  nextReview?: string;
}

export interface ISupplierRecord {
  _id: string;
  supplierId: string;
  supplierName: string;
  businessType: string;
  address?: string;
  productCategory?: string;
  contactPerson?: string;
  tradeLicenseNo?: string;
  phone?: string;
  email?: string;
  assessments: IAssessmentItem[];
  createdAt?: string;
  updatedAt?: string;
}

export const complianceApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getComplianceOverview: builder.query<{ caps: any[]; legalDocs: any[]; committees: any[]; suppliers?: ISupplierRecord[] }, void>({
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
    getSuppliers: builder.query<ISupplierRecord[], void>({
      query: () => '/compliance/suppliers',
      transformResponse: (response: any) => response.data || [],
      providesTags: ['Compliance'],
    }),
    createSupplier: builder.mutation<any, Partial<ISupplierRecord>>({
      query: (body) => ({
        url: '/compliance/suppliers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Compliance'],
    }),
    updateSupplier: builder.mutation<any, { id: string; body: Partial<ISupplierRecord> }>({
      query: ({ id, body }) => ({
        url: `/compliance/suppliers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Compliance'],
    }),
    deleteSupplier: builder.mutation<any, string>({
      query: (id) => ({
        url: `/compliance/suppliers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Compliance'],
    }),
    addSupplierAssessment: builder.mutation<any, { supplierId: string; assessment: IAssessmentItem }>({
      query: ({ supplierId, assessment }) => ({
        url: `/compliance/suppliers/${supplierId}/assessments`,
        method: 'POST',
        body: assessment,
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
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useAddSupplierAssessmentMutation,
} = complianceApi;

