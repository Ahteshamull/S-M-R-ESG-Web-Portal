"use client";

import React from "react";
import { Boxes, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";

interface ChemicalsKpisProps {
  totalCount: number;
  zdhcCount: number;
  screenCount: number;
  withoutCertCount: number;
}

export const ChemicalsKpis: React.FC<ChemicalsKpisProps> = ({
  totalCount,
  zdhcCount,
  screenCount,
  withoutCertCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* KPI 1 */}
      <div className="glass-card rounded-2xl p-5 border border-border/70 bg-card/60 backdrop-blur-xl relative overflow-hidden group hover:shadow-lg transition-all">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-teal-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Chemicals (CISS)
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mt-1 text-foreground">{totalCount}</h3>
            <p className="text-[11px] text-teal-600 font-semibold mt-1">Active registered inventory</p>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl ring-1 ring-teal-500/20">
            <Boxes className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="glass-card rounded-2xl p-5 border border-border/70 bg-card/60 backdrop-blur-xl relative overflow-hidden group hover:shadow-lg transition-all">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              ZDHC MRSL Level 1-3
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mt-1 text-blue-600 dark:text-blue-400">
              {zdhcCount}
            </h3>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              {totalCount > 0 ? Math.round((zdhcCount / totalCount) * 100) : 0}% MRSL Compliant
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl ring-1 ring-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="glass-card rounded-2xl p-5 border border-border/70 bg-card/60 backdrop-blur-xl relative overflow-hidden group hover:shadow-lg transition-all">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Screened / Eco-Certified
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-400">
              {screenCount}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">Level-3 / Verified Safe</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl ring-1 ring-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="glass-card rounded-2xl p-5 border border-border/70 bg-card/60 backdrop-blur-xl relative overflow-hidden group hover:shadow-lg transition-all">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Non-Certified / Review
            </p>
            <h3 className="text-2xl sm:text-3xl font-black mt-1 text-amber-600 dark:text-amber-400">
              {withoutCertCount}
            </h3>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">Requires audit / certificate</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl ring-1 ring-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
