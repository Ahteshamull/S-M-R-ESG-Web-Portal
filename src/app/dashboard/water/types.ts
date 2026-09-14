export const SOURCING_COLORS = ["#3b82f6", "#0ea5e9", "#06b6d4", "#10b981", "#8b5cf6"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const YEARS = [2030, 2029, 2028, 2027, 2026, 2025, 2024];

export interface WaterKpis {
  totalWithdrawal: number;
  waterIntensity: number;
  gwRatio: number;
  altRatio: number;
  totalGroundwater: number;
  totalAlternative: number;
  count: number;
}

export interface DeptSummary {
  boiler: number;
  cooling: number;
  sanitation: number;
  dyeing: number;
  washing: number;
  printing: number;
  garmentsSteam: number;
  drinking: number;
  washrooms: number;
  canteen: number;
  garmentsTotal: number;
}

export interface CircularitySummary {
  ro: number;
  rain: number;
  avgSaving: string;
}

export interface ComplianceSummary {
  coverage: number;
  higgScore: number;
  licenseStatus: string;
}

export type WaterTabType = "summary" | "telemetry" | "benchmarks" | "compliance" | "portal";

