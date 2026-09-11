"use client";

import { useState, useMemo, useRef } from "react";
import { 
  Scale, FileWarning, CheckCircle2, ShieldAlert, Plus, Download, 
  BarChart2, FileText, Users, AlertTriangle, CheckCircle, Clock, 
  FileBadge, Calendar, UploadCloud, Loader2, Award, Eye, Trash2, 
  ExternalLink, FileSpreadsheet, Search, RotateCcw, ShieldCheck,
  Printer, Save, RefreshCw, Edit3, Building2, Phone, Mail, Check, X
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  useGetComplianceOverviewQuery, 
  useCreateCAPMutation, 
  useCreateLegalDocMutation, 
  useCreateCommitteeMutation,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  ISupplierRecord,
  IAssessmentItem
} from "@/lib/redux/slices/complianceApi";
import { 
  useGetDocumentsQuery, 
  useUploadDocumentMutation, 
  useDeleteDocumentMutation,
  IDocumentItem 
} from "@/lib/redux/slices/documentsApi";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'audits' | 'legal' | 'committees' | 'reports' | 'suppliers';

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('audits');
  const { data: complianceData, isLoading } = useGetComplianceOverviewQuery();
  const [createCAP] = useCreateCAPMutation();
  const [createLegalDoc] = useCreateLegalDocMutation();
  const [createCommittee] = useCreateCommitteeMutation();

  // Tab 5: Audit Reports & Certifications Data & Mutations
  const { data: auditReports = [], isLoading: isReportsLoading } = useGetDocumentsQuery({ category: "Audit Reports" });
  const [uploadDocument, { isLoading: isUploadingReport }] = useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  // Tab 6: Supplier Assessment, Approval & Tracking
  const { data: suppliersList = [], isLoading: isSuppliersLoading, refetch: refetchSuppliers } = useGetSuppliersQuery();
  const [createSupplier, { isLoading: isSavingSupplier }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdatingSupplier }] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const caps = complianceData?.caps || [];
  const legalDocs = complianceData?.legalDocs || [];
  const committees = complianceData?.committees || [];


  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] = useState(false);

  // Tab 5 Modals & Upload State
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<IDocumentItem | null>(null);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const reportFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const rawSeverity = formData.get("severity") as string;
    const severity = rawSeverity.startsWith("Critical") ? "Critical" : rawSeverity.startsWith("Low") ? "Low" : rawSeverity;
    const auditType = (formData.get("auditType") || formData.get("type") || "Internal Audit") as string;

    const payload = {
      id: `CAP-${Date.now().toString().slice(-3)}`,
      issue: formData.get("issue") as string,
      auditType,
      type: auditType,
      severity,
      deadline: formData.get("deadline") as string,
      assignee: formData.get("assignee") as string,
      status: "Open"
    };

    const res = await createCAP(payload);
    setIsModalOpen(false);

    if (!res.error) {
      toast.success("Audit finding and CAP logged successfully!");
    } else {
      const errorObj = res.error as { data?: { message?: string } };
      const errorMsg = errorObj.data?.message || "Failed to log finding";
      toast.error(errorMsg);
    }
  };

  const handleAddDocSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      id: `DOC-${Date.now().toString().slice(-3)}`,
      name: formData.get("name") as string,
      authority: formData.get("authority") as string,
      issueDate: formData.get("issueDate") as string,
      expiryDate: formData.get("expiryDate") as string,
      status: "Valid"
    };

    const res = await createLegalDoc(payload);
    setIsAddDocModalOpen(false);

    if (!res.error) {
      toast.success("Document uploaded and saved to repository!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to upload document";
      toast.error(errorMsg);
    }
  };

  const handleAddCommitteeSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: `COM-${Date.now().toString().slice(-3)}`,
      name: formData.get("name") as string,
      members: Number(formData.get("members")),
      lastMeeting: formData.get("lastMeeting") as string,
      nextMeeting: formData.get("nextMeeting") as string,
      status: "Active"
    };

    const res = await createCommittee(payload);
    setIsAddCommitteeModalOpen(false);

    if (!res.error) {
      toast.success("New committee created and scheduled successfully!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to create committee";
      toast.error(errorMsg);
    }
  };

  const handleDownloadReport = () => {
    toast.success("Generating Compliance Report (PDF)...");
  };

  // Audit Reports Handlers
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
      const res = await uploadDocument(body).unwrap();
      toast.success(res.message || "Audit Report uploaded successfully!");
      setIsAddReportModalOpen(false);
      setReportFile(null);
      if (reportFileInputRef.current) reportFileInputRef.current.value = "";
    } catch (err: unknown) {
      const errObj = err as { data?: { message?: string } };
      toast.error(errObj.data?.message || "Failed to upload report.");
    }
  };

  const handleReportDeleteConfirm = async () => {
    if (!reportToDelete) return;
    try {
      await deleteDocument(reportToDelete).unwrap();
      toast.success("Audit report deleted successfully!");
      if (previewReport?._id === reportToDelete) setPreviewReport(null);
    } catch {
      toast.error("Failed to delete report.");
    } finally {
      setReportToDelete(null);
    }
  };

  const handleDownloadReportFile = (doc: IDocumentItem) => {
    if (!doc.fileUrl) {
      toast.error("File URL is not available.");
      return;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const serverHost = apiBase.replace("/api/v1", "");
    const url = doc.fileUrl.startsWith("http") ? doc.fileUrl : `${serverHost}${doc.fileUrl}`;
    
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

  const getReportFileUrl = (relativeOrAbsoluteUrl: string) => {
    if (!relativeOrAbsoluteUrl) return "";
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const serverHost = apiBase.replace("/api/v1", "");
    return relativeOrAbsoluteUrl.startsWith("http") ? relativeOrAbsoluteUrl : `${serverHost}${relativeOrAbsoluteUrl}`;
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

  // Tab 6: Supplier Assessment, Approval & Tracking State
  const [supplierSubView, setSupplierSubView] = useState<'form' | 'dashboard'>('form');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  const initialSupplierForm = {
    supplierName: '',
    businessType: 'Manufacturer',
    address: '',
    productCategory: 'Dyes & Chemicals',
    contactPerson: '',
    tradeLicenseNo: '',
    phone: '',
    email: '',
  };
  const [supplierForm, setSupplierForm] = useState(initialSupplierForm);

  const initialAssessmentRow: IAssessmentItem = {
    standard: 'ZDHC MRSL',
    auditType: 'Initial',
    auditDate: new Date().toISOString().split('T')[0],
    score: 90,
    certValidUntil: '',
    certStatus: 'Valid',
    reportLink: '',
    approval: 'Pending',
    conditions: '',
    approvedBy: '',
    nextReview: '',
  };
  const [assessmentRows, setAssessmentRows] = useState<IAssessmentItem[]>([initialAssessmentRow]);

  // Tracking Dashboard Filters
  const [filterStandard, setFilterStandard] = useState<string>('All');
  const [filterApproval, setFilterApproval] = useState<string>('All');
  const [filterCertStatus, setFilterCertStatus] = useState<string>('All');
  const [filterSearch, setFilterSearch] = useState<string>('');

  const handleAddAssessmentRow = () => {
    setAssessmentRows((prev) => [
      ...prev,
      {
        standard: 'OEKO-TEX',
        auditType: 'Surveillance',
        auditDate: new Date().toISOString().split('T')[0],
        score: 85,
        certValidUntil: '',
        certStatus: 'Valid',
        reportLink: '',
        approval: 'Pending',
        conditions: '',
        approvedBy: '',
        nextReview: '',
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

  const handleSaveSupplier = async () => {
    if (!supplierForm.supplierName.trim()) {
      toast.error("Supplier Name is required.");
      return;
    }

    try {
      const payload = {
        ...supplierForm,
        assessments: assessmentRows,
      };

      if (selectedSupplierId) {
        await updateSupplier({ id: selectedSupplierId, body: payload }).unwrap();
        toast.success("Supplier record updated successfully!");
      } else {
        await createSupplier(payload).unwrap();
        toast.success("Supplier record saved successfully!");
      }

      handleResetSupplierForm();
    } catch (err: unknown) {
      const errObj = err as { data?: { message?: string } };
      toast.error(errObj.data?.message || "Failed to save supplier record.");
    }
  };

  const handleEditSupplier = (supplier: ISupplierRecord) => {
    setSelectedSupplierId(supplier._id);
    setSupplierForm({
      supplierName: supplier.supplierName || '',
      businessType: supplier.businessType || 'Manufacturer',
      address: supplier.address || '',
      productCategory: supplier.productCategory || 'Dyes & Chemicals',
      contactPerson: supplier.contactPerson || '',
      tradeLicenseNo: supplier.tradeLicenseNo || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
    });
    if (supplier.assessments && supplier.assessments.length > 0) {
      setAssessmentRows(supplier.assessments);
    } else {
      setAssessmentRows([initialAssessmentRow]);
    }
    setSupplierSubView('form');
    toast.success(`Loaded "${supplier.supplierName}" for editing`);
  };

  const handleDeleteSupplierConfirm = async () => {
    if (!supplierToDelete) return;
    try {
      await deleteSupplier(supplierToDelete).unwrap();
      toast.success("Supplier record deleted successfully!");
      if (selectedSupplierId === supplierToDelete) {
        handleResetSupplierForm();
      }
    } catch {
      toast.error("Failed to delete supplier record.");
    } finally {
      setSupplierToDelete(null);
    }
  };

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
            standard: 'General Compliance',
            auditType: 'Initial',
            score: 0,
            certStatus: 'Valid',
            approval: 'Pending',
            nextReview: '',
          },
          originalSupplier: sup,
        });
      }
    });

    return list.filter((item) => {
      if (filterStandard !== 'All' && item.assessment.standard !== filterStandard) return false;
      if (filterApproval !== 'All' && item.assessment.approval !== filterApproval) return false;
      if (filterCertStatus !== 'All' && item.assessment.certStatus !== filterCertStatus) return false;
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase();
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
    const headers = ["SUPPLIER", "BUSINESS TYPE", "STANDARD", "AUDIT TYPE", "AUDIT DATE", "SCORE", "CERT VALID UNTIL", "CERT STATUS", "APPROVAL", "NEXT REVIEW"];
    const rows = flattenedAssessments.map(item => [
      `"${item.supplierName}"`,
      `"${item.businessType}"`,
      `"${item.assessment.standard}"`,
      `"${item.assessment.auditType}"`,
      `"${item.assessment.auditDate || ''}"`,
      `"${item.assessment.score ?? ''}"`,
      `"${item.assessment.certValidUntil || ''}"`,
      `"${item.assessment.certStatus || ''}"`,
      `"${item.assessment.approval || ''}"`,
      `"${item.assessment.nextReview || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Supplier_Assessment_Tracking_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported assessment records successfully!");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Overdue':
      case 'Expired':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full text-xs font-medium flex items-center w-fit"><AlertTriangle className="w-3 h-3 mr-1" /> {status}</span>;
      case 'In Progress':
      case 'Expiring Soon':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> {status}</span>;
      case 'Closed':
      case 'Valid':
      case 'Active':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full text-xs font-medium flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> {status}</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium w-fit">{status}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return <span className="text-red-600 dark:text-red-400 font-bold text-xs">CRITICAL</span>;
      case 'High': return <span className="text-orange-600 dark:text-orange-400 font-semibold text-xs">HIGH</span>;
      case 'Medium': return <span className="text-yellow-600 dark:text-yellow-400 font-medium text-xs">MEDIUM</span>;
      case 'Low': return <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">LOW</span>;
      default: return <span>{severity}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance & Audits</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage CAPs, Legal Permits, and Committees seamlessly.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            className="bg-white dark:bg-zinc-900 border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Report
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all flex items-center shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-1" /> Log Finding
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><ShieldAlert className="w-4 h-4 mr-1.5 text-red-500" /> Open CAPs</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">12</h3>
              <p className="text-xs text-red-500 mt-2 font-medium">3 Overdue</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-yellow-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><FileWarning className="w-4 h-4 mr-1.5 text-yellow-500" /> Expiring Permits</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">2</h3>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 font-medium">In next 30 days</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" /> Closed Findings</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">45</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2 font-medium">This year (78% completion)</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-1.5 text-blue-500" /> Active Committees</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">3</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">1 meeting pending this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border mb-4 no-scrollbar">
        {[
          { id: 'audits', label: 'Audit & CAP', icon: Scale },
          { id: 'legal', label: 'Legal & Documents', icon: FileBadge },
          { id: 'committees', label: 'Committees', icon: Users },
          { id: 'reports', label: 'Audit Reports & Certifications', icon: Award },
          { id: 'suppliers', label: 'Supplier Assessment, Approval & Tracking', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center",
              activeTab === tab.id 
                ? "text-emerald-600 dark:text-emerald-400" 
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

      {/* Tab Content */}
      <div className="animate-in slide-in-from-bottom-2 duration-500">
        
        {/* TAB 1: Audits & CAP */}
        {activeTab === 'audits' && (
          <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Corrective Action Plan (CAP) Tracker</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage and track resolutions for all internal and external audit findings.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">CAP ID</th>
                    <th className="p-4 font-medium">Issue / Finding</th>
                    <th className="p-4 font-medium">Audit Type</th>
                    <th className="p-4 font-medium">Severity</th>
                    <th className="p-4 font-medium">Deadline</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {caps.map((cap: any, idx: number) => (
                    <tr key={cap._id || cap.capId || cap.id || `cap-${idx}`} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-muted-foreground">{cap.capId || cap.id || cap._id || `CAP-00${idx + 1}`}</td>
                      <td className="p-4 font-medium text-foreground max-w-xs truncate" title={cap.issue}>{cap.issue}</td>
                      <td className="p-4 text-muted-foreground">{cap.type}</td>
                      <td className="p-4">{getSeverityBadge(cap.severity)}</td>
                      <td className={cn("p-4 font-medium", cap.status === 'Overdue' ? "text-red-500" : "text-foreground")}>{cap.deadline}</td>
                      <td className="p-4 flex justify-end">{getStatusBadge(cap.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Legal & Documents */}
        {activeTab === 'legal' && (
          <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Legal Permits & Certificates</h3>
                <p className="text-sm text-muted-foreground mt-1">Track validity and renewal dates for all mandatory licenses.</p>
              </div>
              <button onClick={() => setIsAddDocModalOpen(true)} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Document
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Document Name</th>
                    <th className="p-4 font-medium">Authority</th>
                    <th className="p-4 font-medium">Issue Date</th>
                    <th className="p-4 font-medium">Expiry Date</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {legalDocs.map((doc: any, idx: number) => (
                    <tr key={doc._id || doc.docId || doc.id || `doc-${idx}`} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground flex items-center">
                        <FileText className="w-4 h-4 text-muted-foreground mr-2" /> {doc.name}
                      </td>
                      <td className="p-4 text-muted-foreground">{doc.authority}</td>
                      <td className="p-4 text-muted-foreground">{doc.issueDate}</td>
                      <td className="p-4 font-medium">{doc.expiryDate}</td>
                      <td className="p-4 flex justify-end">{getStatusBadge(doc.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Committees */}
        {activeTab === 'committees' && (
          <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Committee Management</h3>
                <p className="text-sm text-muted-foreground mt-1">Track worker participation and regulatory compliance committees.</p>
              </div>
              <button onClick={() => setIsAddCommitteeModalOpen(true)} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline flex items-center">
                <Plus className="w-4 h-4 mr-1" /> New Committee
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Committee Name</th>
                    <th className="p-4 font-medium">Total Members</th>
                    <th className="p-4 font-medium">Last Meeting</th>
                    <th className="p-4 font-medium">Next Scheduled Meeting</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {committees.map((com: any, idx: number) => (
                    <tr key={com._id || com.comId || com.id || `com-${idx}`} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground">{com.name}</td>
                      <td className="p-4 text-muted-foreground flex items-center">
                        <Users className="w-4 h-4 mr-1.5 opacity-70" /> {com.members}
                      </td>
                      <td className="p-4 text-muted-foreground">{com.lastMeeting}</td>
                      <td className="p-4 font-medium flex items-center text-emerald-600 dark:text-emerald-500">
                        <Calendar className="w-4 h-4 mr-1.5" /> {com.nextMeeting}
                      </td>
                      <td className="p-4 flex justify-end">{getStatusBadge(com.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: Audit Reports & Certifications */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Action Bar & Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-4 border border-border/50 bg-emerald-500/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Reports / Certs</p>
                    <p className="text-2xl font-bold text-foreground">{auditReports.length}</p>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-xl p-4 border border-border/50 bg-blue-500/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Passed / Verified</p>
                    <p className="text-2xl font-bold text-foreground">
                      {auditReports.filter((r: IDocumentItem) => r.status?.toLowerCase() === 'passed' || r.status?.toLowerCase() === 'active').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="glass-card rounded-xl p-4 border border-border/50 bg-purple-500/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Latest Upload</p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {auditReports[0]?.createdAt ? new Date(auditReports[0].createdAt).toLocaleDateString() : 'No records yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Table Card */}
            <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border/50 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" /> Audit Reports & Third-Party Certifications
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Third-party audit reports (WRAP, BSCI, SEDEX SMETA, ISO, Higg FEM) and compliance certificates.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search reports or agencies..."
                      value={reportSearchQuery}
                      onChange={(e) => setReportSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-2 text-xs sm:text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-48 sm:w-64"
                    />
                    {reportSearchQuery && (
                      <button
                        onClick={() => setReportSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setIsAddReportModalOpen(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all flex items-center shadow-sm hover:shadow-md hover:-translate-y-0.5 shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Upload Report
                  </button>
                </div>
              </div>

              {/* Table or Empty State */}
              {isReportsLoading ? (
                <div className="flex flex-col items-center justify-center p-16 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-600" />
                  <p className="text-sm">Loading audit reports & certificates...</p>
                </div>
              ) : filteredAuditReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-semibold text-foreground">No Audit Reports Found</h4>
                  <p className="text-sm text-muted-foreground max-w-md mt-1 mb-5">
                    {reportSearchQuery 
                      ? "No reports match your current search query. Try clearing the filter."
                      : "Upload third-party audit reports (WRAP, BSCI, SEDEX, Higg FEM) and compliance certifications to maintain a complete compliance audit trail."}
                  </p>
                  {reportSearchQuery ? (
                    <button
                      onClick={() => setReportSearchQuery("")}
                      className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" /> Clear Search
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAddReportModalOpen(true)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all flex items-center shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-1.5" /> Upload First Audit Report
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4 font-medium">#</th>
                        <th className="p-4 font-medium">Report / Certificate Name</th>
                        <th className="p-4 font-medium">Auditing Body</th>
                        <th className="p-4 font-medium">Rating / Score</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Uploaded Date</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredAuditReports.map((doc: IDocumentItem, idx: number) => {
                        const fileExt = doc.fileUrl ? doc.fileUrl.split('.').pop()?.toUpperCase() : 'DOC';
                        return (
                          <tr key={doc._id || `report-${idx}`} className="hover:bg-muted/20 transition-colors">
                            <td className="p-4 text-xs text-muted-foreground font-mono">{idx + 1}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                                  {fileExt === 'PDF' ? (
                                    <FileText className="w-4 h-4" />
                                  ) : fileExt === 'XLSX' || fileExt === 'XLS' ? (
                                    <FileSpreadsheet className="w-4 h-4" />
                                  ) : (
                                    <Award className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <button
                                    onClick={() => setPreviewReport(doc)}
                                    className="font-medium text-foreground hover:text-emerald-600 transition-colors text-left truncate block max-w-[280px]"
                                    title={doc.name}
                                  >
                                    {doc.name}
                                  </button>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[11px] px-1.5 py-0.5 bg-muted rounded text-muted-foreground uppercase font-mono font-medium">
                                      {fileExt}
                                    </span>
                                    {doc.fileSize && (
                                      <span className="text-[11px] text-muted-foreground">
                                        {isNaN(Number(doc.fileSize)) ? doc.fileSize : `${(Number(doc.fileSize) / (1024 * 1024)).toFixed(2)} MB`}
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
                              <span className="font-medium text-foreground">
                                {doc.supplierName || "Third-Party"}
                              </span>
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
                              {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPreviewReport(doc)}
                                  title="View Document"
                                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDownloadReportFile(doc)}
                                  title="Download File"
                                  className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md transition-colors"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setReportToDelete(doc._id)}
                                  title="Delete Report"
                                  className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
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
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Supplier Assessment, Approval & Tracking */}
        {activeTab === 'suppliers' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Top Factory Header Banner (as in screenshots) */}
            <div className="bg-[#0b1727] text-white p-4 rounded-xl shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold tracking-wider">MG SHIRTEX LTD.</h2>
                <p className="text-xs text-slate-400">32, Lakshmipura, Chandana, Joydebpur, Gazipur-1700</p>
              </div>
              <div className="text-center">
                <h1 className="text-lg md:text-xl font-bold tracking-wide text-white">Supplier Assessment, Approval & Tracking</h1>
                <p className="text-xs text-slate-300 font-sans">Vendor Evaluation & Compliance Management</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                  <span className="text-slate-300">Date:</span>
                  <span className="font-mono text-white font-medium">{new Date().toLocaleDateString('en-GB')}</span>
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
              
              {/* LEFT SIDEBAR: Steps & Results */}
              <div className="w-full lg:w-56 shrink-0 space-y-4">
                <div className="bg-[#0b1727] border border-slate-800 rounded-xl p-4 text-white space-y-5 shadow-sm">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Steps</p>
                    <button
                      onClick={() => setSupplierSubView('form')}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
                        supplierSubView === 'form' 
                          ? "bg-blue-600/30 text-blue-400 border border-blue-500/40 font-semibold" 
                          : "text-slate-300 hover:bg-slate-800/60"
                      )}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Supplier Info & Assessment
                    </button>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Results</p>
                    <button
                      onClick={() => setSupplierSubView('dashboard')}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2",
                        supplierSubView === 'dashboard' 
                          ? "bg-blue-600/30 text-blue-400 border border-blue-500/40 font-semibold" 
                          : "text-slate-300 hover:bg-slate-800/60"
                      )}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Tracking Dashboard
                    </button>
                  </div>

                  {/* Left Sidebar Action Buttons */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <button
                      onClick={handleSaveSupplier}
                      disabled={isSavingSupplier || isUpdatingSupplier}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isSavingSupplier || isUpdatingSupplier ? "Saving..." : "Save Record"}
                    </button>
                    <button
                      onClick={() => {
                        setSupplierSubView('dashboard');
                        toast.success("Tracking Dashboard loaded");
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border border-slate-700 transition-all"
                    >
                      <Search className="w-3.5 h-3.5 text-amber-400" />
                      Search & Filter
                    </button>
                    <button
                      onClick={handleResetSupplierForm}
                      className="w-full bg-slate-800/50 hover:bg-red-950/40 hover:text-red-300 text-slate-400 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border border-slate-800 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* CENTER CONTENT: Form OR Dashboard */}
              <div className="flex-1 min-w-0 space-y-4">
                {supplierSubView === 'form' ? (
                  /* VIEW 1: Form View (Screenshot 1) */
                  <div className="glass-card rounded-xl border border-border/60 shadow-sm p-5 space-y-5 bg-background">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-foreground">Supplier Info & Assessment</h3>
                        <span className="h-0.5 w-16 bg-blue-600 rounded-full" />
                      </div>
                      <span className="text-xs font-mono font-medium text-muted-foreground">Step 1 of 1</span>
                    </div>

                    {/* Basic Supplier Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Supplier Name *</label>
                        <input
                          type="text"
                          required
                          value={supplierForm.supplierName}
                          onChange={(e) => setSupplierForm({ ...supplierForm, supplierName: e.target.value })}
                          placeholder="e.g., ABC Chemical & Dyestuff Co."
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Business Type</label>
                        <select
                          value={supplierForm.businessType}
                          onChange={(e) => setSupplierForm({ ...supplierForm, businessType: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
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
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Product/Service Category</label>
                        <input
                          type="text"
                          value={supplierForm.productCategory}
                          onChange={(e) => setSupplierForm({ ...supplierForm, productCategory: e.target.value })}
                          placeholder="e.g., Dyes & Auxiliaries / Finishing Chemicals"
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Contact Person</label>
                        <input
                          type="text"
                          value={supplierForm.contactPerson}
                          onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                          placeholder="e.g., Md. Rafiqul Islam"
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Trade License No.</label>
                        <input
                          type="text"
                          value={supplierForm.tradeLicenseNo}
                          onChange={(e) => setSupplierForm({ ...supplierForm, tradeLicenseNo: e.target.value })}
                          placeholder="e.g., TRAD/DNCC/012938/2026"
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Phone</label>
                        <input
                          type="text"
                          value={supplierForm.phone}
                          onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                          placeholder="e.g., +880 1711 000000"
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">Email</label>
                        <input
                          type="email"
                          value={supplierForm.email}
                          onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                          placeholder="e.g., contact@supplier.com"
                          className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Assessments Table (as in Screenshot 1) */}
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground">Assessments (one per standard / audit cycle)</h4>
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
                              <tr key={row._id || `assess-row-${idx}`} className="hover:bg-muted/20 transition-colors">
                                <td className="p-2">
                                  <select
                                    value={row.standard}
                                    onChange={(e) => handleAssessmentChange(idx, 'standard', e.target.value)}
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
                                    onChange={(e) => handleAssessmentChange(idx, 'auditType', e.target.value)}
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
                                    value={row.auditDate || ''}
                                    onChange={(e) => handleAssessmentChange(idx, 'auditDate', e.target.value)}
                                    className="w-28 bg-background border border-border rounded px-2 py-1 text-xs"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={row.score ?? ''}
                                    onChange={(e) => handleAssessmentChange(idx, 'score', Number(e.target.value))}
                                    className="w-16 bg-background border border-border rounded px-2 py-1 text-xs"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="date"
                                    value={row.certValidUntil || ''}
                                    onChange={(e) => handleAssessmentChange(idx, 'certValidUntil', e.target.value)}
                                    className="w-28 bg-background border border-border rounded px-2 py-1 text-xs"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    placeholder="Link"
                                    value={row.reportLink || ''}
                                    onChange={(e) => handleAssessmentChange(idx, 'reportLink', e.target.value)}
                                    className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                                  />
                                </td>
                                <td className="p-2">
                                  <select
                                    value={row.approval}
                                    onChange={(e) => handleAssessmentChange(idx, 'approval', e.target.value as any)}
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
                                    value={row.conditions || ''}
                                    onChange={(e) => handleAssessmentChange(idx, 'conditions', e.target.value)}
                                    className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="text"
                                    placeholder="Auditor"
                                    value={row.approvedBy || ''}
                                    onChange={(e) => handleAssessmentChange(idx, 'approvedBy', e.target.value)}
                                    className="w-24 bg-background border border-border rounded px-2 py-1 text-xs"
                                  />
                                </td>
                                <td className="p-2">
                                  <input
                                    type="date"
                                    value={row.nextReview || ''}
                                    onChange={(e) => handleAssessmentChange(idx, 'nextReview', e.target.value)}
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
                  /* VIEW 2: Tracking Dashboard View (Screenshot 2 & 3) */
                  <div className="glass-card rounded-xl border border-border/60 shadow-sm p-5 space-y-4 bg-background">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-foreground">Supplier Assessment Tracking</h3>
                        <span className="h-0.5 w-16 bg-blue-600 rounded-full" />
                      </div>
                      <span className="text-xs font-mono font-medium text-emerald-600">100%</span>
                    </div>

                    {/* Filter Bar (Screenshot 2 & 3) */}
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
                        <label className="text-[11px] font-medium text-muted-foreground">Search (Supplier / Auditor / Score)</label>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={filterSearch}
                          onChange={(e) => setFilterSearch(e.target.value)}
                          className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    {/* Count & Print Row */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        {flattenedAssessments.length} of {suppliersList.reduce((acc, s) => acc + (s.assessments?.length || 1), 0)} assessment(s) across {suppliersList.length} supplier(s)
                      </span>
                      <button
                        onClick={() => window.print()}
                        className="bg-[#0b1727] hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print This View
                      </button>
                    </div>

                    {/* Detailed Data Table (Screenshot 2 & 3) */}
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
                        <tbody className="divide-y divide-border">
                          {flattenedAssessments.length === 0 ? (
                            <tr>
                              <td colSpan={11} className="py-12 text-center text-muted-foreground">
                                <p className="text-xs font-medium">No assessments match the current filters</p>
                              </td>
                            </tr>
                          ) : (
                            flattenedAssessments.map((item, idx) => (
                              <tr key={item.assessment._id || `${item.supplierId}-${item.assessment.standard}-${idx}`} className="hover:bg-muted/20 transition-colors">
                                <td className="p-3 font-medium text-foreground">{item.supplierName}</td>
                                <td className="p-3 text-muted-foreground">{item.businessType}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                                    {item.assessment.standard}
                                  </span>
                                </td>
                                <td className="p-3 text-muted-foreground">{item.assessment.auditType}</td>
                                <td className="p-3 text-muted-foreground">{item.assessment.auditDate || '—'}</td>
                                <td className="p-3 font-semibold">{item.assessment.score ? `${item.assessment.score}%` : '—'}</td>
                                <td className="p-3 text-muted-foreground">{item.assessment.certValidUntil || '—'}</td>
                                <td className="p-3">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-medium",
                                    item.assessment.certStatus === 'Valid' ? "bg-emerald-500/10 text-emerald-600" :
                                    item.assessment.certStatus === 'Expiring Soon' ? "bg-amber-500/10 text-amber-600" :
                                    "bg-red-500/10 text-red-600"
                                  )}>
                                    {item.assessment.certStatus || 'Valid'}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                                    item.assessment.approval === 'Approved' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" :
                                    item.assessment.approval === 'Conditionally Approved' ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" :
                                    item.assessment.approval === 'Rejected' ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300" :
                                    "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                                  )}>
                                    {item.assessment.approval}
                                  </span>
                                </td>
                                <td className="p-3 text-muted-foreground">{item.assessment.nextReview || '—'}</td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleEditSupplier(item.originalSupplier)}
                                      className="p-1 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-600 rounded"
                                      title="Edit Record"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setSupplierToDelete(item.supplierId)}
                                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded"
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

              {/* RIGHT SIDEBAR: Live Metrics, Saved Records & Print/Export */}
              <div className="w-full lg:w-64 shrink-0 space-y-4">
                {/* Live Metrics */}
                <div className="glass-card rounded-xl border border-border/60 shadow-sm p-4 bg-background space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Metrics</h4>
                  <div className="space-y-2 text-xs divide-y divide-border/50">
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-muted-foreground">Supplier</span>
                      <span className="font-semibold text-foreground truncate max-w-[120px]">
                        {supplierForm.supplierName || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-muted-foreground">Total Assessments</span>
                      <span className="font-bold text-foreground">
                        {supplierSubView === 'form' ? assessmentRows.length : flattenedAssessments.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-muted-foreground">Business Type</span>
                      <span className="font-medium text-foreground">
                        {supplierForm.businessType || 'Manufacturer'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Saved Records */}
                <div className="glass-card rounded-xl border border-border/60 shadow-sm p-4 bg-background space-y-3">
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
                          className="p-2.5 rounded-lg border border-border hover:border-blue-500/50 hover:bg-muted/30 transition-all flex items-center justify-between group cursor-pointer"
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

                {/* Print & Export */}
                <div className="glass-card rounded-xl border border-border/60 shadow-sm p-4 bg-background space-y-2.5">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Print & Export</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 bg-background border border-border hover:bg-muted text-foreground py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Printer className="w-3.5 h-3.5 text-muted-foreground" /> Print
                    </button>
                    <button
                      onClick={handleExportSuppliers}
                      className="flex-1 bg-background border border-border hover:bg-muted text-foreground py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-muted-foreground" /> Export ▾
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* 1. Log Finding Modal (CAP) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Audit Finding (CAP)" maxWidthClass="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-5 px-1 pb-2 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Issue Description / Finding</label>
            <textarea 
              name="issue"
              required 
              placeholder="Detailed description of the non-compliance..." 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all h-24 resize-none" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Audit Type</label>
              <select name="auditType" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all appearance-none">
                <option>Internal Audit</option>
                <option>Third-Party Audit (e.g., Sedex, BSCI)</option>
                <option>Brand Audit (e.g., H&M, Zara)</option>
                <option>Regulatory Inspection</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Severity</label>
              <select name="severity" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all appearance-none">
                <option>Critical (Zero Tolerance)</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low (Observation)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Resolution Deadline</label>
              <input 
                name="deadline"
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Assignee (Responsible Person)</label>
              <input 
                name="assignee"
                type="text" 
                placeholder="e.g., HR Manager" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              Save Finding
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Add Legal Document Modal */}
      <Modal isOpen={isAddDocModalOpen} onClose={() => setIsAddDocModalOpen(false)} title="Upload Legal Document" maxWidthClass="max-w-2xl">
        <form onSubmit={handleAddDocSave} className="space-y-5 px-1 pb-2 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Document / Permit Name</label>
              <input 
                name="name"
                type="text" 
                placeholder="e.g., Environmental Clearance" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Issuing Authority</label>
              <input 
                name="authority"
                type="text" 
                placeholder="e.g., Department of Environment" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Issue Date</label>
              <input 
                name="issueDate"
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Expiry Date</label>
              <input 
                name="expiryDate"
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Upload Document (PDF, JPG)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer bg-background">
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max. 10MB)</p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
            <button type="button" onClick={() => setIsAddDocModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center">
              <UploadCloud className="w-4 h-4 mr-2" /> Upload & Save
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. New Committee Modal */}
      <Modal isOpen={isAddCommitteeModalOpen} onClose={() => setIsAddCommitteeModalOpen(false)} title="Create New Committee" maxWidthClass="max-w-md">
        <form onSubmit={handleAddCommitteeSave} className="space-y-5 px-1 pb-2 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Committee Name</label>
            <input 
              name="name"
              type="text" 
              placeholder="e.g., Safety & Health Committee" 
              required 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Total Members</label>
            <input 
              name="members"
              type="number" 
              placeholder="e.g., 12" 
              required
              min="1"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Formation / Last Meeting Date</label>
            <input 
              name="lastMeeting"
              type="date" 
              required 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Next Scheduled Meeting</label>
            <div className="relative">
              <input 
                name="nextMeeting"
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
            <button type="button" onClick={() => setIsAddCommitteeModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              Create Committee
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Upload Audit Report Modal */}
      <Modal isOpen={isAddReportModalOpen} onClose={() => { setIsAddReportModalOpen(false); setReportFile(null); }} title="Upload Audit Report / Certification" maxWidthClass="max-w-xl">
        <form onSubmit={handleReportUpload} className="space-y-4 px-1 pb-2 mt-2">
          {/* File input box */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Audit Document File *</label>
            <div 
              onClick={() => reportFileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                reportFile ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:bg-muted/30 bg-background"
              )}
            >
              <input 
                ref={reportFileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setReportFile(e.target.files[0]);
                  }
                }} 
              />
              <UploadCloud className={cn("w-9 h-9 mb-2", reportFile ? "text-emerald-600" : "text-muted-foreground")} />
              {reportFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 break-all">{reportFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(reportFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change file</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Click to select audit report file</p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, JPG, PNG (Max 25MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Report / Certificate Name *</label>
              <input 
                name="name"
                type="text" 
                placeholder="e.g., SEDEX SMETA 4-Pillar Audit 2026" 
                defaultValue={reportFile ? reportFile.name.replace(/\.[^/.]+$/, "") : ""}
                required 
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Auditing Agency / Body</label>
              <input 
                name="agency"
                type="text" 
                placeholder="e.g., SGS, Intertek, Bureau Veritas" 
                defaultValue="SGS"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Audit Rating / Grade</label>
              <input 
                name="rating"
                type="text" 
                placeholder="e.g., Grade A (94%), Certified" 
                defaultValue="Verified (Grade A)"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select 
                name="status"
                defaultValue="Passed"
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all"
              >
                <option value="Passed">Passed / Certified</option>
                <option value="Under Review">Under Review</option>
                <option value="Action Required">Action Required</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Remarks / Observations</label>
            <textarea 
              name="remarks"
              placeholder="Additional notes, scope, or finding summaries..."
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all h-20 resize-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-border mt-5">
            <button 
              type="button" 
              onClick={() => { setIsAddReportModalOpen(false); setReportFile(null); }} 
              className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUploadingReport || !reportFile}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center"
            >
              {isUploadingReport ? (
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

      {/* 5. Document Preview Modal */}
      <Modal isOpen={Boolean(previewReport)} onClose={() => setPreviewReport(null)} title={previewReport?.name || "Report Preview"} maxWidthClass="max-w-4xl">
        {previewReport && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-muted/30 rounded-xl text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{previewReport.supplierName || "Audit Body"}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-medium">
                  {previewReport.version || "Verified"}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {previewReport.createdAt ? new Date(previewReport.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              <button
                onClick={() => handleDownloadReportFile(previewReport)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </button>
            </div>

            <div className="w-full min-h-[60vh] max-h-[75vh] flex items-center justify-center bg-zinc-950/5 dark:bg-zinc-950/50 rounded-xl overflow-hidden border border-border">
              {previewReport.fileUrl?.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={getReportFileUrl(previewReport.fileUrl)}
                  className="w-full h-[70vh] border-0"
                  title={previewReport.name}
                />
              ) : previewReport.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                <img
                  src={getReportFileUrl(previewReport.fileUrl)}
                  alt={previewReport.name}
                  className="max-h-[70vh] max-w-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                  <p className="text-base font-medium text-foreground mb-1">Preview not supported for this file type</p>
                  <p className="text-sm text-muted-foreground mb-4">Please download the file to view its full contents.</p>
                  <button
                    onClick={() => handleDownloadReportFile(previewReport)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Download {previewReport.name}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 6. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(reportToDelete)}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleReportDeleteConfirm}
        title="Delete Audit Report"
        message="Are you sure you want to delete this audit report? This action cannot be undone."
        confirmText="Delete Report"
        isDestructive={true}
      />

      {/* 7. Delete Supplier Confirmation Modal */}
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
}
