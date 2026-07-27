"use client";

import { useState } from "react";
import { Cloud, Factory, Truck, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: '2019', scope1: 240, scope2: 700, target: 1000 },
  { name: '2020', scope1: 220, scope2: 680, target: 950 },
  { name: '2021', scope1: 230, scope2: 690, target: 900 },
  { name: '2022', scope1: 215, scope2: 650, target: 850 },
  { name: '2023', scope1: 210, scope2: 630, target: 800 },
];

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

      <div className="glass-card rounded-xl p-6 h-96 flex flex-col border border-border">
        <h3 className="text-lg font-semibold mb-6">Emission Trends & Targets</h3>
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 500 }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#4b5563" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="scope2" name="Scope 2" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="target" name="Reduction Target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
