"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, FileBarChart2, UploadCloud, Download, Eye, Trash2, 
  Search, Plus, RotateCcw, ExternalLink, Award, FileSpreadsheet,
  FileText, Image as ImageIcon
} from "lucide-react";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { 
  useGetDocumentsQuery, 
  useUploadDocumentMutation, 
  useDeleteDocumentMutation,
  IDocumentItem
} from "@/lib/redux/slices/documentsApi";
import { useGetChemicalsQuery, IChemicalItem } from "@/lib/redux/slices/chemicalsApi";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function InCheckReportPage() {
  const { data: documents = [], isLoading: isDocsLoading } = useGetDocumentsQuery({ category: "InCheck Reports" });
  const { data: chemicals = [] } = useGetChemicalsQuery();
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  // Generator Period Filter State
  const [evalMonth, setEvalMonth] = useState<string>("9"); // Default to September
  const [evalYear, setEvalYear] = useState<string>("2026");

  // Archive Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFormat, setFilterFormat] = useState("ALL");

  // Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<IDocumentItem | null>(null);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);

  // Pure File Upload State (NO text inputs)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter chemicals for the selected generator period
  const periodChemicals = useMemo(() => {
    return chemicals.filter((chem: IChemicalItem) => {
      const dates = [chem.date, chem.createdAt, chem.dateOfPurchase, chem.checkedOn].filter(Boolean);
      if (dates.length === 0) return true;

      return dates.some((dStr) => {
        if (!dStr) return false;
        const parsed = new Date(dStr);
        if (isNaN(parsed.getTime())) return false;
        const m = parsed.getMonth() + 1;
        const y = parsed.getFullYear();
        const matchesM = evalMonth === "ALL" || m === parseInt(evalMonth, 10);
        const matchesY = evalYear === "ALL" || y === parseInt(evalYear, 10);
        return matchesM && matchesY;
      });
    });
  }, [chemicals, evalMonth, evalYear]);

  // Calculations for Generator Section
  const totalProducts = periodChemicals.length;
  const level1 = periodChemicals.filter((c: IChemicalItem) => c.zdhcLevel === "Level-1").length;
  const level2 = periodChemicals.filter((c: IChemicalItem) => c.zdhcLevel === "Level-2").length;
  const level3 = periodChemicals.filter((c: IChemicalItem) => c.zdhcLevel === "Level-3").length;
  const conformantTotal = level1 + level2 + level3;
  const notPublished = periodChemicals.filter((c: IChemicalItem) => !c.zdhcLevel || c.zdhcLevel === "None").length;
  const now = new Date();
  const expired = periodChemicals.filter((c: IChemicalItem) => {
    if (!c.expiryDate) return false;
    const exp = new Date(c.expiryDate);
    return !isNaN(exp.getTime()) && exp < now;
  }).length;

  const conformantPct = totalProducts > 0 ? ((conformantTotal / totalProducts) * 100).toFixed(1) : "0.0";
  const gatewayPct = totalProducts > 0 ? (((totalProducts - notPublished) / totalProducts) * 100).toFixed(1) : "0.0";
  const ctzProgressivePct = totalProducts > 0 ? (((level2 + level3) / totalProducts) * 100).toFixed(1) : "0.0";

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Pure File Upload Handler (NO text inputs)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("category", "InCheck Reports");
    formData.append("file", selectedFile);
    formData.append("uploadedBy", "Admin User");

    try {
      const res = await uploadDocument(formData).unwrap();
      toast.success(res.message || "InCheck Report uploaded successfully!");
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const errObj = err as { data?: { message?: string } };
      toast.error(errObj.data?.message || "Failed to upload report.");
    }
  };

  // Delete Report
  const handleDeleteConfirm = async () => {
    if (!docToDelete) return;
    try {
      await deleteDocument(docToDelete).unwrap();
      toast.success("InCheck Report removed from archive.");
      if (previewDoc?._id === docToDelete) {
        setPreviewDoc(null);
      }
    } catch {
      toast.error("Failed to delete report.");
    } finally {
      setDocToDelete(null);
    }
  };

  // Direct File Download
  const handleDownload = (doc: IDocumentItem) => {
    if (!doc.fileUrl) {
      toast.error("File URL is not available.");
      return;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const serverHost = apiBase.replace("/api/v1", "");
    const url = doc.fileUrl.startsWith("http") ? doc.fileUrl : `${serverHost}${doc.fileUrl}`;
    
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name || "InCheck_Report";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started!");
  };

  const getFileUrl = (relativeOrAbsoluteUrl: string) => {
    if (!relativeOrAbsoluteUrl) return "";
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const serverHost = apiBase.replace("/api/v1", "");
    return relativeOrAbsoluteUrl.startsWith("http") ? relativeOrAbsoluteUrl : `${serverHost}${relativeOrAbsoluteUrl}`;
  };

  const getFormatType = (doc: IDocumentItem) => {
    const url = (doc.fileUrl || "").toLowerCase();
    const name = (doc.name || "").toLowerCase();
    if (url.endsWith(".pdf") || name.endsWith(".pdf") || (doc.fileType || "").includes("pdf")) return "PDF";
    if (["xlsx", "xls", "csv"].some(ext => url.endsWith(`.${ext}`) || name.endsWith(`.${ext}`))) return "EXCEL";
    if (["png", "jpg", "jpeg", "webp"].some(ext => url.endsWith(`.${ext}`) || name.endsWith(`.${ext}`))) return "IMAGE";
    return "DOC";
  };

  // Generate & Download InCheck Summary Report as Excel
  const handleGenerateExcel = async () => {
    if (periodChemicals.length === 0) {
      toast.error("No chemical records available for the selected period to generate report.");
      return;
    }

    try {
      const monthLabel = evalMonth !== "ALL" ? MONTH_NAMES[parseInt(evalMonth, 10) - 1] : "All Months";
      const periodLabel = `${monthLabel} ${evalYear !== "ALL" ? evalYear : "2026"}`;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("InCheck Performance Report");

      // Title
      sheet.mergeCells("A2:H3");
      const titleCell = sheet.getCell("A2");
      titleCell.value = "ZDHC Performance InCheck Report";
      titleCell.font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } };
      titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
      titleCell.alignment = { vertical: "middle", horizontal: "center" };

      // Facility & Period Block
      sheet.getCell("A5").value = "Organization / Facility:";
      sheet.getCell("B5").value = "MG Shirtex Limited";
      sheet.getCell("A6").value = "Evaluation Period:";
      sheet.getCell("B6").value = periodLabel;
      sheet.getCell("A7").value = "ZDHC MRSL Version:";
      sheet.getCell("B7").value = "v3.1";
      sheet.getCell("A8").value = "Report Generated On:";
      sheet.getCell("B8").value = new Date().toLocaleDateString("en-GB");

      ["A5", "A6", "A7", "A8"].forEach((c) => {
        sheet.getCell(c).font = { bold: true, size: 10 };
      });

      // Benchmark Metrics Block
      sheet.getCell("E5").value = "Total Chemical Products";
      sheet.getCell("F5").value = totalProducts;
      sheet.getCell("E6").value = "ZDHC Gateway Published";
      sheet.getCell("F6").value = `${gatewayPct}%`;
      sheet.getCell("E7").value = "ZDHC MRSL v3.1 Conformant";
      sheet.getCell("F7").value = `${conformantPct}%`;
      sheet.getCell("E8").value = "CtZ Provisionally Progressive";
      sheet.getCell("F8").value = `${ctzProgressivePct}%`;

      ["E5", "E6", "E7", "E8"].forEach((c) => {
        sheet.getCell(c).font = { bold: true, size: 10 };
      });
      ["F5", "F6", "F7", "F8"].forEach((c) => {
        sheet.getCell(c).font = { bold: true, size: 10, color: { argb: "FF0F766E" } };
        sheet.getCell(c).alignment = { horizontal: "center" };
      });

      // Performance Breakdown Table
      sheet.getCell("A11").value = "Performance Level";
      sheet.getCell("B11").value = "Product Count";
      sheet.getCell("C11").value = "Percentage (%)";
      ["A11", "B11", "C11"].forEach((c) => {
        const cell = sheet.getCell(c);
        cell.font = { bold: true, size: 10 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };
      });

      const breakdown = [
        { label: "Level 3 Conformant", count: level3, pct: totalProducts > 0 ? ((level3 / totalProducts) * 100).toFixed(1) : "0" },
        { label: "Level 2 Conformant", count: level2, pct: totalProducts > 0 ? ((level2 / totalProducts) * 100).toFixed(1) : "0" },
        { label: "Level 1 Conformant", count: level1, pct: totalProducts > 0 ? ((level1 / totalProducts) * 100).toFixed(1) : "0" },
        { label: "Not Published in Gateway", count: notPublished, pct: totalProducts > 0 ? ((notPublished / totalProducts) * 100).toFixed(1) : "0" },
        { label: "Expired Products", count: expired, pct: totalProducts > 0 ? ((expired / totalProducts) * 100).toFixed(1) : "0" },
      ];

      breakdown.forEach((item, idx) => {
        const row = 12 + idx;
        sheet.getCell(`A${row}`).value = item.label;
        sheet.getCell(`B${row}`).value = item.count;
        sheet.getCell(`C${row}`).value = `${item.pct}%`;
      });

      // Chemical Inventory List in Report
      const tableHeaders = ["#", "Chemical Name", "Supplier", "CAS No", "ZDHC Level", "Certificate", "Monthly Consumption", "Log Date"];
      const startRow = 19;
      tableHeaders.forEach((h, idx) => {
        const col = String.fromCharCode(65 + idx);
        const cell = sheet.getCell(`${col}${startRow}`);
        cell.value = h;
        cell.font = { bold: true, size: 9 };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      periodChemicals.forEach((chem, idx) => {
        const r = startRow + 1 + idx;
        sheet.getCell(`A${r}`).value = idx + 1;
        sheet.getCell(`B${r}`).value = chem.chemicalName || "";
        sheet.getCell(`C${r}`).value = chem.supplierName || "";
        sheet.getCell(`D${r}`).value = chem.casNo || "";
        sheet.getCell(`E${r}`).value = chem.zdhcLevel || "None";
        sheet.getCell(`F${r}`).value = chem.certificateName || "—";
        sheet.getCell(`G${r}`).value = chem.monthlyConsumption || "—";
        sheet.getCell(`H${r}`).value = chem.date || (chem.createdAt ? chem.createdAt.slice(0, 10) : "");
      });

      sheet.getColumn(1).width = 6;
      sheet.getColumn(2).width = 28;
      sheet.getColumn(3).width = 22;
      sheet.getColumn(4).width = 16;
      sheet.getColumn(5).width = 16;
      sheet.getColumn(6).width = 20;
      sheet.getColumn(7).width = 20;
      sheet.getColumn(8).width = 16;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `ZDHC_InCheck_Report_${periodLabel.replace(/\s+/g, "_")}.xlsx`);
      toast.success("Generated InCheck Report downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate InCheck report Excel.");
    }
  };

  // Filtered Archive Reports
  const filteredArchive = useMemo(() => {
    return documents.filter((doc: IDocumentItem) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || (doc.name && doc.name.toLowerCase().includes(q));

      const format = getFormatType(doc);
      const matchesFormat = filterFormat === "ALL" || format === filterFormat;

      return matchesSearch && matchesFormat;
    });
  }, [documents, searchQuery, filterFormat]);

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            href="/dashboard/chemicals" 
            className="p-2 bg-muted/60 hover:bg-muted rounded-xl transition-colors shrink-0"
            title="Back to Chemicals Hub"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileBarChart2 className="w-6 h-6 text-amber-500" />
              Monthly InCheck Report Generator & Archive
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Generate instant inventory conformance reports and upload verified InCheck documents
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/chemicals/compliance"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-border/80 bg-background/60 hover:bg-muted transition-colors inline-flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-emerald-600" />
            Compliance Dashboard
          </Link>
          <button
            onClick={() => {
              setSelectedFile(null);
              setIsUploadModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Upload Report File
          </button>
        </div>
      </div>

      {/* SECTION 1: Automated Live InCheck Report Generator */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-border/60 shadow-sm space-y-5 w-full min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/50 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                Live Generator
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Instant InCheck Report Generator
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Select month and year to compile current inventory conformance metrics and download Excel report
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={evalMonth}
              onChange={(e) => setEvalMonth(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm bg-background border border-border text-foreground font-medium focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="ALL">All Months</option>
              {MONTH_NAMES.map((name, idx) => (
                <option key={name} value={String(idx + 1)}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={evalYear}
              onChange={(e) => setEvalYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm bg-background border border-border text-foreground font-medium focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="ALL">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>

        {/* Generator KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-muted/40 border border-border/60">
            <span className="text-xs text-muted-foreground font-medium">Evaluated Products</span>
            <p className="text-2xl font-bold text-foreground mt-1">{totalProducts}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Selected period products</p>
          </div>

          <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
            <span className="text-xs text-sky-700 dark:text-sky-400 font-medium">Gateway Published</span>
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400 mt-1">{gatewayPct}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{totalProducts - notPublished} of {totalProducts} verified</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">ZDHC MRSL v3.1</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{conformantPct}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Levels 1, 2, 3 conformant</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">CtZ Progressive</span>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{ctzProgressivePct}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Level 2 & Level 3</p>
          </div>
        </div>

        {/* Generator Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-xs text-muted-foreground">
            Current Period: <span className="font-semibold text-foreground">{evalMonth !== "ALL" ? MONTH_NAMES[parseInt(evalMonth, 10) - 1] : "All"} {evalYear}</span>
          </div>

          <button
            onClick={handleGenerateExcel}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Download Generated InCheck (Excel)
          </button>
        </div>
      </div>

      {/* SECTION 2: Official Verified InCheck Reports Archive */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Official Uploaded InCheck Reports Archive
            </h3>
            <p className="text-xs text-muted-foreground">
              Directly uploaded ZDHC Gateway verification files, certificates, and reports
            </p>
          </div>

          {/* Search & Format Filter */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search report file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs sm:text-sm bg-background border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm bg-background border border-border text-foreground focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
            >
              <option value="ALL">All Formats</option>
              <option value="PDF">PDF Only</option>
              <option value="EXCEL">Excel Only</option>
              <option value="IMAGE">Image Only</option>
            </select>

            {(searchQuery || filterFormat !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterFormat("ALL");
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground bg-muted transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Archive Table */}
        <div className="glass-card rounded-2xl border border-border/60 shadow-sm overflow-hidden w-full min-w-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-3.5 text-center w-12">#</th>
                  <th className="p-3.5">Report File Name</th>
                  <th className="p-3.5 text-center">Format</th>
                  <th className="p-3.5">File Size</th>
                  <th className="p-3.5">Uploaded Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isDocsLoading ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs">Loading reports...</p>
                    </td>
                  </tr>
                ) : filteredArchive.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                      <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600 dark:text-amber-400">
                        <FileBarChart2 className="w-7 h-7" />
                      </div>
                      <p className="font-bold text-foreground text-sm sm:text-base">No InCheck report files uploaded</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                        Click below to directly select and upload an InCheck report file (PDF, Excel, or Scan).
                      </p>
                      <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Upload File
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredArchive.map((doc: IDocumentItem, index: number) => {
                    const format = getFormatType(doc);

                    return (
                      <tr key={doc._id || index} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3.5 text-center text-muted-foreground font-medium text-xs">
                          {index + 1}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg shrink-0 ${
                              format === "PDF" ? "bg-red-500/10 text-red-600" :
                              format === "EXCEL" ? "bg-emerald-500/10 text-emerald-600" :
                              format === "IMAGE" ? "bg-blue-500/10 text-blue-600" :
                              "bg-amber-500/10 text-amber-600"
                            }`}>
                              {format === "PDF" ? <FileText className="w-4 h-4" /> :
                               format === "EXCEL" ? <FileSpreadsheet className="w-4 h-4" /> :
                               format === "IMAGE" ? <ImageIcon className="w-4 h-4" /> :
                               <FileBarChart2 className="w-4 h-4" />}
                            </div>
                            <div className="flex flex-col min-w-0 max-w-md">
                              <span className="font-semibold text-foreground text-xs sm:text-sm truncate">
                                {doc.name}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                Uploaded by {doc.uploadedBy || "Admin User"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                            format === "PDF" ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20" :
                            format === "EXCEL" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                            format === "IMAGE" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20" :
                            "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          }`}>
                            {format}
                          </span>
                        </td>
                        <td className="p-3.5 text-xs text-muted-foreground font-mono">
                          {doc.fileSize || "1.4 MB"}
                        </td>
                        <td className="p-3.5 text-xs text-muted-foreground font-mono">
                          {doc.createdAt ? new Date(doc.createdAt).toISOString().slice(0, 10) : "2026-09-11"}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Preview Button */}
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                              title="Preview Report"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* Download Button */}
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-1.5 hover:bg-muted rounded-lg text-amber-600 hover:text-amber-700 transition-colors"
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {/* Delete Button */}
                            <button
                              onClick={() => setDocToDelete(doc._id)}
                              className="p-1.5 hover:bg-muted rounded-lg text-red-500 hover:text-red-700 transition-colors"
                              title="Delete Report"
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
      </div>

      {/* Pure File Upload Modal (NO text inputs) */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFile(null);
        }}
        title="Upload InCheck Report File"
        maxWidthClass="max-w-md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging 
                ? "border-amber-500 bg-amber-500/10" 
                : selectedFile 
                ? "border-emerald-500/60 bg-emerald-500/5" 
                : "border-border hover:border-amber-400 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>

            {selectedFile ? (
              <div>
                <p className="text-sm font-bold text-foreground break-all">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                </p>
                <span className="inline-block mt-3 text-xs font-semibold text-amber-600 underline">
                  Choose a different file
                </span>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Drag and drop report file here, or <span className="text-amber-600 underline">Browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PDF, Excel (.xlsx, .xls), or Scanned image (max 50MB)
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedFile(null);
              }}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-border hover:bg-muted text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5 shadow-sm"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Upload Now
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Document View & Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={`Report Preview: ${previewDoc.name}`}
          maxWidthClass="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-3.5 border border-border flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0 max-w-md">
                <h4 className="font-bold text-sm sm:text-base text-foreground truncate">{previewDoc.name}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                  <span>Size: {previewDoc.fileSize || "1.4 MB"}</span>
                  <span>•</span>
                  <span>Uploaded: {previewDoc.createdAt ? new Date(previewDoc.createdAt).toISOString().slice(0, 10) : "2026-09-11"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors inline-flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download File
                </button>
                <a
                  href={getFileUrl(previewDoc.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-border hover:bg-muted text-foreground transition-colors inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Tab
                </a>
              </div>
            </div>

            {/* Embedded Preview */}
            <div className="rounded-xl border border-border/80 bg-background/50 overflow-hidden flex items-center justify-center min-h-[420px] max-h-[600px]">
              {previewDoc.fileUrl.toLowerCase().endsWith(".pdf") || (previewDoc.fileType || "").includes("pdf") ? (
                <iframe
                  src={`${getFileUrl(previewDoc.fileUrl)}#toolbar=1`}
                  className="w-full h-[520px] rounded-xl border-none"
                  title="InCheck Report PDF"
                />
              ) : ["png", "jpg", "jpeg", "webp"].some((ext) => previewDoc.fileUrl.toLowerCase().endsWith(ext)) ? (
                <div className="p-4 flex flex-col items-center">
                  <img
                    src={getFileUrl(previewDoc.fileUrl)}
                    alt={previewDoc.name}
                    className="max-h-[500px] object-contain rounded-lg shadow-sm"
                  />
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <FileSpreadsheet className="w-16 h-16 mx-auto mb-3 text-emerald-600/70" />
                  <p className="font-bold text-foreground text-sm">
                    {previewDoc.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Direct browser preview is not available for this document format. Please click below to download.
                  </p>
                  <button
                    onClick={() => handleDownload(previewDoc)}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(docToDelete)}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete InCheck Report"
        message="Are you sure you want to permanently delete this InCheck Report from the archive?"
        isDestructive={true}
        confirmText="Delete Report"
      />
    </div>
  );
}
