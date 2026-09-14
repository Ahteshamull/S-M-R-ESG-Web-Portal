"use client";

import React from "react";
import { Plus, FileText } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { getStatusBadge } from "../types";

interface LegalDocsTabProps {
  legalDocs: any[];
  isAddDocModalOpen: boolean;
  setIsAddDocModalOpen: (open: boolean) => void;
  onSaveDoc: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const LegalDocsTab: React.FC<LegalDocsTabProps> = ({
  legalDocs,
  isAddDocModalOpen,
  setIsAddDocModalOpen,
  onSaveDoc,
}) => {
  return (
    <>
      <div className="glass-card rounded-2xl border border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-xl">
        <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-base sm:text-lg">Legal Permits &amp; Certificates</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Track validity and renewal dates for all mandatory factory licenses.
            </p>
          </div>
          <button
            onClick={() => setIsAddDocModalOpen(true)}
            className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold hover:underline flex items-center shrink-0"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Document
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr>
                <th className="p-4">Document Name</th>
                <th className="p-4">Authority</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {legalDocs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No legal permits or certificates found. Click &ldquo;Add Document&rdquo; to add a license.
                  </td>
                </tr>
              ) : (
                legalDocs.map((doc: any, idx: number) => (
                  <tr
                    key={doc._id || doc.docId || doc.id || `doc-${idx}`}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="p-4 font-semibold text-foreground flex items-center">
                      <FileText className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
                      <span className="truncate max-w-xs">{doc.name}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{doc.authority}</td>
                    <td className="p-4 text-muted-foreground">{doc.issueDate}</td>
                    <td className="p-4 font-semibold text-foreground">{doc.expiryDate}</td>
                    <td className="p-4 flex justify-end">{getStatusBadge(doc.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      <Modal
        isOpen={isAddDocModalOpen}
        onClose={() => setIsAddDocModalOpen(false)}
        title="Add Legal Permit or Certificate"
      >
        <form onSubmit={onSaveDoc} className="space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
              Document Name *
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Environmental Clearance Certificate (ECC)"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
              Issuing Authority *
            </label>
            <input
              name="authority"
              type="text"
              required
              placeholder="e.g. Department of Environment (DOE)"
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                Issue Date *
              </label>
              <input
                name="issueDate"
                type="date"
                required
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                Expiry Date *
              </label>
              <input
                name="expiryDate"
                type="date"
                required
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsAddDocModalOpen(false)}
              className="px-4 py-2 bg-muted text-foreground rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors"
            >
              Upload Document
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
