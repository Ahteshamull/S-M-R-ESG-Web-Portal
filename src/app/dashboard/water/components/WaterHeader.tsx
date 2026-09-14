"use client";

import React from "react";
import {
  ShieldCheck,
  Calendar,
  Filter,
  Building2,
  Printer,
  Download,
  Plus,
  Activity,
  Table2,
  Gauge,
  Shirt,
} from "lucide-react";
import { MONTHS, YEARS, WaterTabType } from "../types";

interface WaterHeaderProps {
  selectedYear: number | "All";
  setSelectedYear: (year: number | "All") => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedPlant: string;
  setSelectedPlant: (plant: string) => void;
  activeTab: WaterTabType;
  setActiveTab: (tab: WaterTabType) => void;
  onPrintPdf: () => void;
  onExportExcel: () => void;
  onOpenLogModal: () => void;
}

export const WaterHeader: React.FC<WaterHeaderProps> = ({
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedPlant,
  setSelectedPlant,
  activeTab,
  setActiveTab,
  onPrintPdf,
  onExportExcel,
  onOpenLogModal,
}) => {
  const tabs: { id: WaterTabType; label: string; icon: any }[] = [
    { id: "summary", label: "Executive Summary & Sourcing", icon: Activity },
    { id: "telemetry", label: "Factory IoT & Telemetry", icon: Gauge },
    { id: "benchmarks", label: "Fabric Benchmarks", icon: Shirt },
    { id: "compliance", label: "Compliance & Flowmeters", icon: ShieldCheck },
    { id: "portal", label: "Historical Records (Portal)", icon: Table2 },
  ];

  return (
    <div className="bg-gradient-to-r from-teal-950/20 via-background to-emerald-950/20 p-5 sm:p-6 md:p-7 rounded-3xl border border-teal-500/20 backdrop-blur-2xl shadow-xl relative overflow-hidden space-y-5">
      <div className="absolute -left-12 -top-12 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top row: Title + Actions */}
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" /> Bureau Veritas &amp; Higg FEM Standards
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-500 dark:from-teal-300 dark:via-emerald-300 dark:to-cyan-200 bg-clip-text text-transparent">
            Enterprise Water Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center gap-2">
            <span>MG Shirtex Sustainability Tracker</span>
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
            <span className="text-teal-600 dark:text-teal-400 font-semibold">{selectedPlant}</span>
          </p>
        </div>

        {/* Quick Filter Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/80 shadow-xs text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                All Years
              </option>
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/80 shadow-xs text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                All Months
              </option>
              {MONTHS.map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Facilities Selector */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/80 shadow-xs text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
              style={{ colorScheme: "dark" }}
            >
              <option value="Plot 104-106, DEPZ Extension" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                Plot 104-106, DEPZ Extension
              </option>
              <option value="All Facilities" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                All Facilities
              </option>
              <option value="Washing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                Washing
              </option>
              <option value="Dyeing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                Dyeing
              </option>
              <option value="Printing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                Printing
              </option>
              <option value="Utility" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                Utility
              </option>
              <option value="Garments (Cut to Pack)" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                Garments (Cut to Pack)
              </option>
            </select>
          </div>

          {/* Action Buttons */}
          <button
            onClick={onPrintPdf}
            className="bg-background/90 hover:bg-muted text-foreground border border-border/80 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center h-9 active:scale-95"
            title="Print or Export PDF Report"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-teal-600" /> PDF
          </button>

          <button
            onClick={onExportExcel}
            className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center h-9 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Excel
          </button>

          <button
            onClick={onOpenLogModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center h-9 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Log Data
          </button>
        </div>
      </div>

      {/* 5 Segmented Clean Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pt-2 border-t border-border/40 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-teal-600 text-white shadow-md shadow-teal-500/20 scale-[1.02]"
                  : "bg-background/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
