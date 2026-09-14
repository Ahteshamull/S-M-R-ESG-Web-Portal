"use client";

import React from "react";
import {
  FileText,
  Building2,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  HeartPulse,
  Flame,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface ChemicalDetailsModalProps {
  viewingChemical: any | null;
  onClose: () => void;
}

export const ChemicalDetailsModal: React.FC<ChemicalDetailsModalProps> = ({
  viewingChemical,
  onClose,
}) => {
  if (!viewingChemical) return null;

  return (
    <Modal
      isOpen={Boolean(viewingChemical)}
      onClose={onClose}
      title={`Chemical Details: ${viewingChemical.chemicalName}`}
      maxWidthClass="max-w-4xl"
    >
      <div className="space-y-6 text-xs sm:text-sm">
        {/* Header summary banner */}
        <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-lg text-foreground">{viewingChemical.chemicalName}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {viewingChemical.functionOfChemical || viewingChemical.chemicalType || "Industrial Chemical"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full font-bold bg-teal-600 text-white shadow-sm">
              ZDHC: {viewingChemical.zdhcLevel || "None"}
            </span>
            <span className="text-xs px-3 py-1 rounded-full font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              CAS: {viewingChemical.casNo || "N/A"}
            </span>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purchase Details */}
          <div className="bg-muted/20 border border-border/60 rounded-2xl p-4 space-y-2.5">
            <h5 className="font-bold text-xs uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Purchase Information
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Date of Purchase:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.dateOfPurchase || viewingChemical.date || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Expiry Date:</span>
                <span className="font-semibold text-foreground">{viewingChemical.expiryDate || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Batch / Lot No.:</span>
                <span className="font-mono font-semibold text-foreground">
                  {viewingChemical.batchNo || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Quantity Purchased:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.quantityPurchased || viewingChemical.quantity || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Monthly Consumption:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.monthlyConsumption || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier & Manufacturer */}
          <div className="bg-muted/20 border border-border/60 rounded-2xl p-4 space-y-2.5">
            <h5 className="font-bold text-xs uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Supplier &amp; Manufacturer
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Supplier Name:</span>
                <span className="font-semibold text-foreground">{viewingChemical.supplierName || "—"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Original Label Received:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.labelAvailable || "Y"}
                </span>
              </div>
              <div className="py-1">
                <span className="text-muted-foreground block mb-1">Manufacturer &amp; Address:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.manufacturerName || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* MSDS & ZDHC */}
          <div className="bg-muted/20 border border-border/60 rounded-2xl p-4 space-y-2.5">
            <h5 className="font-bold text-xs uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> MSDS &amp; ZDHC Conformance
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Original MSDS:</span>
                <span className="font-semibold text-foreground">{viewingChemical.originalMsds || "Y"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Simplified MSDS:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.simplifiedMsds || "Y"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">MRSL Compliance Statement:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.mrslRslCompliance || "Y"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Certificate Name:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.certificateName || "None"}
                </span>
              </div>
              <div className="py-1">
                <span className="text-muted-foreground block mb-1">Active Ingredients:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.activeIngredients || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Hazards & Safety */}
          <div className="bg-muted/20 border border-border/60 rounded-2xl p-4 space-y-2.5">
            <h5 className="font-bold text-xs uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Hazards &amp; Safe Handling
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Health Hazard:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.healthHazard === "Yes"
                    ? `Yes (${viewingChemical.healthHazardType})`
                    : "No"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Physical Hazard:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.physicalHazard === "Yes"
                    ? `Yes (${viewingChemical.physicalHazardType})`
                    : "No"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Environmental Hazard:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.environmentalHazard === "Yes"
                    ? `Yes (${viewingChemical.environmentalHazardType})`
                    : "No"}
                </span>
              </div>
              <div className="py-1 border-b border-border/40">
                <span className="text-muted-foreground block mb-1">Recommended PPE:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.ppeRecommended || "—"}
                </span>
              </div>
              <div className="py-1">
                <span className="text-muted-foreground block mb-1">Storage Condition &amp; Location:</span>
                <span className="font-semibold text-foreground">
                  {viewingChemical.storageCondition || "—"} |{" "}
                  {viewingChemical.storageLocation || "Central Chemical Store"}
                </span>
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          {Array.isArray(viewingChemical.customFields) && viewingChemical.customFields.length > 0 && (
            <div className="bg-muted/20 border border-border/60 rounded-2xl p-4 space-y-2.5 md:col-span-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Additional Custom Attributes
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {viewingChemical.customFields.map((cf: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-background/60 border border-border/50">
                    <span className="text-[11px] text-muted-foreground block">{cf.fieldName}:</span>
                    <span className="font-bold text-foreground text-xs">{cf.fieldValue || "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audit Signoff Footer */}
        <div className="bg-muted/30 border border-border/60 rounded-2xl p-3.5 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-3">
          <div>
            Emergency Contact:{" "}
            <strong className="text-foreground">{viewingChemical.emergencyContact || "—"}</strong>
          </div>
          <div>
            Checked by:{" "}
            <strong className="text-foreground">{viewingChemical.checkedBy || "Verifier"}</strong> on{" "}
            <strong className="text-foreground">{viewingChemical.checkedOn || "—"}</strong>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
