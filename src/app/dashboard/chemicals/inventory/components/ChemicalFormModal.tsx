"use client";

import React, { useState } from "react";
import {
  Calendar,
  Building2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Boxes,
  Plus,
  Trash2,
  HeartPulse,
  Flame,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { ChemicalFormData, FormTab } from "../types";

interface ChemicalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: "create" | "edit";
  formData: ChemicalFormData;
  setFormData: React.Dispatch<React.SetStateAction<ChemicalFormData>>;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSaving: boolean;
}

export const ChemicalFormModal: React.FC<ChemicalFormModalProps> = ({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  onSubmit,
  isSaving,
}) => {
  const [currentTab, setCurrentTab] = useState<FormTab>("purchase");

  // Custom Field Sub-modal
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newCustomFieldName, setNewCustomFieldName] = useState("");
  const [newCustomFieldType, setNewCustomFieldType] = useState<"text" | "number" | "date" | "boolean">("text");
  const [newCustomFieldValue, setNewCustomFieldValue] = useState("");

  const handleInputChange = (field: keyof ChemicalFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomField = () => {
    const trimmedName = newCustomFieldName.trim();
    if (!trimmedName) {
      toast.error("Please enter a field name.");
      return;
    }

    const exists = formData.customFields.some(
      (cf) => cf.fieldName.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      toast.error(`Field "${trimmedName}" already exists.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        {
          fieldName: trimmedName,
          fieldValue: newCustomFieldValue,
          fieldType: newCustomFieldType,
        },
      ],
    }));

    setIsAddFieldModalOpen(false);
    setNewCustomFieldName("");
    setNewCustomFieldValue("");
    setCurrentTab("custom");
    toast.success(`Custom field "${trimmedName}" added!`);
  };

  const handleUpdateCustomFieldName = (index: number, newName: string) => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], fieldName: newName };
      return { ...prev, customFields: updated };
    });
  };

  const handleUpdateCustomFieldType = (
    index: number,
    newType: "text" | "number" | "date" | "boolean"
  ) => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], fieldType: newType };
      return { ...prev, customFields: updated };
    });
  };

  const handleUpdateCustomFieldValue = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], fieldValue: value };
      return { ...prev, customFields: updated };
    });
  };

  const handleRemoveCustomField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
    toast.success("Custom field removed");
  };

  const tabs: { id: FormTab; label: string; icon: any }[] = [
    { id: "purchase", label: "General & Purchase", icon: Calendar },
    { id: "supplier", label: "Supplier & Maker", icon: Building2 },
    { id: "msds", label: "MSDS & Ingredients", icon: FileText },
    { id: "zdhc", label: "ZDHC MRSL", icon: ShieldCheck },
    { id: "hazard", label: "GHS Hazards", icon: ShieldAlert },
    { id: "storage", label: "Storage & Signoff", icon: Boxes },
    { id: "custom", label: `Custom Fields (${formData.customFields.length})`, icon: Layers },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={modalMode === "create" ? "Add Chemical to Inventory (CISS)" : "Edit Chemical Record"}
        maxWidthClass="max-w-4xl"
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-border gap-1.5 pb-2 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-all ${
                    isActive
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: General & Purchase */}
          {currentTab === "purchase" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Chemical Name / Commercial Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Acetone, Reactive Blue 21"
                    value={formData.chemicalName}
                    onChange={(e) => handleInputChange("chemicalName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Inventory / Log Date (For Monthly Filtering)
                  </label>
                  <input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Date of Purchase</label>
                  <input
                    type="date"
                    value={formData.dateOfPurchase}
                    onChange={(e) => handleInputChange("dateOfPurchase", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Batch Number / Lot No.</label>
                  <input
                    type="text"
                    placeholder="e.g., 45879346822"
                    value={formData.batchNo}
                    onChange={(e) => handleInputChange("batchNo", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Quantity Purchased &amp; Stock</label>
                  <input
                    type="text"
                    placeholder="e.g., Stock-320 Ltr / 400 Ltr"
                    value={formData.quantityPurchased}
                    onChange={(e) => handleInputChange("quantityPurchased", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Name of Production Unit</label>
                  <input
                    type="text"
                    value={formData.productionUnit}
                    onChange={(e) => handleInputChange("productionUnit", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Name of Process</label>
                  <input
                    type="text"
                    value={formData.processName}
                    onChange={(e) => handleInputChange("processName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Supplier & Maker */}
          {currentTab === "supplier" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Name of Chemical Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g., Adory Enterprise"
                    value={formData.supplierName}
                    onChange={(e) => handleInputChange("supplierName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Name of Chemical Manufacturer &amp; Address
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., ChemStation Asia Pte. Ltd., 19 Tanjong Penjuru, Singapore"
                    value={formData.manufacturerName}
                    onChange={(e) => handleInputChange("manufacturerName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Original Label Received from Supplier Available?
                  </label>
                  <select
                    value={formData.labelAvailable}
                    onChange={(e) => handleInputChange("labelAvailable", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="Y">Y (Yes)</option>
                    <option value="N">N (No)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MSDS & Ingredients */}
          {currentTab === "msds" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Original MSDS Available?</label>
                  <select
                    value={formData.originalMsds}
                    onChange={(e) => handleInputChange("originalMsds", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="Y">Y (Yes)</option>
                    <option value="N">N (No)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Simplified / Local Language MSDS Available?
                  </label>
                  <select
                    value={formData.simplifiedMsds}
                    onChange={(e) => handleInputChange("simplifiedMsds", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="Y">Y (Yes)</option>
                    <option value="N">N (No)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">CAS Number</label>
                  <input
                    type="text"
                    placeholder="e.g., 67-64-1"
                    value={formData.casNo}
                    onChange={(e) => handleInputChange("casNo", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Chemical Type / Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Organic Solvent, Disperse Dye"
                    value={formData.chemicalType}
                    onChange={(e) => handleInputChange("chemicalType", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Chemical Constituents / Active Ingredients (as per MSDS)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Acetone &gt;99.5%, Water &lt;0.5%"
                    value={formData.activeIngredients}
                    onChange={(e) => handleInputChange("activeIngredients", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ZDHC MRSL */}
          {currentTab === "zdhc" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">ZDHC MRSL Level</label>
                  <select
                    value={formData.zdhcLevel}
                    onChange={(e) => handleInputChange("zdhcLevel", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="None">None / Not Certified</option>
                    <option value="Level-1">Level-1</option>
                    <option value="Level-2">Level-2</option>
                    <option value="Level-3">Level-3 (Optimal)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    MRSL / RSL Conformance Status
                  </label>
                  <select
                    value={formData.mrslRslCompliance}
                    onChange={(e) => handleInputChange("mrslRslCompliance", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  >
                    <option value="Y">Y (Compliant)</option>
                    <option value="N">N (Non-compliant)</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Certificate / Third-Party Body Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., OEKO-TEX Eco Passport, bluesign, GOTS"
                    value={formData.certificateName}
                    onChange={(e) => handleInputChange("certificateName", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GHS Hazards */}
          {currentTab === "hazard" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Health Hazard */}
              <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    Health Hazard
                  </label>
                  <select
                    value={formData.healthHazard}
                    onChange={(e) => handleInputChange("healthHazard", e.target.value)}
                    className="bg-background border border-border rounded-xl px-3 py-1 text-xs font-semibold"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.healthHazard === "Yes" && (
                  <input
                    type="text"
                    placeholder="Specific Health Hazard Type (e.g., Highly Flammable / Skin Irritant)"
                    value={formData.healthHazardType}
                    onChange={(e) => handleInputChange("healthHazardType", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                )}
              </div>

              {/* Physical Hazard */}
              <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    Physical Hazard
                  </label>
                  <select
                    value={formData.physicalHazard}
                    onChange={(e) => handleInputChange("physicalHazard", e.target.value)}
                    className="bg-background border border-border rounded-xl px-3 py-1 text-xs font-semibold"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.physicalHazard === "Yes" && (
                  <input
                    type="text"
                    placeholder="Specific Physical Hazard Type (e.g., Irritating to eyes, vapor explosion)"
                    value={formData.physicalHazardType}
                    onChange={(e) => handleInputChange("physicalHazardType", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}
              </div>

              {/* Environmental Hazard */}
              <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-blue-500" />
                    Environmental Hazard
                  </label>
                  <select
                    value={formData.environmentalHazard}
                    onChange={(e) => handleInputChange("environmentalHazard", e.target.value)}
                    className="bg-background border border-border rounded-xl px-3 py-1 text-xs font-semibold"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
                {formData.environmentalHazard === "Yes" && (
                  <input
                    type="text"
                    placeholder="Specific Env Hazard Type (e.g., Toxic to aquatic life with long lasting effects)"
                    value={formData.environmentalHazardType}
                    onChange={(e) => handleInputChange("environmentalHazardType", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Storage & Sign-off */}
          {currentTab === "storage" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Function of Chemical</label>
                  <input
                    type="text"
                    placeholder="e.g., Spot remover, Dyeing agent"
                    value={formData.functionOfChemical}
                    onChange={(e) => handleInputChange("functionOfChemical", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Area of Use</label>
                  <input
                    type="text"
                    placeholder="e.g., Cleaning garments in sewing floor"
                    value={formData.useArea}
                    onChange={(e) => handleInputChange("useArea", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Personal Protective Equipment (PPE) Recommended
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Filter Mask; Hand Gloves; Goggles; Apron"
                    value={formData.ppeRecommended}
                    onChange={(e) => handleInputChange("ppeRecommended", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Storage Condition</label>
                  <input
                    type="text"
                    placeholder="e.g., Adequate Ventilation, store in cool area"
                    value={formData.storageCondition}
                    onChange={(e) => handleInputChange("storageCondition", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Location of Storage</label>
                  <input
                    type="text"
                    placeholder="e.g., Chemical Store / Rack 04"
                    value={formData.storageLocation}
                    onChange={(e) => handleInputChange("storageLocation", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Monthly Consumption</label>
                  <input
                    type="text"
                    placeholder="e.g., 320 Ltr / month"
                    value={formData.monthlyConsumption}
                    onChange={(e) => handleInputChange("monthlyConsumption", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="e.g., Md. Saiful Manager (HR) 01755639073"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Checked By</label>
                  <input
                    type="text"
                    placeholder="e.g., Khan Shehabuddin Jr. Executive"
                    value={formData.checkedBy}
                    onChange={(e) => handleInputChange("checkedBy", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Checked On (Date)</label>
                  <input
                    type="date"
                    value={formData.checkedOn}
                    onChange={(e) => handleInputChange("checkedOn", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-foreground">Remarks / Observations</label>
                  <textarea
                    rows={2}
                    placeholder="Any audit compliance notes or instructions..."
                    value={formData.remarks}
                    onChange={(e) => handleInputChange("remarks", e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Custom Fields */}
          {currentTab === "custom" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Dynamic Custom Attributes</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Add custom factory or brand-specific fields to this chemical record
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddFieldModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Field
                </button>
              </div>

              {formData.customFields.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
                  No custom attributes added yet. Click &ldquo;Add Field&rdquo; to define new columns.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {formData.customFields.map((cf, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted/20 border border-border rounded-xl flex items-center gap-3"
                    >
                      <input
                        type="text"
                        value={cf.fieldName}
                        onChange={(e) => handleUpdateCustomFieldName(idx, e.target.value)}
                        placeholder="Field Name"
                        className="w-1/3 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-bold"
                      />
                      <select
                        value={cf.fieldType}
                        onChange={(e) => handleUpdateCustomFieldType(idx, e.target.value as any)}
                        className="w-24 bg-background border border-border rounded-lg px-2 py-1.5 text-xs"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="boolean">Boolean</option>
                      </select>
                      <input
                        type={cf.fieldType === "date" ? "date" : cf.fieldType === "number" ? "number" : "text"}
                        value={cf.fieldValue}
                        onChange={(e) => handleUpdateCustomFieldValue(idx, e.target.value)}
                        placeholder="Field Value"
                        className="flex-1 bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomField(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        title="Remove Field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form Footer */}
          <div className="pt-4 flex items-center justify-between border-t border-border mt-6">
            <div className="flex gap-2">
              {currentTab !== "purchase" && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = tabs.findIndex((t) => t.id === currentTab);
                    if (idx > 0) setCurrentTab(tabs[idx - 1].id);
                  }}
                  className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous Tab
                </button>
              )}
              {currentTab !== "custom" && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = tabs.findIndex((t) => t.id === currentTab);
                    if (idx < tabs.length - 1) setCurrentTab(tabs[idx + 1].id);
                  }}
                  className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  Next Tab <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : modalMode === "create" ? "Add to Inventory" : "Update Chemical"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Mini Modal: Add Custom Field */}
      <Modal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        title="Add Custom Chemical Attribute"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Field Label / Name *</label>
            <input
              type="text"
              placeholder="e.g., pH Value, Boiling Point, Flash Point"
              value={newCustomFieldName}
              onChange={(e) => setNewCustomFieldName(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Field Type</label>
            <select
              value={newCustomFieldType}
              onChange={(e) => setNewCustomFieldType(e.target.value as any)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs"
            >
              <option value="text">Text (String)</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Boolean (Yes / No)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Initial Value (Optional)</label>
            <input
              type="text"
              placeholder="e.g., 56 °C"
              value={newCustomFieldValue}
              onChange={(e) => setNewCustomFieldValue(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsAddFieldModalOpen(false)}
              className="px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
            >
              Add Field
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
