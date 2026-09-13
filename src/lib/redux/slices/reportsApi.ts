import { apiSlice } from '../apiSlice';

export interface IESGReportSummary {
  period: string;
  year?: number;
  environmental: {
    energy: {
      totalKwh: number;
      electricityKwh: number;
      gasM3: number;
      dieselLiter: number;
      totalCost: number;
      recordsCount: number;
    };
    water: {
      totalWithdrawalM3: number;
      groundwaterM3: number;
      municipalM3: number;
      rainwaterM3: number;
      recycledM3: number;
      avgWaterIntensity: number;
      recordsCount: number;
    };
    carbon: {
      scope1: number;
      scope2: number;
      scope3: number;
      totalEmissions: number;
      recordsCount: number;
    };
    waste: {
      totalInventoryItems: number;
      totalQuantityLogged: number;
      recycledRecordsCount: number;
      totalRecyclingRevenue: number;
    };
    chemicals: {
      totalInventory: number;
      zdhcLevel3: number;
      zdhcLevel2: number;
      zdhcLevel1: number;
      incheckSubmitted: number;
    };
  };
  socialAndGovernance: {
    complianceScore: number;
    openCAPs: number;
    closedCAPs: number;
    activeCommittees: number;
    activeLegalDocuments: number;
    suppliersCount: number;
    trainingsConducted: number;
  };
}

export interface IESGExportRow {
  section: string;
  kpi: string;
  value: string | number;
  unit: string;
  notes?: string;
}

export const reportsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getReportsSummary: builder.query<IESGReportSummary, { year?: number; month?: string } | void>({
      query: (params) => ({
        url: '/reports/summary',
        params: params || {},
      }),
      transformResponse: (response: { success: boolean; data: IESGReportSummary }) => response.data,
      providesTags: ['Dashboard', 'Energy', 'Water', 'Carbon', 'Compliance', 'Waste'],
    }),
    getReportsExportRows: builder.query<IESGExportRow[], { type?: string; year?: number; month?: string }>({
      query: (params) => ({
        url: '/reports/export',
        params,
      }),
      transformResponse: (response: { success: boolean; data: IESGExportRow[] }) => response.data,
    }),
  }),
});

export const {
  useGetReportsSummaryQuery,
  useLazyGetReportsExportRowsQuery,
} = reportsApi;
