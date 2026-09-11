import { apiSlice } from '../apiSlice';

export interface IChemicalCustomField {
  fieldName: string;
  fieldValue: string;
  fieldType?: 'text' | 'number' | 'date' | 'boolean' | string;
}

export interface IChemicalItem {
  _id?: string;
  id?: string;
  factoryId?: string;
  productionUnit?: string;
  processName?: string;
  slNo?: number;
  date?: string;
  chemicalName: string;
  chemicalType?: string;
  dateOfPurchase?: string;
  expiryDate?: string;
  batchNo?: string;
  quantityPurchased?: string;
  quantity?: string;
  originalMsds?: string;
  simplifiedMsds?: string;
  labelAvailable?: string;
  supplierName?: string;
  manufacturerName?: string;
  activeIngredients?: string;
  casNo?: string;
  mrslRslCompliance?: string;
  zdhcLevel?: string;
  certificateName?: string;
  healthHazard?: string;
  healthHazardType?: string;
  physicalHazard?: string;
  physicalHazardType?: string;
  environmentalHazard?: string;
  environmentalHazardType?: string;
  functionOfChemical?: string;
  useArea?: string;
  areaOfUse?: string;
  screenChemical?: string;
  ppeRecommended?: string;
  storageCondition?: string;
  monthlyConsumption?: string;
  storageLocation?: string;
  emergencyContact?: string;
  checkedBy?: string;
  checkedOn?: string;
  remarks?: string;
  monthlyIncheckReportUrl?: string;
  incheckStatus?: string;
  customFields?: IChemicalCustomField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ChemicalsApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface IChemicalMutationResult {
  success: boolean;
  message?: string;
  data?: IChemicalItem;
}

export const chemicalsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChemicals: builder.query<IChemicalItem[], void>({
      query: () => '/chemicals',
      transformResponse: (response: ChemicalsApiResponse<IChemicalItem[]> | { data: IChemicalItem[] }) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Chemicals' as const, id: item._id || item.id || '' })), { type: 'Chemicals', id: 'LIST' }]
          : [{ type: 'Chemicals', id: 'LIST' }],
    }),
    createChemical: builder.mutation<IChemicalMutationResult, Partial<IChemicalItem>>({
      query: (body) => ({
        url: '/chemicals',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),
    updateChemical: builder.mutation<IChemicalMutationResult, { id: string; data: Partial<IChemicalItem> }>({
      query: ({ id, data }) => ({
        url: `/chemicals/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),
    deleteChemical: builder.mutation<{ success: boolean; id?: string; message?: string }, string>({
      query: (id) => ({
        url: `/chemicals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Chemicals', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetChemicalsQuery, 
  useCreateChemicalMutation, 
  useUpdateChemicalMutation, 
  useDeleteChemicalMutation 
} = chemicalsApi;
