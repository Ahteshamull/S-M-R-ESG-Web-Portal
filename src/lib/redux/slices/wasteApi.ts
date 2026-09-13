import { apiSlice } from '../apiSlice';

export const wasteApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getWasteInventory: builder.query<any[], void>({
      query: () => '/waste/inventory',
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Waste' as const, id: item._id || item.id })), { type: 'Waste', id: 'INVENTORY' }]
          : [{ type: 'Waste', id: 'INVENTORY' }],
    }),
    createWasteInventory: builder.mutation<any, any>({
      query: (body) => ({
        url: '/waste/inventory',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Waste', id: 'INVENTORY' }],
    }),
    deleteWasteInventory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/waste/inventory/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Waste', id: 'INVENTORY' }],
    }),
    getWasteRecycle: builder.query<any[], void>({
      query: () => '/waste/recycle',
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Waste' as const, id: item._id || item.id })), { type: 'Waste', id: 'RECYCLE' }]
          : [{ type: 'Waste', id: 'RECYCLE' }],
    }),
    createWasteRecycle: builder.mutation<any, any>({
      query: (body) => ({
        url: '/waste/recycle',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Waste', id: 'RECYCLE' }],
    }),
    deleteWasteRecycle: builder.mutation<any, string>({
      query: (id) => ({
        url: `/waste/recycle/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Waste', id: 'RECYCLE' }],
    }),
    getWasteTracking: builder.query<any[], { year?: number; month?: string } | void>({
      query: (params) => ({
        url: '/waste/tracking',
        params: params || {},
      }),
      transformResponse: (response: any) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map((item) => ({ type: 'Waste' as const, id: item._id || item.id })), { type: 'Waste', id: 'TRACKING' }]
          : [{ type: 'Waste', id: 'TRACKING' }],
    }),
    createWasteTracking: builder.mutation<any, any>({
      query: (body) => ({
        url: '/waste/tracking',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Waste', id: 'TRACKING' }],
    }),
    deleteWasteTracking: builder.mutation<any, string>({
      query: (id) => ({
        url: `/waste/tracking/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Waste', id: 'TRACKING' }],
    }),
  }),
});

export const {
  useGetWasteInventoryQuery,
  useCreateWasteInventoryMutation,
  useDeleteWasteInventoryMutation,
  useGetWasteRecycleQuery,
  useCreateWasteRecycleMutation,
  useDeleteWasteRecycleMutation,
  useGetWasteTrackingQuery,
  useCreateWasteTrackingMutation,
  useDeleteWasteTrackingMutation,
} = wasteApi;
