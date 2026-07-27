"use client";

import { useState } from "react";
import { Cloud, Factory, Truck, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

export default function CarbonPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Carbon emissions calculated and saved!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Carbon Emissions</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor Scope 1, 2, and 3 GHG emissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Calculate Emissions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-gray-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scope 1 (Direct)</p>
              <h3 className="text-2xl font-bold mt-1">210 <span className="text-sm font-normal text-muted-foreground">tCO2e</span></h3>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <Factory className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scope 2 (Indirect)</p>
              <h3 className="text-2xl font-bold mt-1">630 <span className="text-sm font-normal text-muted-foreground">tCO2e</span></h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Cloud className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scope 3 (Value Chain)</p>
              <h3 className="text-2xl font-bold mt-1">1,250 <span className="text-sm font-normal text-muted-foreground">tCO2e</span></h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 h-96 flex flex-col justify-center items-center border border-border">
        <h3 className="text-lg font-medium mb-2">Emission Trends & Targets</h3>
        <p className="text-muted-foreground text-sm">Detailed charts will be implemented in the next iteration.</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Calculate Emissions">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Reporting Month</label>
            <input type="month" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Scope 1 (tCO2e)</label>
            <input type="number" placeholder="Direct emissions (e.g., Boilers, Vehicles)" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Scope 2 (tCO2e)</label>
            <input type="number" placeholder="Purchased electricity" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Custom Notes</label>
            <textarea placeholder="Any specific calculations or notes..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm h-20 resize-none"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">Save Data</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
