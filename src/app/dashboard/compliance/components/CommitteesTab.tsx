"use client";

import React from "react";
import { Plus, Users, Calendar } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { getStatusBadge } from "../types";

interface CommitteesTabProps {
  committees: any[];
  isAddCommitteeModalOpen: boolean;
  setIsAddCommitteeModalOpen: (open: boolean) => void;
  onSaveCommittee: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const CommitteesTab: React.FC<CommitteesTabProps> = ({
  committees,
  isAddCommitteeModalOpen,
  setIsAddCommitteeModalOpen,
  onSaveCommittee,
}) => {
  return (
    <>
      <div className="glass-card rounded-2xl border border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-xl">
        <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-base sm:text-lg">Committee Management</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track worker participation and regulatory compliance committees.
            </p>
          </div>
          <button
            onClick={() => setIsAddCommitteeModalOpen(true)}
            className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold hover:underline flex items-center shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> New Committee
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr>
                <th className="p-4">Committee Name</th>
                <th className="p-4">Total Members</th>
                <th className="p-4">Last Meeting</th>
                <th className="p-4">Next Scheduled Meeting</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {committees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No active committees found. Click &ldquo;New Committee&rdquo; to establish one.
                  </td>
                </tr>
              ) : (
                committees.map((com: any, idx: number) => (
                  <tr
                    key={com._id || com.comId || com.id || `com-${idx}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-semibold text-foreground">{com.name}</td>
                    <td className="p-4 text-muted-foreground flex items-center">
                      <Users className="w-4 h-4 mr-1.5 opacity-70 shrink-0" /> {com.members}
                    </td>
                    <td className="p-4 text-muted-foreground">{com.lastMeeting}</td>
                    <td className="p-4 font-semibold flex items-center text-emerald-600 dark:text-emerald-500">
                      <Calendar className="w-4 h-4 mr-1.5 shrink-0" /> {com.nextMeeting}
                    </td>
                    <td className="p-4 flex justify-end">{getStatusBadge(com.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Committee Modal */}
      <Modal
        isOpen={isAddCommitteeModalOpen}
        onClose={() => setIsAddCommitteeModalOpen(false)}
        title="Form New Committee"
      >
        <form onSubmit={onSaveCommittee} className="space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
              Committee Name *
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Safety Committee (OSH)"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
              Total Members Count *
            </label>
            <input
              name="members"
              type="number"
              min="1"
              required
              placeholder="e.g. 12"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                Last Meeting Date *
              </label>
              <input
                name="lastMeeting"
                type="date"
                required
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                Next Scheduled Meeting *
              </label>
              <input
                name="nextMeeting"
                type="date"
                required
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsAddCommitteeModalOpen(false)}
              className="px-4 py-2 bg-muted text-foreground rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors"
            >
              Create Committee
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
