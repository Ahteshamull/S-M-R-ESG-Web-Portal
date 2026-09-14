"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  Search,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Eye,
  Download,
  Trash2,
  CheckCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { IDocumentItem } from "@/lib/redux/slices/documentsApi";

interface AuditReportsTabProps {
  auditReports: IDocumentItem[];
  isReportsLoading: boolean;
  onUploadDocument: (body: FormData) => Promise<any>;
  onDeleteDocument: (id: string) => Promise<any>;
  refetchReports: () => void;
}

export const AuditReportsTab: React.FC<AuditReportsTabProps> = ({
  auditReports,
  isReportsLoading,
  onUploadDocument,
  onDeleteDocument,
  refetchReports,
}) => {
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<IDocumentItem | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const reportFileInputRef = useRef<HTMLInputElement>(null);

  const getReportFileUrl = (relativeOrAbsoluteUrl: string) => {
    if (!relativeOrAbsoluteUrl) return "";
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const serverHost = apiBase.replace("/api/v1", "");
    return relativeOrAbsoluteUrl.startsWith("http")
      ? relativeOrAbsoluteUrl
      : `${serverHost}${relativeOrAbsoluteUrl}`;
  };

  const handleDownloadReportFile = (doc: IDocumentItem) => {
    if (!doc.fileUrl) {
      toast.error("File URL is not available.");
      return;
    }
    const url = getReportFileUrl(doc.fileUrl);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name || "Audit_Report";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started!");
  };

  const handleReportUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = reportFile;
    if (!file) {
      toast.error("Please attach an audit report file.");
      return;
    }

    const reportName = (formData.get("name") as string) || file.name;
    const body = new FormData();
    body.append("name", reportName);
    body.append("category", "Audit Reports");
    body.append("file", file);
    body.append("uploadedBy", "Admin User");
    body.append("supplierName", (formData.get("agency") as string) || "Third-Party Auditor");
    body.append("version", (formData.get("rating") as string) || "Verified");
    body.append("status", (formData.get("status") as string) || "Passed");
    body.append("remarks", (formData.get("remarks") as string) || "");

    try {
      setIsUploading(true);
      await onUploadDocument(body);
      toast.success("Audit Report uploaded successfully!");
      setIsAddReportModalOpen(false);
      setReportFile(null);
      if (reportFileInputRef.current) reportFileInputRef.current.value = "";
      refetchReports();
    } catch (err: unknown) {
      const errObj = err as { data?: { message?: string } };
      toast.error(errObj.data?.message || "Failed to upload report.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReportDeleteConfirm = async () => {
    if (!reportToDelete) return;
    try {
      await onDeleteDocument(reportToDelete);
      toast.success("Audit report deleted successfully!");
      if (previewReport?._id === reportToDelete) setPreviewReport(null);
      refetchReports();
    } catch {
      toast.error("Failed to delete report.");
    } finally {
      setReportToDelete(null);
    }
  };

  const filteredAuditReports = useMemo(() => {
    return auditReports.filter((doc: IDocumentItem) => {
      const q = reportSearchQuery.toLowerCase();
      return (
        !q ||
        (doc.name && doc.name.toLowerCase().includes(q)) ||
        (doc.supplierName && doc.supplierName.toLowerCase().includes(q)) ||
        (doc.version && doc.version.toLowerCase().includes(q))
      );
    });
  }, [auditReports, reportSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Action Bar & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-border/50 bg-emerald-500/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Reports / Certs</p>
              <p className="text-2xl font-bold text-foreground">{auditReports.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/50 bg-blue-500/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Passed / Verified</p>
              <p className="text-2xl font-bold text-foreground">
                {
                  auditReports.filter(
                    (r: IDocumentItem) =>
                      r.status?.toLowerCase() === "passed" || r.status?.toLowerCase() === "active"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-border/50 bg-amber-500/5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Action Required / Review</p>
              <p className="text-2xl font-bold text-foreground">
                {
                  auditReports.filter(
                    (r: IDocumentItem) =>
                      r.status?.toLowerCase() !== "passed" && r.status?.toLowerCase() !== "active"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="glass-card rounded-2xl border border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-xl">
        <div className="p-5 border-b border-border/50 bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Audit Reports &amp; Third-Party Certifications
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Store and download full audit reports (SMETA, BSCI, Higg FEM, ISO, OEKO-TEX, ZDHC).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={reportSearchQuery}
                onChange={(e) => setReportSearchQuery(e.target.value)}
                placeholder="Search audits & certs..."
                className="pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-48 sm:w-64"
              />
            </div>
            <button
              onClick={() => setIsAddReportModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center shadow-sm"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" /> Upload Report
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isReportsLoading ? (
            <div className="p-12 text-center text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
              Loading audit reports...
            </div>
          ) : filteredAuditReports.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Award className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              No audit reports found. Click &ldquo;Upload Report&rdquo; to add certifications.
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-medium">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Report / Certificate</th>
                  <th className="p-4">Auditor / Agency</th>
                  <th className="p-4">Grade / Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Uploaded</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-medium">
                {filteredAuditReports.map((doc: IDocumentItem, idx: number) => {
                  const fileExt = doc.fileUrl ? doc.fileUrl.split(".").pop()?.toUpperCase() : "DOC";
                  return (
                    <tr key={doc._id || `report-${idx}`} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                            {fileExt === "PDF" ? (
                              <FileText className="w-4 h-4" />
                            ) : fileExt === "XLSX" || fileExt === "XLS" ? (
                              <FileSpreadsheet className="w-4 h-4" />
                            ) : (
                              <Award className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => setPreviewReport(doc)}
                              className="font-semibold text-foreground hover:text-emerald-600 transition-colors text-left truncate block max-w-[240px] sm:max-w-[280px]"
                              title={doc.name}
                            >
                              {doc.name}
                            </button>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground uppercase font-mono font-medium">
                                {fileExt}
                              </span>
                              {doc.fileSize && (
                                <span className="text-[11px] text-muted-foreground">
                                  {isNaN(Number(doc.fileSize))
                                    ? doc.fileSize
                                    : `${(Number(doc.fileSize) / (1024 * 1024)).toFixed(2)} MB`}
                                </span>
                              )}
                              {doc.remarks && (
                                <span className="text-[11px] text-muted-foreground italic truncate max-w-[150px]">
                                  • {doc.remarks}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-foreground">{doc.supplierName || "Third-Party"}</span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                          {doc.version || "Verified"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                          <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                          {doc.status || "Passed"}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {doc.createdAt
                          ? new Date(doc.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewReport(doc)}
                            title="View Document"
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadReportFile(doc)}
                            title="Download File"
                            className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setReportToDelete(doc._id)}
                            title="Delete Report"
                            className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upload Report Modal */}
      <Modal
        isOpen={isAddReportModalOpen}
        onClose={() => {
          setIsAddReportModalOpen(false);
          setReportFile(null);
        }}
        title="Upload Audit Report or Certificate"
      >
        <form onSubmit={handleReportUpload} className="space-y-4">
          <div className="border-2 border-dashed border-border hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-muted/20">
            <input
              type="file"
              ref={reportFileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setReportFile(e.target.files[0]);
              }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              className="hidden"
              id="report-file-input"
            />
            <label htmlFor="report-file-input" className="cursor-pointer block">
              <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                {reportFile ? reportFile.name : "Click to browse or drag & drop report file"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">PDF, Excel, Word or Images (Max 25MB)</p>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                Report / Certificate Name *
              </label>
              <input
                name="name"
                type="text"
                placeholder="e.g. SEDEX SMETA 4-Pillar Audit"
                defaultValue={reportFile ? reportFile.name.replace(/\.[^/.]+$/, "") : ""}
                required
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                Auditing Agency / Body
              </label>
              <input
                name="agency"
                type="text"
                placeholder="e.g. SGS, Intertek, Bureau Veritas"
                defaultValue="SGS"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">
                Audit Rating / Grade
              </label>
              <input
                name="rating"
                type="text"
                placeholder="e.g. Verified (Grade A)"
                defaultValue="Verified (Grade A)"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">Status</label>
              <select
                name="status"
                defaultValue="Passed"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Passed">Passed / Certified</option>
                <option value="Under Review">Under Review</option>
                <option value="Action Required">Action Required</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground block mb-1">Remarks</label>
            <textarea
              name="remarks"
              placeholder="Additional notes or audit scope..."
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 h-20 resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setIsAddReportModalOpen(false);
                setReportFile(null);
              }}
              className="px-4 py-2 bg-muted text-foreground rounded-xl text-xs sm:text-sm font-medium hover:bg-muted/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !reportFile}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2" /> Upload Report
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Document Preview Modal */}
      <Modal
        isOpen={Boolean(previewReport)}
        onClose={() => setPreviewReport(null)}
        title={previewReport?.name || "Report Preview"}
        maxWidthClass="max-w-4xl"
      >
        {previewReport && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/30 rounded-xl text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {previewReport.supplierName || "Audit Body"}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-medium">
                  {previewReport.version || "Verified"}
                </span>
              </div>
              <button
                onClick={() => handleDownloadReportFile(previewReport)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </button>
            </div>

            <div className="w-full min-h-[50vh] max-h-[70vh] flex items-center justify-center bg-zinc-950/5 dark:bg-zinc-950/50 rounded-xl overflow-hidden border border-border">
              {previewReport.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={getReportFileUrl(previewReport.fileUrl)}
                  className="w-full h-[65vh] border-0"
                  title={previewReport.name}
                />
              ) : previewReport.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <img
                  src={getReportFileUrl(previewReport.fileUrl)}
                  alt={previewReport.name}
                  className="max-h-[65vh] max-w-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Preview not supported for this file type
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Please download the file to view its full contents.
                  </p>
                  <button
                    onClick={() => handleDownloadReportFile(previewReport)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download {previewReport.name}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(reportToDelete)}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleReportDeleteConfirm}
        title="Delete Audit Report"
        message="Are you sure you want to delete this audit report? This action cannot be undone."
        confirmText="Delete Report"
        isDestructive={true}
      />
    </div>
  );
};
