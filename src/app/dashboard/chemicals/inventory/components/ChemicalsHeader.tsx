"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FlaskConical,
  Download,
  Plus,
  Calendar,
  Filter,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { MONTH_OPTIONS } from "../types";

interface ChemicalsHeaderProps {
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  selectedZdhcFilter: string;
  setSelectedZdhcFilter: (val: string) => void;
  selectedHazardFilter: string;
  setSelectedHazardFilter: (val: string) => void;
  availableYears: string[];
  isAnyFilterActive: boolean;
  onResetFilters: () => void;
  onOpenCreate: () => void;
  onExportExcel: () => void;
}

export const ChemicalsHeader: React.FC<ChemicalsHeaderProps> = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedZdhcFilter,
  setSelectedZdhcFilter,
  selectedHazardFilter,
  setSelectedHazardFilter,
  availableYears,
  isAnyFilterActive,
  onResetFilters,
  onOpenCreate,
  onExportExcel,
}) => {
  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/chemicals"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2 gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Chemical Overview
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-600 border border-teal-500/20">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Chemical Inventory Register (CISS)
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                ZDHC MRSL Level 1-3 Compliance, GHS Hazards, Storage &amp; Safety Audit Registry
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportExcel}
            className="bg-background hover:bg-muted text-foreground border border-border px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center h-10 active:scale-95"
            title="Download formatted CISS Excel sheet"
          >
            <Download className="w-4 h-4 mr-1.5 text-emerald-600" /> Export Excel
          </button>
          <button
            onClick={onOpenCreate}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-teal-600/20 hover:shadow-teal-600/40 flex items-center h-10 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Log Chemical
          </button>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Month Filter */}
            <div className="flex items-center gap-1.5 bg-background border border-border/80 px-3 py-1.5 rounded-xl text-xs font-medium shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none cursor-pointer font-semibold"
                style={{ colorScheme: "dark" }}
              >
                {MONTH_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5 bg-background border border-border/80 px-3 py-1.5 rounded-xl text-xs font-medium shadow-xs">
              <Filter className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none cursor-pointer font-semibold"
                style={{ colorScheme: "dark" }}
              >
                <option value="ALL" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  All Years
                </option>
                {availableYears.map((yr) => (
                  <option
                    key={yr}
                    value={yr}
                    className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white"
                  >
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* ZDHC Filter */}
            <div className="flex items-center gap-1.5 bg-background border border-border/80 px-3 py-1.5 rounded-xl text-xs font-medium shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <select
                value={selectedZdhcFilter}
                onChange={(e) => setSelectedZdhcFilter(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none cursor-pointer font-semibold"
                style={{ colorScheme: "dark" }}
              >
                <option value="ALL" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  All ZDHC
                </option>
                <option value="Level-3" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Level-3 (Optimal)
                </option>
                <option value="Level-2" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Level-2
                </option>
                <option value="Level-1" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Level-1
                </option>
                <option value="None" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  None / Non-certified
                </option>
              </select>
            </div>

            {/* Hazard Filter */}
            <div className="flex items-center gap-1.5 bg-background border border-border/80 px-3 py-1.5 rounded-xl text-xs font-medium shadow-xs">
              <select
                value={selectedHazardFilter}
                onChange={(e) => setSelectedHazardFilter(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none cursor-pointer font-semibold"
                style={{ colorScheme: "dark" }}
              >
                <option value="ALL" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  All Hazard Types
                </option>
                <option value="Health" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Health Hazard
                </option>
                <option value="Physical" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Physical Hazard
                </option>
                <option value="Environmental" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Environmental Hazard
                </option>
                <option value="Any" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Any Hazard Present
                </option>
                <option value="Safe" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  Zero Hazards (Safe)
                </option>
              </select>
            </div>
          </div>

          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors shrink-0 self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
