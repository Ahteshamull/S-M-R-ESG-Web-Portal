"use client";

import React from "react";
import { Table2, Plus, Droplets, Eye, Trash2 } from "lucide-react";

interface WaterRecordTableProps {
  filteredLogs: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenLogModal: () => void;
  onSelectRecord: (record: any) => void;
  onDeleteRecord: (id: string, month: string) => void;
}

export const WaterRecordTable: React.FC<WaterRecordTableProps> = ({
  filteredLogs,
  searchQuery,
  setSearchQuery,
  onOpenLogModal,
  onSelectRecord,
  onDeleteRecord,
}) => {
  return (
    <div className="bg-background rounded-3xl border border-border/70 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-50/40 dark:bg-teal-950/20">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Table2 className="w-5 h-5 text-teal-600" /> 9. Water Consumption Record — Portal
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Detailed historical logs, department allocations, and audit verification records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search month or goods..."
            className="bg-background border border-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-44 sm:w-56"
          />
          <button
            onClick={onOpenLogModal}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead className="bg-muted/40 text-muted-foreground font-semibold">
            <tr>
              <th className="px-4 py-3.5 text-left border-r border-b border-border">Period</th>
              <th className="px-3 py-3.5 border-r border-b border-border text-blue-700 dark:text-blue-300">
                Total Withdrawal (m³)
              </th>
              <th className="px-3 py-3.5 border-r border-b border-border">Groundwater (m³)</th>
              <th className="px-3 py-3.5 border-r border-b border-border">WASA/Municipal (m³)</th>
              <th className="px-3 py-3.5 border-r border-b border-border">Rainwater (m³)</th>
              <th className="px-3 py-3.5 border-r border-b border-border">Recycle (m³)</th>
              <th className="px-3 py-3.5 border-r border-b border-border text-emerald-700 dark:text-emerald-300">
                Production (m³)
              </th>
              <th className="px-3 py-3.5 border-r border-b border-border">Domestic (m³)</th>
              <th className="px-3 py-3.5 border-r border-b border-border text-teal-700 dark:text-teal-300">
                Intensity (L/Kg)
              </th>
              <th className="px-3 py-3.5 border-r border-b border-border">Audit Status</th>
              <th className="px-3 py-3.5 border-b border-border text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-medium">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-muted-foreground">
                  <Droplets className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  No water consumption logs found for the selected filter. Click &ldquo;New Entry&rdquo; to add a new record.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log: any) => {
                const tw = Number(log.totalWithdrawal) || 0;
                const gw = Number(log.sources?.groundwater) || 0;
                const warpo = Number(log.sources?.warpoDwasa) || 0;
                const rain = Number(log.sources?.rainWater) || 0;
                const recycle = Number(log.sources?.recycleWater) || 0;
                const intensity = log.waterIntensity ?? (log.productionKg > 0 ? ((tw * 1000) / log.productionKg).toFixed(1) : "0.0");

                return (
                  <tr key={log._id || log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3.5 text-left font-bold border-r border-border">
                      {log.month} {log.year || 2026}
                    </td>
                    <td className="px-3 py-3.5 font-black text-blue-700 dark:text-blue-300 border-r border-border text-sm">
                      {tw.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border font-semibold text-muted-foreground">
                      {gw.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border text-muted-foreground">
                      {warpo.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border text-cyan-600 font-bold">
                      {rain.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border text-emerald-600 font-bold">
                      {recycle.toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border font-bold text-emerald-700 dark:text-emerald-400">
                      {(log.totalProduction || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border font-semibold text-muted-foreground">
                      {(log.domestic || 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border font-extrabold text-teal-600">
                      {intensity}
                    </td>
                    <td className="px-3 py-3.5 border-r border-border">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        Verified
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onSelectRecord(log)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(log._id || log.id, log.month)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
