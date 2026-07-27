"use client";

import { useState } from "react";
import { Droplets, CloudRain, RotateCcw, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function WaterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Water usage logged successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Water Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track water consumption, sources, and recycling metrics.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Log Water Usage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Consumption</p>
              <h3 className="text-2xl font-bold mt-1">12,450 <span className="text-sm font-normal text-muted-foreground">Liters</span></h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-cyan-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rainwater Harvested</p>
              <h3 className="text-2xl font-bold mt-1">2,100 <span className="text-sm font-normal text-muted-foreground">Liters</span></h3>
            </div>
            <div className="p-2 bg-cyan-100 rounded-lg text-cyan-600">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-teal-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recycled Water</p>
              <h3 className="text-2xl font-bold mt-1">45 <span className="text-sm font-normal text-muted-foreground">%</span></h3>
            </div>
            <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 h-96 flex flex-col justify-center items-center border border-border">
        <h3 className="text-lg font-medium mb-2">Water Consumption vs Production</h3>
        <p className="text-muted-foreground text-sm">Detailed charts will be implemented in the next iteration.</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Water Usage">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Date</label>
            <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Source</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option>Ground Water</option>
              <option>Municipal Water</option>
              <option>Rain Water</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Consumed (Liters)</label>
            <input type="number" placeholder="0" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Recycled (Liters)</label>
            <input type="number" placeholder="0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">Save Log</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
