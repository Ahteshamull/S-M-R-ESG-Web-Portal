"use client";

import { useState } from "react";
import { Users, HeartPulse, MessageSquareWarning, ArrowUpRight, Plus, Trash2, Loader2 } from "lucide-react";
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
  const { data, isLoading } = useGetWorkerSocialDataQuery();
  const [createGrievance] = useCreateGrievanceMutation();
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
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to log grievance";
      toast.error(errorMsg);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateGrievanceStatus({ id, status: newStatus });
    if (!res.error) {
      toast.success("Status updated!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to update status";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteGrievance(id);
    if (!res.error) {
      toast.success("Grievance record removed!");
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
  const activeCommittees = data?.activeCommitteesCount || 4;
  const maternityCount = data?.maternityLeavesCount || 45;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">Resolved</span>;
      case "In Progress":
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">In Progress</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Worker & Social</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor grievance mechanisms, committees, and health KPIs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Log Grievance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Committees</p>
              <h3 className="text-2xl font-bold mt-1">{activeCommittees}</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
            <span>• Participation Committee (PC)</span>
            <span>• Safety Committee</span>
            <span>• Anti-Harassment Committee</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Health & Maternity</p>
              <h3 className="text-2xl font-bold mt-1">{maternityCount} <span className="text-sm font-normal text-muted-foreground">Maternity Leaves</span></h3>
            </div>
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              100%
            </span>
            <span className="text-muted-foreground ml-2">Return to work rate</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open Grievances</p>
              <h3 className="text-2xl font-bold mt-1">{openCount} <span className="text-sm font-normal text-muted-foreground">Pending</span></h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">Resolution rate: 98% (SLA met)</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-lg">Recent Grievances</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Grievance Type</th>
                <th className="p-4 font-medium">Date Received</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {grievances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">No grievances logged yet.</td>
                </tr>
              ) : (
                grievances.map((grievance: any) => (
                  <tr key={grievance._id || grievance.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-medium">
                      <div className="font-semibold">{grievance.grievanceType}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-xs" title={grievance.description}>
                        {grievance.description}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{grievance.dateReceived}</td>
                    <td className="p-4">{grievance.department}</td>
                    <td className="p-4">
                      <select 
                        value={grievance.status}
                        onChange={(e) => handleStatusChange(grievance._id || grievance.id, e.target.value)}
                        className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer font-semibold outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(grievance._id || grievance.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Grievance">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Grievance Type</label>
            <select 
              value={grievanceType}
              onChange={(e) => setGrievanceType(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            >
              <option>Leave/Salary Issue</option>
              <option>Health & Safety</option>
              <option>Harassment/Abuse</option>
              <option>Facilities (Canteen/Washroom)</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              required 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the grievance..." 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none h-24 resize-none"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date Received</label>
              <input 
                type="date" 
                required 
                value={dateReceived}
                onChange={(e) => setDateReceived(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Department</label>
              <input 
                type="text" 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Sewing Line 2" 
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
