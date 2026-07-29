"use client";

import { useState } from "react";
import { Trash2, Recycle, AlertTriangle, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'General Waste', value: 4200 },
  { name: 'Recycled Waste', value: 2800 },
  { name: 'Hazardous Waste', value: 120 },
];
const COLORS = ['#a8a29e', '#4ade80', '#ef4444'];

export default function WastePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Waste record logged successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waste Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track general, recyclable, and hazardous waste disposal.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Record Waste
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-stone-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">General Waste</p>
              <h3 className="text-2xl font-bold mt-1">4.2 <span className="text-sm font-normal text-muted-foreground">Tons</span></h3>
            </div>
            <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
              <Trash2 className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-green-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recycled Waste</p>
              <h3 className="text-2xl font-bold mt-1">2.8 <span className="text-sm font-normal text-muted-foreground">Tons</span></h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Recycle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hazardous Waste</p>
              <h3 className="text-2xl font-bold mt-1">120 <span className="text-sm font-normal text-muted-foreground">kg</span></h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 h-96 flex flex-col border border-border">
        <h3 className="text-lg font-semibold mb-6">Waste Generation Trends</h3>
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 500 }}
                formatter={(value) => `${value} kg`}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-lg">Waste Tracking & Agreements</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-muted-foreground border-b border-border">
              <tr>
                <th className="pb-3 font-medium">Type Of Waste</th>
                <th className="pb-3 font-medium">Waste Inventory</th>
                <th className="pb-3 font-medium">Tracking Record</th>
                <th className="pb-3 font-medium">Waste Summary</th>
                <th className="pb-3 font-medium">Waste Agreement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 font-medium">General Waste</td>
                <td className="py-3">500 kg</td>
                <td className="py-3">Documented (Gate Pass #1024)</td>
                <td className="py-3">Monthly Report Generated</td>
                <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active - City Corp</span></td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Hazardous Waste</td>
                <td className="py-3">120 kg</td>
                <td className="py-3">Documented (Manifest #HZ99)</td>
                <td className="py-3">Monthly Report Generated</td>
                <td className="py-3"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Active - ABC Recycling</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Waste Disposal" maxWidthClass="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Type Of waste</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option>General Waste</option>
                <option>Recyclable</option>
                <option>Hazardous</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Waste Inventory</label>
              <input type="text" placeholder="e.g., 50 kg" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Waste Tracking Record</label>
              <input type="text" placeholder="Enter tracking details" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Waste Summary</label>
              <input type="text" placeholder="Enter summary" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Waste Agreement</label>
              <input type="text" placeholder="Enter agreement details or link" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">Save Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
