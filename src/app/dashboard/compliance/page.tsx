"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetComplianceOverviewQuery,
  useCreateCAPMutation,
  useCreateLegalDocMutation,
  useCreateCommitteeMutation,
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from "@/lib/redux/slices/complianceApi";
import {
  useGetDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} from "@/lib/redux/slices/documentsApi";

import { TabType } from "./types";
import { ComplianceHeader } from "./components/ComplianceHeader";
import { AuditsTab } from "./components/AuditsTab";
import { LegalDocsTab } from "./components/LegalDocsTab";
import { CommitteesTab } from "./components/CommitteesTab";
import { AuditReportsTab } from "./components/AuditReportsTab";
import { SuppliersTab } from "./components/SuppliersTab";

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<TabType>("audits");

  // RTK Queries & Mutations
  const {
    data: complianceData,
    refetch: refetchCompliance,
  } = useGetComplianceOverviewQuery();

  const [createCAP] = useCreateCAPMutation();
  const [createLegalDoc] = useCreateLegalDocMutation();
  const [createCommittee] = useCreateCommitteeMutation();

  // Documents & Audit Reports
  const {
    data: auditReports = [],
    isLoading: isReportsLoading,
    refetch: refetchReports,
  } = useGetDocumentsQuery({ category: "Audit Reports" });
  const [uploadDocument] = useUploadDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  // Suppliers Assessment
  const {
    data: suppliersList = [],
    isLoading: isSuppliersLoading,
    refetch: refetchSuppliers,
  } = useGetSuppliersQuery();
  const [createSupplier] = useCreateSupplierMutation();
  const [updateSupplier] = useUpdateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const caps = complianceData?.caps || [];
  const legalDocs = complianceData?.legalDocs || [];
  const committees = complianceData?.committees || [];

  // Modals for Top Actions / Tab 1-3
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] = useState(false);

  // Handlers
  const handleSaveFinding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const rawSeverity = formData.get("severity") as string;
    const severity = rawSeverity.startsWith("Critical")
      ? "Critical"
      : rawSeverity.startsWith("Low")
      ? "Low"
      : rawSeverity;
    const auditType = (formData.get("auditType") ||
      formData.get("type") ||
      "Internal Audit") as string;

    const payload = {
      id: `CAP-${Date.now().toString().slice(-3)}`,
      issue: formData.get("issue") as string,
      auditType,
      type: auditType,
      severity,
      deadline: formData.get("deadline") as string,
      assignee: formData.get("assignee") as string,
      status: "Open",
    };

    const res = await createCAP(payload);
    setIsModalOpen(false);

    if (!res.error) {
      toast.success("Audit finding and CAP logged successfully!");
      refetchCompliance();
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
      status: "Valid",
    };

    const res = await createLegalDoc(payload);
    setIsAddDocModalOpen(false);

    if (!res.error) {
      toast.success("Document uploaded and saved to repository!");
      refetchCompliance();
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
      status: "Active",
    };

    const res = await createCommittee(payload);
    setIsAddCommitteeModalOpen(false);

    if (!res.error) {
      toast.success("New committee created and scheduled successfully!");
      refetchCompliance();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to create committee";
      toast.error(errorMsg);
    }
  };

  const handleDownloadReport = () => {
    toast.success("Generating Compliance Report (PDF)...");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500 w-full min-w-0 flex-1">
      {/* Header & KPI Summary Cards */}
      <ComplianceHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFindingModal={() => setIsModalOpen(true)}
        onDownloadReport={handleDownloadReport}
        openCapsCount={caps.length > 0 ? caps.filter((c: any) => c.status !== "Closed").length : 12}
        expiringPermitsCount={
          legalDocs.length > 0 ? legalDocs.filter((d: any) => d.status === "Expiring Soon").length : 2
        }
        closedFindingsCount={
          caps.length > 0 ? caps.filter((c: any) => c.status === "Closed").length : 45
        }
        activeCommitteesCount={committees.length > 0 ? committees.length : 3}
      />

      {/* Tab Contents */}
      <div className="animate-in slide-in-from-bottom-2 duration-500">
        {activeTab === "audits" && (
          <AuditsTab
            caps={caps}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            onSaveFinding={handleSaveFinding}
          />
        )}

        {activeTab === "legal" && (
          <LegalDocsTab
            legalDocs={legalDocs}
            isAddDocModalOpen={isAddDocModalOpen}
            setIsAddDocModalOpen={setIsAddDocModalOpen}
            onSaveDoc={handleAddDocSave}
          />
        )}

        {activeTab === "committees" && (
          <CommitteesTab
            committees={committees}
            isAddCommitteeModalOpen={isAddCommitteeModalOpen}
            setIsAddCommitteeModalOpen={setIsAddCommitteeModalOpen}
            onSaveCommittee={handleAddCommitteeSave}
          />
        )}

        {activeTab === "reports" && (
          <AuditReportsTab
            auditReports={auditReports}
            isReportsLoading={isReportsLoading}
            onUploadDocument={(body) => uploadDocument(body).unwrap()}
            onDeleteDocument={(id) => deleteDocument(id).unwrap()}
            refetchReports={refetchReports}
          />
        )}

        {activeTab === "suppliers" && (
          <SuppliersTab
            suppliersList={suppliersList}
            isSuppliersLoading={isSuppliersLoading}
            refetchSuppliers={refetchSuppliers}
            onCreateSupplier={(payload) => createSupplier(payload).unwrap()}
            onUpdateSupplier={(id, payload) => updateSupplier({ id, body: payload }).unwrap()}
            onDeleteSupplier={(id) => deleteSupplier(id).unwrap()}
          />
        )}
      </div>
    </div>
  );
}
