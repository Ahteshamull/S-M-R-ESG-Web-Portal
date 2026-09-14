"use client";

import React from "react";
import { RefreshCw, RotateCcw, CloudRain, Sparkles } from "lucide-react";
import { CircularitySummary } from "../types";

interface WaterCircularitySectionProps {
  circularitySummary: CircularitySummary;
}

export const WaterCircularitySection: React.FC<WaterCircularitySectionProps> = ({
  circularitySummary,
}) => {
  return (
    <div className="bg-gradient-to-r from-emerald-950/20 via-background to-teal-950/20 rounded-3xl p-6 md:p-8 border border-emerald-500/20 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-border/40 pb-5">
        <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">6. Circularity &amp; Water Savings Initiatives</h3>
          <p className="text-xs text-muted-foreground">Closed-Loop Recycling, Rainwater Harvesting &amp; Machine Optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* RO Water Recycling */}
        <div className="p-6 rounded-2xl bg-background/70 border border-emerald-500/30 shadow-sm relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">RO Water Recycling Plant</h4>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{circularitySummary.ro.toLocaleString()}</span>
            <span className="text-xs font-bold text-muted-foreground">m³ Reused</span>
          </div>
          <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-2 font-semibold">
            ↪ Passes Back to Dyeing Process
          </p>
          <div className="mt-4 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 inline-block">
            Recycled closed-loop supply
          </div>
        </div>

        {/* Rain Water Harvesting */}
        <div className="p-6 rounded-2xl bg-background/70 border border-cyan-500/30 shadow-sm relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 mb-4 group-hover:scale-110 transition-transform">
            <CloudRain className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">Rain Water Harvesting System</h4>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-cyan-600">{circularitySummary.rain.toLocaleString()}</span>
            <span className="text-xs font-bold text-muted-foreground">m³ Collected</span>
          </div>
          <p className="text-xs text-cyan-700/80 dark:text-cyan-300/80 mt-2 font-semibold">
            ↪ Used for Toilet Flush &amp; Gardening
          </p>
          <div className="mt-4 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 inline-block">
            Preserves Deep Aquifer
          </div>
        </div>

        {/* Low Liquor Ratio Machine */}
        <div className="p-6 rounded-2xl bg-background/70 border border-blue-500/30 shadow-sm relative overflow-hidden group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">Low Liquor Ratio Dyeing Machine</h4>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">Save {circularitySummary.avgSaving}</span>
            <span className="text-xs font-bold text-muted-foreground">Liters / Kg</span>
          </div>
          <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-2 font-semibold">
            ↪ Eco-optimization Achieved
          </p>
          <div className="mt-4 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 inline-block">
            High-Efficiency Liquor Circulation
          </div>
        </div>
      </div>
    </div>
  );
};
