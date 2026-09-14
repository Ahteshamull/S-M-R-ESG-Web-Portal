"use client";

import { useState } from "react";
import { Users, HeartPulse, MessageSquareWarning, ArrowUpRight, Plus, Trash2, Loader2, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { 
  useGetWorkerSocialDataQuery, 
  useCreateGrievanceMutation, 
  useUpdateGrievanceStatusMutation, 
  useDeleteGrievanceMutation 
} from "@/lib/redux/slices/workerSocialApi";

export default function WorkerSocialPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, refetch } = useGetWorkerSocialDataQuery();
  const [createGrievance, { isLoading: isSaving }] = useCreateGrievanceMutation();
  const [updateGrievanceStatus] = useUpdateGrievanceStatusMutation();
  const [deleteGrievance] = useDeleteGrievanceMutation();

  // Form State
  const [grievanceType, setGrievanceType] = useState("Leave/Salary Issue");
  const [description, setDescription] = useState("");
  const [dateReceived, setDateReceived] = useState("");
  const [department, setDepartment] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !dateReceived) return;

    const payload = {
      grievanceType,
      description,
      dateReceived,
      department: department || "General",
      status: "Pending" as const,
    };

    const res = await createGrievance(payload);
    setIsModalOpen(false);

    if (!res.error) {
      toast.success("Grievance logged successfully!");
      setGrievanceType("Leave/Salary Issue"); setDescription(""); setDateReceived(""); setDepartment("");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to log grievance";
      toast.error(errorMsg);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateGrievanceStatus({ id, status: newStatus });
    if (!res.error) {
      toast.success("Status updated!");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to update status";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteGrievance(id);
    if (!res.error) {
      toast.success("Grievance record removed!");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to delete record";
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const grievances = data?.grievances || [];
  const openCount = data?.openGrievancesCount || 0;
  const activeCommittees = data?.activeCommitteesCount ?? 0;
  const maternityCount = data?.maternityLeavesCount ?? 0;

  const resolvedCount = grievances.filter((g: any) => g.status === "Resolved").length;
  const totalGrievances = grievances.length;
  const resolutionRate = totalGrievances > 0 ? Math.round((resolvedCount / totalGrievances) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold">Resolved</span>;
      case "In Progress":
        return <span className="px-2.5 py-1 bg-blue-500/15 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">In Progress</span>;
      default:
        return <span className="px-2.5 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
            Worker Welfare & Social Performance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">
            Monitor worker grievance mechanisms, health & safety committees, and welfare metrics.
          </p>
        </div>
        <div className="relative z-10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-purple-500/20 active:scale-95 flex items-center h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform" /> Log Grievance
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Committees</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{activeCommittees}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1 text-xs text-muted-foreground border-t border-border/40 pt-3">
            <span>• Participation Committee (PC)</span>
            <span>• Safety Committee</span>
            <span>• Anti-Harassment Committee</span>
          </div>
        </div>
        
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Health & Maternity</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{maternityCount} <span className="text-xs font-normal text-muted-foreground">Leaves</span></h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs border-t border-border/40 pt-3">
            <span className="flex items-center text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              100%
            </span>
            <span className="text-muted-foreground ml-2">Return to work rate after maternity</span>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Open Grievances</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{openCount} <span className="text-xs font-normal text-muted-foreground">Pending</span></h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs border-t border-border/40 pt-3">
            <span className="text-muted-foreground">
              Resolution rate: <strong className="text-foreground">{resolutionRate}%</strong> {totalGrievances > 0 && resolutionRate >= 90 ? "(SLA Compliant)" : totalGrievances > 0 ? "(Active)" : "(No records)"}
            </span>
          </div>
        </div>
      </div>

      {/* Grievance Table */}
      <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <h3 className="text-sm font-bold text-foreground">Grievance Register & Corrective Actions</h3>
          <span className="text-xs text-muted-foreground font-medium">{grievances.length} Total Grievances</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
              <tr>
                <th className="p-4">Grievance Type</th>
                <th className="p-4">Date Received</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {grievances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">No grievances logged yet.</td>
                </tr>
              ) : (
                grievances.map((grievance: any) => (
                  <tr key={grievance._id || grievance.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium">
                      <div className="font-bold text-foreground">{grievance.grievanceType}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs" title={grievance.description}>
                        {grievance.description}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{grievance.dateReceived}</td>
                    <td className="p-4 font-medium text-foreground">{grievance.department}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(grievance.status)}
                        <select 
                          value={grievance.status}
                          onChange={(e) => handleStatusChange(grievance._id || grievance.id, e.target.value)}
                          className="bg-transparent border border-border text-xs rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(grievance._id || grievance.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete grievance"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Worker Grievance" maxWidthClass="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4 px-1">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grievance Category</label>
            <select 
              value={grievanceType} 
              onChange={(e) => setGrievanceType(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="Leave/Salary Issue">Leave / Salary Issue</option>
              <option value="Working Conditions">Working Conditions / Health & Safety</option>
              <option value="Harassment/Discrimination">Harassment / Discrimination</option>
              <option value="Facility/Canteen">Facility / Canteen / Sanitation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date Received</label>
              <input 
                type="date" 
                value={dateReceived} 
                onChange={(e) => setDateReceived(e.target.value)} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Department / Line</label>
              <input 
                type="text" 
                placeholder="e.g. Sewing Line 4" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detailed Description & Corrective Action</label>
            <textarea 
              rows={4} 
              placeholder="Explain worker grievance and remediation steps taken..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none" 
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95 flex items-center">
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Grievance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
