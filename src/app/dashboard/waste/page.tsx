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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Waste Disposal">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Date</label>
            <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Waste Type</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option>General Waste</option>
              <option>Recyclable</option>
              <option>Hazardous (Sludge/Chemicals)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Quantity</label>
            <input type="number" placeholder="0" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Unit</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option>kg</option>
              <option>Tons</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Disposal Method</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option>Landfill</option>
              <option>Recycling Facility</option>
              <option>Incineration</option>
              <option>Authorized Vendor</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">Save Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
