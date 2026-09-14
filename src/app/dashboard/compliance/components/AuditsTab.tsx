"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { getSeverityBadge, getStatusBadge } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AuditsTabProps {
  caps: any[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSaveFinding: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const AuditsTab: React.FC<AuditsTabProps> = ({
  caps,
  isModalOpen,
  setIsModalOpen,
  onSaveFinding,
}) => {
  return (
    <>
      <div className="glass-card rounded-2xl border border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-xl">
        <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-base sm:text-lg">Corrective Action Plan (CAP) Tracker</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Manage and track resolutions for all internal and external audit findings.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr>
                <th className="p-4">CAP ID</th>
                <th className="p-4">Issue / Finding</th>
                <th className="p-4">Audit Type</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Deadline</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {caps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No CAP findings logged yet. Click &ldquo;Log Finding&rdquo; to add a new CAP.
                  </td>
                </tr>
              ) : (
                caps.map((cap: any, idx: number) => (
                  <tr
                    key={cap._id || cap.capId || cap.id || `cap-${idx}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-mono text-xs text-muted-foreground">
                      {cap.capId || cap.id || cap._id || `CAP-00${idx + 1}`}
                    </td>
                    <td className="p-4 font-semibold text-foreground max-w-xs truncate" title={cap.issue}>
                      {cap.issue}
                    </td>
                    <td className="p-4 text-muted-foreground">{cap.type || cap.auditType}</td>
                    <td className="p-4">{getSeverityBadge(cap.severity)}</td>
                    <td
                      className={cn(
                        "p-4 font-semibold",
                        cap.status === "Overdue" ? "text-red-500" : "text-foreground"
                      )}
                    >
                      {cap.deadline}
                    </td>
                    <td className="p-4 flex justify-end">{getStatusBadge(cap.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Finding / CAP Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Audit Finding & Action Plan">
        <form onSubmit={onSaveFinding} className="space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">Issue / Finding *</label>
            <input
              name="issue"
              type="text"
              required
              placeholder="e.g. Blocked fire exits on Floor 2"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">Audit Type</label>
              <select
                name="auditType"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Internal Audit">Internal Audit</option>
                <option value="Buyer Social (BSCI)">Buyer Social (BSCI)</option>
                <option value="Environmental (Higg FEM)">Environmental (Higg FEM)</option>
                <option value="Fire & Electrical Safety">Fire &amp; Electrical Safety</option>
              </select>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">Severity</label>
              <select
                name="severity"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">Target Deadline *</label>
              <input
                name="deadline"
                type="date"
                required
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">Assignee / Dept</label>
              <input
                name="assignee"
                type="text"
                placeholder="e.g. Safety Team"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-muted text-foreground rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors"
            >
              Save Finding
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
