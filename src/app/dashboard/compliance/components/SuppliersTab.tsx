"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  RefreshCw,
  Edit3,
  ShieldCheck,
  Save,
  Search,
  X,
  Plus,
  Printer,
  Download,
  Trash2,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { ISupplierRecord, IAssessmentItem } from "@/lib/redux/slices/complianceApi";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SuppliersTabProps {
  suppliersList: ISupplierRecord[];
  isSuppliersLoading: boolean;
  refetchSuppliers: () => void;
  onCreateSupplier: (payload: any) => Promise<any>;
  onUpdateSupplier: (id: string, payload: any) => Promise<any>;
  onDeleteSupplier: (id: string) => Promise<any>;
}

export const SuppliersTab: React.FC<SuppliersTabProps> = ({
  suppliersList,
  isSuppliersLoading,
  refetchSuppliers,
  onCreateSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}) => {
  const [supplierSubView, setSupplierSubView] = useState<"form" | "dashboard">("form");
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const initialSupplierForm = {
    supplierName: "",
    businessType: "Manufacturer",
    address: "",
    productCategory: "Dyes & Chemicals",
    contactPerson: "",
    tradeLicenseNo: "",
    phone: "",
    email: "",
  };
  const [supplierForm, setSupplierForm] = useState(initialSupplierForm);

  const initialAssessmentRow: IAssessmentItem = {
    standard: "ZDHC MRSL",
    auditType: "Initial",
    auditDate: new Date().toISOString().split("T")[0],
    score: 90,
    certValidUntil: "",
    certStatus: "Valid",
    reportLink: "",
    approval: "Pending",
    conditions: "",
    approvedBy: "",
    nextReview: "",
  };
  const [assessmentRows, setAssessmentRows] = useState<IAssessmentItem[]>([initialAssessmentRow]);

  // Filters
  const [filterStandard, setFilterStandard] = useState<string>("All");
  const [filterApproval, setFilterApproval] = useState<string>("All");
  const [filterCertStatus, setFilterCertStatus] = useState<string>("All");
  const [filterSearch, setFilterSearch] = useState<string>(" ");

  const handleAddAssessmentRow = () => {
    setAssessmentRows((prev) => [
      ...prev,
      {
        standard: "OEKO-TEX",
        auditType: "Surveillance",
        auditDate: new Date().toISOString().split("T")[0],
        score: 85,
        certValidUntil: "",
        certStatus: "Valid",
        reportLink: "",
        approval: "Pending",
        conditions: "",
        approvedBy: "",
        nextReview: "",
      },
    ]);
  };

  const handleRemoveAssessmentRow = (idx: number) => {
    if (assessmentRows.length <= 1) {
      toast.error("At least one assessment row is required.");
      return;
    }
    setAssessmentRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAssessmentChange = (idx: number, field: keyof IAssessmentItem, value: any) => {
    setAssessmentRows((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const handleResetSupplierForm = () => {
    setSupplierForm(initialSupplierForm);
    setAssessmentRows([initialAssessmentRow]);
    setSelectedSupplierId(null);
    toast.success("Form reset successfully");
  };

  const handleEditSupplier = (supplier: ISupplierRecord) => {
    setSelectedSupplierId(supplier._id);
    setSupplierForm({
      supplierName: supplier.supplierName || "",
      businessType: supplier.businessType || "Manufacturer",
      address: supplier.address || "",
      productCategory: supplier.productCategory || "",
      contactPerson: supplier.contactPerson || "",
      tradeLicenseNo: supplier.tradeLicenseNo || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
    });

    if (supplier.assessments && supplier.assessments.length > 0) {
      setAssessmentRows(
        supplier.assessments.map((a) => ({
          ...a,
          auditDate: a.auditDate ? a.auditDate.split("T")[0] : "",
          certValidUntil: a.certValidUntil ? a.certValidUntil.split("T")[0] : "",
          nextReview: a.nextReview ? a.nextReview.split("T")[0] : "",
        }))
      );
    } else {
      setAssessmentRows([initialAssessmentRow]);
    }

    setSupplierSubView("form");
    toast.success(`Editing ${supplier.supplierName}`);
  };

  const handleSaveSupplier = async () => {
    if (!supplierForm.supplierName.trim()) {
      toast.error("Supplier Name is required.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...supplierForm,
        assessments: assessmentRows,
      };

      if (selectedSupplierId) {
        await onUpdateSupplier(selectedSupplierId, payload);
        toast.success("Supplier record updated successfully!");
      } else {
        await onCreateSupplier(payload);
        toast.success("Supplier record saved successfully!");
      }

      handleResetSupplierForm();
      refetchSuppliers();
    } catch (err: unknown) {
      const errObj = err as { data?: { message?: string } };
      toast.error(errObj.data?.message || "Failed to save supplier record.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSupplierConfirm = async () => {
    if (!supplierToDelete) return;
    try {
      await onDeleteSupplier(supplierToDelete);
      toast.success("Supplier record deleted successfully!");
      if (selectedSupplierId === supplierToDelete) handleResetSupplierForm();
      refetchSuppliers();
    } catch {
      toast.error("Failed to delete supplier record.");
    } finally {
      setSupplierToDelete(null);
    }
  };

  // Flattened Assessments for Dashboard View
  const flattenedAssessments = useMemo(() => {
    const list: Array<{
      supplierId: string;
      supplierName: string;
      businessType: string;
      assessment: IAssessmentItem;
      originalSupplier: ISupplierRecord;
    }> = [];

    suppliersList.forEach((sup) => {
      if (sup.assessments && sup.assessments.length > 0) {
        sup.assessments.forEach((ass) => {
          list.push({
            supplierId: sup._id,
            supplierName: sup.supplierName,
            businessType: sup.businessType,
            assessment: ass,
            originalSupplier: sup,
          });
        });
      } else {
        list.push({
          supplierId: sup._id,
          supplierName: sup.supplierName,
          businessType: sup.businessType,
          assessment: {
            standard: "General Compliance",
            auditType: "Initial",
            score: 0,
            certStatus: "Valid",
            approval: "Pending",
            nextReview: "",
          },
          originalSupplier: sup,
        });
      }
    });

    return list.filter((item) => {
      if (filterStandard !== "All" && item.assessment.standard !== filterStandard) return false;
      if (filterApproval !== "All" && item.assessment.approval !== filterApproval) return false;
      if (filterCertStatus !== "All" && item.assessment.certStatus !== filterCertStatus) return false;
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase().trim();
        const matchName = item.supplierName.toLowerCase().includes(q);
        const matchType = item.businessType.toLowerCase().includes(q);
        const matchStandard = item.assessment.standard.toLowerCase().includes(q);
        const matchScore = item.assessment.score?.toString().includes(q);
        const matchAuditor = item.assessment.approvedBy?.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchStandard && !matchScore && !matchAuditor) return false;
      }
      return true;
    });
  }, [suppliersList, filterStandard, filterApproval, filterCertStatus, filterSearch]);

  const handleExportSuppliers = () => {
    if (flattenedAssessments.length === 0) {
      toast.error("No assessment records to export");
      return;
    }
    const headers = [
      "SUPPLIER",
      "BUSINESS TYPE",
      "STANDARD",
      "AUDIT TYPE",
      "AUDIT DATE",
      "SCORE",
      "CERT VALID UNTIL",
      "CERT STATUS",
      "APPROVAL",
      "NEXT REVIEW",
    ];
    const rows = flattenedAssessments.map((item) => [
      `"${item.supplierName}"`,
      `"${item.businessType}"`,
      `"${item.assessment.standard}"`,
      `"${item.assessment.auditType}"`,
      `"${item.assessment.auditDate || ""}"`,
      `"${item.assessment.score ?? ""}"`,
      `"${item.assessment.certValidUntil || ""}"`,
      `"${item.assessment.certStatus || ""}"`,
      `"${item.assessment.approval || ""}"`,
      `"${item.assessment.nextReview || ""}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Supplier_Assessment_Tracking_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported assessment records successfully!");
  };

  return (
    <div className="space-y-4">
      {/* Factory Banner */}
      <div className="bg-[#0b1727] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold tracking-wider">MG SHIRTEX LTD.</h2>
          <p className="text-xs text-slate-400">32, Lakshmipura, Chandana, Joydebpur, Gazipur-1700</p>
        </div>
        <div className="text-center">
          <h1 className="text-base sm:text-xl font-bold tracking-wide text-white">
            Supplier Assessment, Approval &amp; Tracking
          </h1>
          <p className="text-xs text-slate-300">Vendor Evaluation &amp; Compliance Management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-300">Date:</span>
            <span className="font-mono text-white font-medium">{new Date().toLocaleDateString("en-GB")}</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
          <button
            onClick={() => refetchSuppliers()}
            title="Refresh Data"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isSuppliersLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* 3-Column Responsive Layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Sidebar */}
        <div className="w-full lg:w-56 shrink-0 space-y-4">
          <div className="bg-[#0b1727] border border-slate-800 rounded-2xl p-4 text-white space-y-5 shadow-sm">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Steps</p>
              <button
                onClick={() => setSupplierSubView("form")}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2",
                  supplierSubView === "form"
                    ? "bg-blue-600/30 text-blue-400 border border-blue-500/40 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/60"
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Supplier Info &amp; Assessment
              </button>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Results</p>
              <button
                onClick={() => setSupplierSubView("dashboard")}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2",
                  supplierSubView === "dashboard"
                    ? "bg-blue-600/30 text-blue-400 border border-blue-500/40 font-semibold"
                    : "text-slate-300 hover:bg-slate-800/60"
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Tracking Dashboard
              </button>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={handleSaveSupplier}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Saving..." : selectedSupplierId ? "Update Record" : "Save Record"}
              </button>
              <button
                onClick={() => {
                  setSupplierSubView("dashboard");
                  toast.success("Tracking Dashboard loaded");
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                Search &amp; Filter
              </button>
              <button
                onClick={handleResetSupplierForm}
                className="w-full bg-slate-800/50 hover:bg-red-950/40 hover:text-red-300 text-slate-400 py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border border-slate-800 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Reset Form
              </button>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {supplierSubView === "form" ? (
            /* View 1: Form */
            <div className="glass-card rounded-2xl border border-border/60 shadow-sm p-5 space-y-5 bg-card/60 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-foreground">
                    {selectedSupplierId ? "Edit Supplier Record" : "Supplier Info & Assessment"}
                  </h3>
                  <span className="h-0.5 w-16 bg-blue-600 rounded-full" />
                </div>
                <span className="text-xs font-mono font-medium text-muted-foreground">Step 1 of 1</span>
              </div>

              {/* Basic Supplier Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    value={supplierForm.supplierName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, supplierName: e.target.value })}
                    placeholder="e.g., ABC Chemical & Dyestuff Co."
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Business Type</label>
                  <select
                    value={supplierForm.businessType}
                    onChange={(e) => setSupplierForm({ ...supplierForm, businessType: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  >
                    <option>Manufacturer</option>
                    <option>Trader</option>
                    <option>Importer</option>
                    <option>Indentor</option>
                    <option>Distributor</option>
                    <option>Service Provider</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Address</label>
                  <input
                    type="text"
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                    placeholder="e.g., Plot 12, Sector 3, Uttara, Dhaka"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Product/Service Category</label>
                  <input
                    type="text"
                    value={supplierForm.productCategory}
                    onChange={(e) => setSupplierForm({ ...supplierForm, productCategory: e.target.value })}
                    placeholder="e.g., Dyes & Auxiliaries / Finishing Chemicals"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Contact Person</label>
                  <input
                    type="text"
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    placeholder="e.g., Md. Rafiqul Islam"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Trade License No.</label>
                  <input
                    type="text"
                    value={supplierForm.tradeLicenseNo}
                    onChange={(e) => setSupplierForm({ ...supplierForm, tradeLicenseNo: e.target.value })}
                    placeholder="e.g., TRAD/DNCC/012938/2026"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Phone</label>
                  <input
                    type="text"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    placeholder="e.g., +880 1711 000000"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    placeholder="e.g., contact@supplier.com"
                    className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                  />
                </div>
              </div>

              {/* Assessments Table */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">
                    Assessments (one per standard / audit cycle)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddAssessmentRow}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Assessment
                  </button>
                </div>

                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="w-full text-left text-xs min-w-[900px]">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="p-2.5 font-semibold">Standard</th>
                        <th className="p-2.5 font-semibold">Audit Type</th>
                        <th className="p-2.5 font-semibold">Audit Date</th>
                        <th className="p-2.5 font-semibold">Score (%)</th>
                        <th className="p-2.5 font-semibold">Cert. Valid Until</th>
                        <th className="p-2.5 font-semibold">Report Link</th>
                        <th className="p-2.5 font-semibold">Approval</th>
                        <th className="p-2.5 font-semibold">Conditions</th>
                        <th className="p-2.5 font-semibold">Approved By</th>
                        <th className="p-2.5 font-semibold">Next Review</th>
                        <th className="p-2.5 text-center font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {assessmentRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          <td className="p-2">
                            <select
                              value={row.standard}
                              onChange={(e) => handleAssessmentChange(idx, "standard", e.target.value)}
                              className="w-28 bg-background border border-border rounded px-2 py-1 text-xs"
                            >
                              <option>ZDHC MRSL</option>
                              <option>OEKO-TEX</option>
                              <option>ISO 14001</option>
                              <option>HIGG FEM</option>
                              <option>GOTS</option>
                              <option>bluesign</option>
                              <option>Social Audit</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <select
                              value={row.auditType}
                              onChange={(e) => handleAssessmentChange(idx, "auditType", e.target.value)}
                              className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                            >
                              <option>Initial</option>
                              <option>Surveillance</option>
                              <option>Re-certification</option>
                              <option>Desktop Review</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="date"
                              value={row.auditDate || ""}
                              onChange={(e) => handleAssessmentChange(idx, "auditDate", e.target.value)}
                              className="w-28 bg-background border border-border rounded px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={row.score ?? ""}
                              onChange={(e) => handleAssessmentChange(idx, "score", Number(e.target.value))}
                              className="w-16 bg-background border border-border rounded px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="date"
                              value={row.certValidUntil || ""}
                              onChange={(e) => handleAssessmentChange(idx, "certValidUntil", e.target.value)}
                              className="w-28 bg-background border border-border rounded px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Link"
                              value={row.reportLink || ""}
                              onChange={(e) => handleAssessmentChange(idx, "reportLink", e.target.value)}
                              className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={row.approval}
                              onChange={(e) =>
                                handleAssessmentChange(idx, "approval", e.target.value as any)
                              }
                              className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Conditionally Approved">Conditional</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="—"
                              value={row.conditions || ""}
                              onChange={(e) => handleAssessmentChange(idx, "conditions", e.target.value)}
                              className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              placeholder="Auditor"
                              value={row.approvedBy || ""}
                              onChange={(e) => handleAssessmentChange(idx, "approvedBy", e.target.value)}
                              className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="date"
                              value={row.nextReview || ""}
                              onChange={(e) => handleAssessmentChange(idx, "nextReview", e.target.value)}
                              className="w-28 bg-background border border-border rounded px-2 py-1 text-xs"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveAssessmentRow(idx)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                              title="Remove row"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* View 2: Tracking Dashboard */
            <div className="glass-card rounded-2xl border border-border/60 shadow-sm p-5 space-y-4 bg-card/60 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-foreground">Supplier Assessment Tracking</h3>
                  <span className="h-0.5 w-16 bg-blue-600 rounded-full" />
                </div>
                <span className="text-xs font-mono font-medium text-emerald-600">100%</span>
              </div>

              {/* Filter Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-muted/20 p-3 rounded-xl border border-border/50">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Standard</label>
                  <select
                    value={filterStandard}
                    onChange={(e) => setFilterStandard(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <option value="All">All</option>
                    <option>ZDHC MRSL</option>
                    <option>OEKO-TEX</option>
                    <option>ISO 14001</option>
                    <option>HIGG FEM</option>
                    <option>GOTS</option>
                    <option>bluesign</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Approval</label>
                  <select
                    value={filterApproval}
                    onChange={(e) => setFilterApproval(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <option value="All">All</option>
                    <option value="Approved">Approved</option>
                    <option value="Conditionally Approved">Conditionally Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Cert. Status</label>
                  <select
                    value={filterCertStatus}
                    onChange={(e) => setFilterCertStatus(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <option value="All">All</option>
                    <option value="Valid">Valid</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">Search</label>
                  <input
                    type="text"
                    placeholder="Supplier / Auditor / Score..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              {/* Count & Print Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  {flattenedAssessments.length} assessment(s) across {suppliersList.length} supplier(s)
                </span>
                <button
                  onClick={() => window.print()}
                  className="bg-[#0b1727] hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition-all"
                >
                  <Printer className="w-3.5 h-3.5" /> Print This View
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full text-left text-xs min-w-[950px]">
                  <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 font-semibold">SUPPLIER</th>
                      <th className="p-3 font-semibold">BUSINESS TYPE</th>
                      <th className="p-3 font-semibold">STANDARD</th>
                      <th className="p-3 font-semibold">AUDIT TYPE</th>
                      <th className="p-3 font-semibold">AUDIT DATE</th>
                      <th className="p-3 font-semibold">SCORE</th>
                      <th className="p-3 font-semibold">CERT. VALID UNTIL</th>
                      <th className="p-3 font-semibold">CERT. STATUS</th>
                      <th className="p-3 font-semibold">APPROVAL</th>
                      <th className="p-3 font-semibold">NEXT REVIEW</th>
                      <th className="p-3 text-right font-semibold">EDIT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    {flattenedAssessments.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-muted-foreground">
                          No assessments match the current filters
                        </td>
                      </tr>
                    ) : (
                      flattenedAssessments.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-semibold text-foreground">{item.supplierName}</td>
                          <td className="p-3 text-muted-foreground">{item.businessType}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                              {item.assessment.standard}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{item.assessment.auditType}</td>
                          <td className="p-3 text-muted-foreground">{item.assessment.auditDate || "—"}</td>
                          <td className="p-3 font-semibold">
                            {item.assessment.score ? `${item.assessment.score}%` : "—"}
                          </td>
                          <td className="p-3 text-muted-foreground">{item.assessment.certValidUntil || "—"}</td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-medium",
                                item.assessment.certStatus === "Valid"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : item.assessment.certStatus === "Expiring Soon"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-red-500/10 text-red-600"
                              )}
                            >
                              {item.assessment.certStatus || "Valid"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                item.assessment.approval === "Approved"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : item.assessment.approval === "Conditionally Approved"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                  : item.assessment.approval === "Rejected"
                                  ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                              )}
                            >
                              {item.assessment.approval}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{item.assessment.nextReview || "—"}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditSupplier(item.originalSupplier)}
                                className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 rounded-lg"
                                title="Edit Record"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSupplierToDelete(item.supplierId)}
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded-lg"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Live Metrics & Saved Records */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="glass-card rounded-2xl border border-border/60 shadow-sm p-4 bg-card/60 backdrop-blur-xl space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Metrics</h4>
            <div className="space-y-2 text-xs divide-y divide-border/50">
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">Supplier</span>
                <span className="font-semibold text-foreground truncate max-w-[120px]">
                  {supplierForm.supplierName || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Total Assessments</span>
                <span className="font-bold text-foreground">
                  {supplierSubView === "form" ? assessmentRows.length : flattenedAssessments.length}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Business Type</span>
                <span className="font-medium text-foreground">
                  {supplierForm.businessType || "Manufacturer"}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-border/60 shadow-sm p-4 bg-card/60 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Saved Records</h4>
              <button
                onClick={() => refetchSuppliers()}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                title="Refresh"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isSuppliersLoading && "animate-spin")} />
              </button>
            </div>

            {suppliersList.length === 0 ? (
              <div className="py-8 text-center space-y-2 text-muted-foreground">
                <Building2 className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs font-medium">No records found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {suppliersList.map((sup, idx) => (
                  <div
                    key={sup._id || `sup-${idx}`}
                    className="p-2.5 rounded-xl border border-border hover:border-blue-500/50 hover:bg-muted/30 transition-all flex items-center justify-between group cursor-pointer"
                    onClick={() => handleEditSupplier(sup)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate group-hover:text-blue-600 transition-colors">
                        {sup.supplierName}
                      </p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span>{sup.businessType}</span>
                        <span>•</span>
                        <span>{sup.assessments?.length || 0} Assessments</span>
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSupplierToDelete(sup._id);
                      }}
                      className="text-muted-foreground hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl border border-border/60 shadow-sm p-4 bg-card/60 backdrop-blur-xl space-y-2.5">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Print &amp; Export</h4>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-background border border-border hover:bg-muted text-foreground py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-muted-foreground" /> Print
              </button>
              <button
                onClick={handleExportSuppliers}
                className="flex-1 bg-background border border-border hover:bg-muted text-foreground py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-muted-foreground" /> Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Supplier Modal */}
      <ConfirmModal
        isOpen={Boolean(supplierToDelete)}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={handleDeleteSupplierConfirm}
        title="Delete Supplier Record"
        message="Are you sure you want to delete this supplier record and all its associated assessments? This action cannot be undone."
        confirmText="Delete Supplier"
        isDestructive={true}
      />
    </div>
  );
};
