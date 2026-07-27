"use client";

import { useState } from "react";
import { TreePine, Droplet, Heart, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function CsrPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("CSR event added successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Corporate Social Responsibility</h1>
          <p className="text-sm text-muted-foreground mt-1">Track community engagement and sustainability initiatives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Add CSR Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tree Plantation</p>
              <h3 className="text-2xl font-bold mt-1">2,500 <span className="text-sm font-normal text-muted-foreground">Trees</span></h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <TreePine className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blood Donation</p>
              <h3 className="text-2xl font-bold mt-1">450 <span className="text-sm font-normal text-muted-foreground">Bags</span></h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-pink-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Community Health</p>
              <h3 className="text-2xl font-bold mt-1">3 <span className="text-sm font-normal text-muted-foreground">Free Camps</span></h3>
            </div>
            <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-lg">CSR Initiatives Log</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-4 font-medium">Initiative Name</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Beneficiaries</th>
              <th className="p-4 font-medium">Budget Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 font-medium">Winter Clothes Distribution</td>
              <td className="p-4 text-muted-foreground">Jan 15, 2023</td>
              <td className="p-4">1,200 Local Residents</td>
              <td className="p-4 font-medium">$5,000</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Local School IT Setup</td>
              <td className="p-4 text-muted-foreground">Mar 10, 2023</td>
              <td className="p-4">350 Students</td>
              <td className="p-4 font-medium">$12,500</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add CSR Event">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Event Name</label>
            <input type="text" required placeholder="e.g., Free Eye Checkup Camp" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Budget ($)</label>
              <input type="number" placeholder="0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Beneficiaries</label>
            <input type="text" placeholder="e.g., 500 Local Villagers" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" />
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Save Event</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
