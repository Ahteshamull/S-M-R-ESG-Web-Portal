"use client";

import { useState } from "react";
import { Droplets, CloudRain, RotateCcw, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', consumed: 4000, production: 2400 },
  { name: 'Feb', consumed: 3000, production: 1398 },
  { name: 'Mar', consumed: 2000, production: 9800 },
  { name: 'Apr', consumed: 2780, production: 3908 },
  { name: 'May', consumed: 1890, production: 4800 },
  { name: 'Jun', consumed: 2390, production: 3800 },
];

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

      <div className="glass-card rounded-xl p-6 h-96 flex flex-col border border-border">
        <h3 className="text-lg font-semibold mb-6">Water Consumption vs Production</h3>
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 500 }}
                cursor={{ fill: 'transparent' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar yAxisId="left" dataKey="consumed" name="Water Consumed (L)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="production" name="Production Output (Units)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Water Compliance & ETP Records</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">SOP - Water Leakage</p>
            <p className="text-sm font-semibold">Implemented & Monitored</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Permit Authorization</p>
            <p className="text-sm font-semibold text-emerald-600">Valid till Dec 2026</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">ETP Parameter Test</p>
            <p className="text-sm font-semibold text-emerald-600">Passed (All within limit)</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">ETP Inlet - Outlet</p>
            <p className="text-sm font-semibold">Maintained Daily</p>
          </div>
          <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <p className="text-xs font-medium text-emerald-600 mb-1">KPI Status</p>
            <p className="text-sm font-bold text-emerald-700 flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div> Target Achieved
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Water Usage" maxWidthClass="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Source</label>
              <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option>Ground Water</option>
                <option>Municipal Water</option>
                <option>Rain Water</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">SOP - Water Leakage</label>
              <input type="text" placeholder="Enter SOP status or details" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Water Permit Authorization</label>
              <input type="text" placeholder="Enter permit details" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Monthly Water Consumption Record</label>
              <input type="text" placeholder="e.g., 5000 Liters" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Water Balance Diagram</label>
              <input type="text" placeholder="Diagram reference or file link" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">ETP Waste Water Parameter Test Record</label>
              <input type="text" placeholder="Enter test record details" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">ETP Waste Water Record (Inlet - outlet)</label>
              <input type="text" placeholder="Enter inlet/outlet details" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">KPI Based Achievement & Failure Status</label>
            <textarea rows={3} placeholder="Describe KPI status..." className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"></textarea>
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">Save Log</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
