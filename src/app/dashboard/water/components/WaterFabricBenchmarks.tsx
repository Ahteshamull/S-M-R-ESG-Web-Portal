"use client";

import React from "react";
import { Shirt, AlertTriangle, CheckCircle2 } from "lucide-react";

interface FabricBenchmarkItem {
  id: "denim" | "fabric_washing" | "garment";
  title: string;
  good: number;
  excellent: number;
  actual: number;
  unit: string;
  isBreached: boolean;
  isExcellent: boolean;
  isGood: boolean;
  excess: number;
  status: string;
  badgeColor: string;
}

interface WaterFabricBenchmarksProps {
  fabricBenchmarks: FabricBenchmarkItem[];
}

export const WaterFabricBenchmarks: React.FC<WaterFabricBenchmarksProps> = ({
  fabricBenchmarks,
}) => {
  return (
    <div className="bg-background/80 rounded-3xl p-6 md:p-8 border border-border/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold">5. Fabric-Wise Water Consumption (L/kg) &amp; Benchmark Standards</h3>
            <p className="text-xs text-muted-foreground">
              Internal Mill Intensity Thresholds — Denim, Fabric Washing &amp; Garments Units
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/60">
            Unit: Liters / Kg (L/kg)
          </span>
        </div>
      </div>

      {/* Standards Fall Alert Banner */}
      {fabricBenchmarks.some((f) => f.isBreached) ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3.5 text-rose-700 dark:text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-xs space-y-1">
            <p className="font-extrabold text-sm">
              ⚠️ Standards Fall Alert: Specific Fabric Lines Exceed Consumption Thresholds!
            </p>
            <p className="text-rose-600/90 dark:text-rose-300/90">
              High water intensity detected in:{" "}
              <span className="font-black underline">
                {fabricBenchmarks
                  .filter((f) => f.isBreached)
                  .map((f) => `${f.title} (${f.actual} L/kg, +${f.excess} L/kg excess)`)
                  .join(", ")}
              </span>
              . Immediate liquor ratio optimization and valve audit recommended.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Active Benchmarks Verified: All fabric washing processes are operating within standard tolerance limits.
          </span>
        </div>
      )}

      {/* 3 Process Benchmark Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fabricBenchmarks.map((item) => {
          const isGarment = item.id === "garment";
          return (
            <div
              key={item.id}
              className={`rounded-2xl p-6 border shadow-sm flex flex-col justify-between transition-all relative overflow-hidden ${
                item.isBreached
                  ? "bg-rose-500/[0.04] border-rose-500/40"
                  : "bg-background/90 border-border/70 hover:border-teal-500/40"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
                      Internal Mill Study
                    </span>
                    <h4 className="text-base font-extrabold text-foreground mt-0.5">{item.title}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.actual === 0 ? "No Logs" : item.isBreached ? "ALERT" : item.isExcellent ? "EXCELLENT" : "GOOD"}
                  </span>
                </div>

                <div className="pt-1 pb-2">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl md:text-4xl font-black ${
                        item.isBreached
                          ? "text-rose-600"
                          : item.actual > 0
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.actual > 0 ? item.actual.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{item.unit}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-medium mt-1">
                    Current Actual Water Intensity
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {isGarment ? "Excellent (Optimal)" : "Good Standard"}
                    </p>
                    <p className="text-sm font-extrabold text-foreground mt-0.5">
                      {isGarment ? item.excellent : item.good} <span className="text-[10px] font-normal text-muted-foreground">L/kg</span>
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">
                      {isGarment ? "Good Standard" : "Excellent Target"}
                    </p>
                    <p className="text-sm font-extrabold text-foreground mt-0.5">
                      {isGarment ? item.good : item.excellent} <span className="text-[10px] font-normal text-muted-foreground">L/kg</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className={`text-xs font-bold flex items-center gap-1.5 ${
                    item.isBreached ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
                  }`}>
                    {item.status}
                  </p>
                  {item.isBreached && (
                    <p className="text-[11px] text-rose-500 font-semibold mt-0.5">
                      Exceeds standard ceiling by +{item.excess} L/kg
                    </p>
                  )}
                  {isGarment && (
                    <p className="text-[10px] text-muted-foreground/80 italic mt-1">
                      Note: Reverse sequence — 46 L/kg represents optimal standard.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
