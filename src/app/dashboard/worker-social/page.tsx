"use client";

import { useState } from "react";
import { Users, HeartPulse, MessageSquareWarning, ArrowUpRight, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function WorkerSocialPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Grievance logged successfully!");
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
              <h3 className="text-2xl font-bold mt-1">4</h3>
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
              <h3 className="text-2xl font-bold mt-1">45 <span className="text-sm font-normal text-muted-foreground">Maternity Leaves</span></h3>
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
              <h3 className="text-2xl font-bold mt-1">2 <span className="text-sm font-normal text-muted-foreground">Pending</span></h3>
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
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Grievance Type</th>
              <th className="p-4 font-medium">Date Received</th>
              <th className="p-4 font-medium">Department</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 font-medium">Leave Approval Delay</td>
              <td className="p-4">Oct 10, 2023</td>
              <td className="p-4 text-muted-foreground">Sewing Line 4</td>
              <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">In Progress</span></td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Canteen Food Quality</td>
              <td className="p-4">Oct 05, 2023</td>
              <td className="p-4 text-muted-foreground">Multiple</td>
              <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Resolved</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Grievance">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Grievance Type</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option>Leave/Salary Issue</option>
              <option>Health & Safety</option>
              <option>Harassment/Abuse</option>
              <option>Facilities (Canteen/Washroom)</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea required placeholder="Describe the grievance..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none h-24 resize-none"></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date Received</label>
              <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Department</label>
              <input type="text" placeholder="e.g., Sewing Line 2" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
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
