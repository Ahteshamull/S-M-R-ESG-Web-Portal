"use client";

import { useState } from "react";
import { Scale, FileWarning, CheckCircle2, ShieldAlert, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function CompliancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Audit finding logged successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Compliance & Audits</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage legal register, permits, and audit Corrective Action Plans (CAP).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Log Audit Finding
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Open Non-Compliances</p>
              <h3 className="text-2xl font-bold mt-1">12</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-yellow-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Expiring Permits</p>
              <h3 className="text-2xl font-bold mt-1">3 <span className="text-sm font-normal text-muted-foreground">in 30 days</span></h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <FileWarning className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Closed Findings</p>
              <h3 className="text-2xl font-bold mt-1">45 <span className="text-sm font-normal text-muted-foreground">this year</span></h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-lg flex items-center"><Scale className="w-5 h-5 mr-2 text-emerald-600" /> Corrective Action Plan (CAP) Tracker</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Issue / Finding</th>
              <th className="p-4 font-medium">Audit Type</th>
              <th className="p-4 font-medium">Deadline</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 font-medium">Secondary containment missing for chemical drum</td>
              <td className="p-4">Internal Audit</td>
              <td className="p-4 text-red-500 font-medium">Oct 15, 2023</td>
              <td className="p-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Overdue</span></td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Fire extinguisher access blocked</td>
              <td className="p-4">Brand Audit (H&M)</td>
              <td className="p-4 text-yellow-600 font-medium">Nov 30, 2023</td>
              <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">In Progress</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Audit Finding (CAP)">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Issue Description</label>
            <input type="text" required placeholder="Describe the non-compliance" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Audit Type</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option>Internal Audit</option>
              <option>Third-Party Audit (e.g., Sedex)</option>
              <option>Brand Audit</option>
              <option>Regulatory Inspection</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Deadline</label>
              <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Save Finding</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
