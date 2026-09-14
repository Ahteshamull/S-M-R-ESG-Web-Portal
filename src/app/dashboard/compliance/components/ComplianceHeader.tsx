"use client";

import React from "react";
import {
  Download,
  Plus,
  ShieldAlert,
  FileWarning,
  CheckCircle2,
  Users,
  Scale,
  FileBadge,
  Award,
  ShieldCheck,
} from "lucide-react";
import { TabType } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ComplianceHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenFindingModal: () => void;
  onDownloadReport: () => void;
  openCapsCount?: number;
  expiringPermitsCount?: number;
  closedFindingsCount?: number;
  activeCommitteesCount?: number;
}

export const ComplianceHeader: React.FC<ComplianceHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenFindingModal,
  onDownloadReport,
  openCapsCount = 12,
  expiringPermitsCount = 2,
  closedFindingsCount = 45,
  activeCommitteesCount = 3,
}) => {
  const tabs = [
    { id: "audits", label: "Audit & CAP", icon: Scale },
    { id: "legal", label: "Legal & Documents", icon: FileBadge },
    { id: "committees", label: "Committees", icon: Users },
    { id: "reports", label: "Audit Reports & Certifications", icon: Award },
    { id: "suppliers", label: "Supplier Assessment, Approval & Tracking", icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Compliance &amp; Audits
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage CAPs, Legal Permits, and Committees seamlessly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onDownloadReport}
            className="bg-white dark:bg-zinc-900 border border-border text-foreground px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Report
          </button>
          <button
            onClick={onOpenFindingModal}
            className="bg-emerald-600 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-all flex items-center shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-1" /> Log Finding
          </button>
        </div>
      </div>

      {/* Top 4 Responsive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-red-500 hover:shadow-lg transition-all relative overflow-hidden group bg-card/60 backdrop-blur-xl border border-border/50">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <ShieldAlert className="w-4 h-4 mr-1.5 text-red-500" /> Open CAPs
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">{openCapsCount}</h3>
              <p className="text-xs text-red-500 mt-2 font-medium">3 Overdue</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-yellow-500 hover:shadow-lg transition-all relative overflow-hidden group bg-card/60 backdrop-blur-xl border border-border/50">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <FileWarning className="w-4 h-4 mr-1.5 text-yellow-500" /> Expiring Permits
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">{expiringPermitsCount}</h3>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 font-medium">In next 30 days</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all relative overflow-hidden group bg-card/60 backdrop-blur-xl border border-border/50">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" /> Closed Findings
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">{closedFindingsCount}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2 font-medium">This year (78% completion)</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border-l-4 border-l-blue-500 hover:shadow-lg transition-all relative overflow-hidden group bg-card/60 backdrop-blur-xl border border-border/50">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-blue-500" /> Active Committees
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 text-foreground">{activeCommitteesCount}</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">1 meeting pending this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto border-b border-border mb-4 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-4 sm:px-5 py-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap flex items-center shrink-0",
              activeTab === tab.id
                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 shadow-[0_-2px_10px_rgba(16,185,129,0.5)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
