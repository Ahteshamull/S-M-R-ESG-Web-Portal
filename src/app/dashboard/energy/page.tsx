"use client";

import { useState } from "react";
import { Zap, Activity, Battery, ArrowDownRight, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jan', electricity: 4000, gas: 2400 },
  { name: 'Feb', electricity: 3000, gas: 1398 },
  { name: 'Mar', electricity: 2000, gas: 9800 },
  { name: 'Apr', electricity: 2780, gas: 3908 },
  { name: 'May', electricity: 1890, gas: 4800 },
  { name: 'Jun', electricity: 2390, gas: 3800 },
];

export default function EnergyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Energy usage logged successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Energy Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track electricity, gas, and diesel consumption.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Log Energy Use
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-yellow-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Grid Electricity</p>
              <h3 className="text-2xl font-bold mt-1">32.4 <span className="text-sm font-normal text-muted-foreground">MWh</span></h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              5.2%
            </span>
            <span className="text-muted-foreground ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Natural Gas</p>
              <h3 className="text-2xl font-bold mt-1">8.5 <span className="text-sm font-normal text-muted-foreground">MWh eq</span></h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-muted-foreground">No change vs last month</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-gray-600">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Diesel (Generators)</p>
              <h3 className="text-2xl font-bold mt-1">4.3 <span className="text-sm font-normal text-muted-foreground">MWh eq</span></h3>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <Battery className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-red-600 font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1 rotate-180" />
              12.4%
            </span>
            <span className="text-muted-foreground ml-2">vs last month</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 h-96 flex flex-col border border-border">
        <h3 className="text-lg font-semibold mb-6">Energy Intensity Trends</h3>
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 500 }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="electricity" name="Electricity (kWh)" stroke="#10b981" fillOpacity={1} fill="url(#colorElectricity)" />
              <Area type="monotone" dataKey="gas" name="Gas (m³)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorGas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Daily Energy">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Date</label>
            <input type="date" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Electricity (kWh)</label>
            <input type="number" placeholder="0" required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Natural Gas (m³)</label>
            <input type="number" placeholder="0" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Diesel (Liters)</label>
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
