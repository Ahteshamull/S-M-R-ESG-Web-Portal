"use client";

import React from "react";
import { Droplets, Activity, Waves, CloudRain, ShieldCheck, Gauge, RefreshCw } from "lucide-react";
import { WaterKpis } from "../types";

interface WaterKpiCardsProps {
  kpis: WaterKpis;
}

export const WaterKpiCards: React.FC<WaterKpiCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {/* KPI 1: Total Withdrawal */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-3xl p-6 border border-blue-500/20 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-xs font-bold text-blue-800/80 dark:text-blue-300/80 uppercase tracking-wider">
              Total Withdrawal
            </span>
            <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-blue-700 to-cyan-500 dark:from-blue-300 dark:to-cyan-200 bg-clip-text text-transparent">
              {kpis.totalWithdrawal.toLocaleString()}{" "}
              <span className="text-sm font-semibold text-muted-foreground">m³</span>
            </h3>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <span className="text-emerald-600 font-black">🠗 5%</span> vs last month
            </div>
          </div>
          <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform">
            <Droplets className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* KPI 2: Water Intensity Metric */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent rounded-3xl p-6 border border-teal-500/20 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-all" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-xs font-bold text-teal-800/80 dark:text-teal-300/80 uppercase tracking-wider">
              Water Intensity Metric
            </span>
            <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-teal-700 to-emerald-500 dark:from-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">
              {kpis.waterIntensity}{" "}
              <span className="text-sm font-semibold text-muted-foreground">L / Kg</span>
            </h3>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold">
              <Gauge className="w-3.5 h-3.5" /> Performance: Optimal
            </div>
          </div>
          <div className="p-3.5 bg-teal-500/10 rounded-2xl text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* KPI 3: Groundwater Abstraction Ratio (%) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-6 border border-amber-500/20 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-xs font-bold text-amber-800/80 dark:text-amber-300/80 uppercase tracking-wider">
              Groundwater Abstraction
            </span>
            <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-amber-700 to-orange-500 dark:from-amber-300 dark:to-orange-200 bg-clip-text text-transparent">
              {kpis.gwRatio} <span className="text-sm font-semibold text-muted-foreground">%</span>
            </h3>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Regulatory Limit &le; 65%
            </div>
          </div>
          <div className="p-3.5 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 group-hover:scale-110 transition-transform">
            <Waves className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* KPI 4: Alternative Water Contribution */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl p-6 border border-emerald-500/20 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300/80 uppercase tracking-wider">
              Alternative Contribution
            </span>
            <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-emerald-700 to-teal-500 dark:from-emerald-300 dark:to-teal-200 bg-clip-text text-transparent">
              {kpis.altRatio} <span className="text-sm font-semibold text-muted-foreground">%</span>
            </h3>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <RefreshCw className="w-3.5 h-3.5" /> Circular Economy Driver
            </div>
          </div>
          <div className="p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
            <CloudRain className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};
