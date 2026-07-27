"use client";

import { useState } from "react";
import { GraduationCap, BookOpen, Users, Award, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function TrainingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Training session scheduled successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training & Capacity Building</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage training calendar, attendance, and worker competency.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Schedule Training
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <h3 className="text-xl font-bold">1,240</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trained Workers</p>
              <h3 className="text-xl font-bold">850</h3>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
              <h3 className="text-xl font-bold">4</h3>
            </div>
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><GraduationCap className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Competency Score</p>
              <h3 className="text-xl font-bold">88%</h3>
            </div>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Award className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-lg">Upcoming Training Sessions</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Topic</th>
              <th className="p-4 font-medium">Date & Time</th>
              <th className="p-4 font-medium">Trainer</th>
              <th className="p-4 font-medium">Target Audience</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 font-medium">Fire Safety & Evacuation</td>
              <td className="p-4">Oct 15, 2023 - 10:00 AM</td>
              <td className="p-4 text-muted-foreground">John Doe (HSE)</td>
              <td className="p-4">All Sewing Floor Workers</td>
              <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Scheduled</span></td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Chemical Handling (ZDHC)</td>
              <td className="p-4">Oct 20, 2023 - 02:00 PM</td>
              <td className="p-4 text-muted-foreground">Sarah Smith (Chem)</td>
              <td className="p-4">Dyeing Unit Supervisors</td>
              <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Scheduled</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Training">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Training Topic</label>
            <input type="text" required placeholder="e.g., Fire Safety Training" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Time</label>
              <input type="time" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Trainer Name</label>
            <input type="text" required placeholder="Internal or External Trainer" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Target Participants</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option>All Workers</option>
              <option>Supervisors & Management</option>
              <option>Dyeing / Chemical Handlers</option>
              <option>Security & Maintenance</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Schedule</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
