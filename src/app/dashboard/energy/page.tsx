"use client";

import { useState } from "react";
import { Zap, Activity, Battery, Plus, Table2, ShieldCheck, Flame, Cpu, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { exportEnergyToExcel } from "@/lib/exportEnergyExcel";

interface EnergyLog {
  id: string;
  month: string;
  gas: number;
  diesel: number;
  electricity: number;
  shipped: number;
}

const initialData: EnergyLog[] = [
  { id: '1', month: 'JAN', gas: 6836.30, diesel: 800, electricity: 34397, shipped: 356324 },
  { id: '2', month: 'FEB', gas: 4350.40, diesel: 1200, electricity: 53182, shipped: 181992 },
  { id: '3', month: 'MAR', gas: 5719.20, diesel: 800, electricity: 61385, shipped: 377046 },
  { id: '4', month: 'APR', gas: 6159.90, diesel: 1200, electricity: 59532, shipped: 277081 },
  { id: '5', month: 'MAY', gas: 6662.18, diesel: 1200, electricity: 70909, shipped: 334586 },
];

export default function EnergyPage() {
  const [energyLogs, setEnergyLogs] = useState<EnergyLog[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [logMonth, setLogMonth] = useState("JUN");
  const [gasVal, setGasVal] = useState<number | "">("");
  const [dieselVal, setDieselVal] = useState<number | "">("");
  const [electricityVal, setElectricityVal] = useState<number | "">("");
  const [shippedVal, setShippedVal] = useState<number | "">("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (gasVal === "" || dieselVal === "" || electricityVal === "" || shippedVal === "") {
      toast.error("Please fill all consumption and shipped fields.");
      return;
    }

    const newLog: EnergyLog = {
      id: Date.now().toString(),
      month: logMonth,
      gas: gasVal as number,
      diesel: dieselVal as number,
      electricity: electricityVal as number,
      shipped: shippedVal as number
    };

    setEnergyLogs([...energyLogs, newLog]);
    setIsModalOpen(false);
    toast.success("Energy usage logged successfully!");
    
    // Reset form
    setGasVal(""); setDieselVal(""); setElectricityVal(""); setShippedVal("");
  };

  // Calculations for Totals
  const totalGas = energyLogs.reduce((acc, curr) => acc + curr.gas, 0);
  const totalDiesel = energyLogs.reduce((acc, curr) => acc + curr.diesel, 0);
  const totalElectricity = energyLogs.reduce((acc, curr) => acc + curr.electricity, 0);
  const totalShipped = energyLogs.reduce((acc, curr) => acc + curr.shipped, 0);

  const totalGasKPI = totalShipped > 0 ? (totalGas / totalShipped).toFixed(5) : "0";
  const totalDieselKPI = totalShipped > 0 ? (totalDiesel / totalShipped).toFixed(5) : "0";
  const totalElectricityKPI = totalShipped > 0 ? (totalElectricity / totalShipped).toFixed(5) : "0";

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-300 bg-clip-text text-transparent">Energy Management</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Track electricity, gas, and diesel consumption across facilities.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={() => exportEnergyToExcel({ energyLogs, totalGas, totalDiesel, totalElectricity, totalShipped })}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center h-10 active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" /> Export to Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center h-10 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Log Energy Use
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Electricity */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent rounded-2xl p-6 border border-emerald-500/20 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-emerald-900/70 dark:text-emerald-200/70 uppercase tracking-wider">Grid Electricity</p>
              <h3 className="text-4xl font-black mt-2 bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">{(totalElectricity / 1000).toFixed(1)} <span className="text-base font-medium text-muted-foreground">MWh</span></h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full">
            YEAR TO DATE
          </div>
        </div>
        
        {/* Natural Gas */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent rounded-2xl p-6 border border-orange-500/20 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl group-hover:bg-orange-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-orange-900/70 dark:text-orange-200/70 uppercase tracking-wider">Natural Gas</p>
              <h3 className="text-4xl font-black mt-2 bg-gradient-to-r from-orange-700 to-orange-500 dark:from-orange-400 dark:to-orange-200 bg-clip-text text-transparent">{(totalGas / 1000).toFixed(1)} <span className="text-base font-medium text-muted-foreground">k m³</span></h3>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20 group-hover:scale-110 transition-transform">
              <Flame className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 w-fit px-2.5 py-1 rounded-full">
            YEAR TO DATE
          </div>
        </div>

        {/* Diesel */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-500/10 via-gray-400/5 to-transparent rounded-2xl p-6 border border-gray-500/20 shadow-sm hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-500/20 rounded-full blur-2xl group-hover:bg-gray-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-gray-900/70 dark:text-gray-200/70 uppercase tracking-wider">Diesel (Generators)</p>
              <h3 className="text-4xl font-black mt-2 bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-400 dark:to-gray-200 bg-clip-text text-transparent">{(totalDiesel / 1000).toFixed(1)} <span className="text-base font-medium text-muted-foreground">k Ltr</span></h3>
            </div>
            <div className="p-3 bg-gray-500/10 rounded-2xl text-gray-600 dark:text-gray-400 ring-1 ring-gray-500/20 group-hover:scale-110 transition-transform">
              <Battery className="w-7 h-7" />
            </div>
          </div>
          <div className="mt-5 flex items-center text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-500/10 w-fit px-2.5 py-1 rounded-full">
            YEAR TO DATE
          </div>
        </div>
      </div>

      {/* Chart & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
               <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Energy Consumption Trends</h3>
          </div>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={energyLogs}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorElectricity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                <Area type="monotone" dataKey="electricity" name="Electricity (kWh)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorElectricity)" />
                <Area type="monotone" dataKey="gas" name="Gas (m³)" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorGas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Targets & Compliance</h3>
          </div>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-gradient-to-r from-orange-500/5 to-transparent rounded-xl border border-orange-500/20 hover:border-orange-500/30 transition-colors group">
              <p className="text-xs font-semibold text-orange-700/70 dark:text-orange-400/70 mb-1 uppercase tracking-wider">Baseline Cons. (YTD Gas)</p>
              <p className="text-sm font-bold text-orange-700 dark:text-orange-400 group-hover:text-orange-600 transition-colors">{totalGas.toLocaleString()} m³</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-700/70 dark:text-emerald-400/70 mb-1 uppercase tracking-wider">Baseline Cons. (YTD Elec)</p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{totalElectricity.toLocaleString()} kWh</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-xl border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Yearly Reduction Target</p>
              <p className="text-sm font-bold text-foreground">5% Reduction</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl border border-emerald-500/30">
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 uppercase tracking-wider">KPI Status</p>
              <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                On Track
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEPARATED DATA TABLES */}
      <div className="space-y-6 mt-6">
        {/* 1. Natural Gas Table */}
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300">Natural Gas Consumption</h3>
                <p className="text-sm text-orange-700/70 dark:text-orange-400/70 mt-0.5">Monthly breakdown with Production KPIs</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead className="bg-muted/30 text-muted-foreground font-medium">
                <tr className="text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 border-r border-b border-border align-middle sticky left-0 bg-muted/50 backdrop-blur-md z-20 font-semibold text-foreground text-left">Month</th>
                  <th className="px-4 py-3 border-r border-b border-border bg-muted/10 font-semibold">Cons. (m³)</th>
                  <th className="px-4 py-3 border-r border-b border-border bg-muted/10 font-semibold">Shipped (Pcs)</th>
                  <th className="px-4 py-3 border-b border-border bg-orange-500/10 text-orange-700 dark:text-orange-400 font-bold">KPI (m³/pc)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {energyLogs.map((log) => (
                  <tr key={`gas-${log.id}`} className="hover:bg-muted/30 transition-colors text-right">
                    <td className="px-4 py-3 border-r border-border font-medium text-left sticky left-0 bg-background z-10">{log.month}</td>
                    <td className="px-4 py-3 border-r border-border text-foreground font-medium">{log.gas.toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-border text-muted-foreground">{log.shipped.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-orange-700 dark:text-orange-400 bg-orange-50/30 dark:bg-orange-950/10">{(log.gas / log.shipped).toFixed(5)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/40 font-bold border-t-2 border-border text-right text-base">
                  <td className="px-4 py-4 border-r border-border text-left sticky left-0 bg-muted/80 z-10 text-xs text-muted-foreground">TOTAL YTD</td>
                  <td className="px-4 py-4 border-r border-border text-orange-700 dark:text-orange-400">{totalGas.toLocaleString()}</td>
                  <td className="px-4 py-4 border-r border-border text-orange-700 dark:text-orange-400">{totalShipped.toLocaleString()}</td>
                  <td className="px-4 py-4 text-orange-800 dark:text-orange-300 bg-orange-500/10">{totalGasKPI}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Diesel Table */}
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 rounded-lg">
                <Battery className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-300">Diesel Consumption (Generators)</h3>
                <p className="text-sm text-gray-700/70 dark:text-gray-400/70 mt-0.5">Monthly breakdown with Production KPIs</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead className="bg-muted/30 text-muted-foreground font-medium">
                <tr className="text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 border-r border-b border-border align-middle sticky left-0 bg-muted/50 backdrop-blur-md z-20 font-semibold text-foreground text-left">Month</th>
                  <th className="px-4 py-3 border-r border-b border-border bg-muted/10 font-semibold">Cons. (Ltr)</th>
                  <th className="px-4 py-3 border-r border-b border-border bg-muted/10 font-semibold">Shipped (Pcs)</th>
                  <th className="px-4 py-3 border-b border-border bg-gray-500/10 text-gray-700 dark:text-gray-300 font-bold">KPI (Ltr/pc)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {energyLogs.map((log) => (
                  <tr key={`diesel-${log.id}`} className="hover:bg-muted/30 transition-colors text-right">
                    <td className="px-4 py-3 border-r border-border font-medium text-left sticky left-0 bg-background z-10">{log.month}</td>
                    <td className="px-4 py-3 border-r border-border text-foreground font-medium">{log.diesel.toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-border text-muted-foreground">{log.shipped.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-gray-900/10">{(log.diesel / log.shipped).toFixed(5)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/40 font-bold border-t-2 border-border text-right text-base">
                  <td className="px-4 py-4 border-r border-border text-left sticky left-0 bg-muted/80 z-10 text-xs text-muted-foreground">TOTAL YTD</td>
                  <td className="px-4 py-4 border-r border-border text-gray-700 dark:text-gray-300">{totalDiesel.toLocaleString()}</td>
                  <td className="px-4 py-4 border-r border-border text-gray-700 dark:text-gray-300">{totalShipped.toLocaleString()}</td>
                  <td className="px-4 py-4 text-gray-800 dark:text-gray-200 bg-gray-500/10">{totalDieselKPI}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Electricity Table */}
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300">Purchased Electricity</h3>
                <p className="text-sm text-emerald-700/70 dark:text-emerald-400/70 mt-0.5">Monthly breakdown with Production KPIs</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead className="bg-muted/30 text-muted-foreground font-medium">
                <tr className="text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 border-r border-b border-border align-middle sticky left-0 bg-muted/50 backdrop-blur-md z-20 font-semibold text-foreground text-left">Month</th>
                  <th className="px-4 py-3 border-r border-b border-border bg-muted/10 font-semibold">Cons. (kWh)</th>
                  <th className="px-4 py-3 border-r border-b border-border bg-muted/10 font-semibold">Shipped (Pcs)</th>
                  <th className="px-4 py-3 border-b border-border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">KPI (kWh/pc)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {energyLogs.map((log) => (
                  <tr key={`elec-${log.id}`} className="hover:bg-muted/30 transition-colors text-right">
                    <td className="px-4 py-3 border-r border-border font-medium text-left sticky left-0 bg-background z-10">{log.month}</td>
                    <td className="px-4 py-3 border-r border-border text-foreground font-medium">{log.electricity.toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-border text-muted-foreground">{log.shipped.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/10">{(log.electricity / log.shipped).toFixed(5)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/40 font-bold border-t-2 border-border text-right text-base">
                  <td className="px-4 py-4 border-r border-border text-left sticky left-0 bg-muted/80 z-10 text-xs text-muted-foreground">TOTAL YTD</td>
                  <td className="px-4 py-4 border-r border-border text-emerald-700 dark:text-emerald-400">{totalElectricity.toLocaleString()}</td>
                  <td className="px-4 py-4 border-r border-border text-emerald-700 dark:text-emerald-400">{totalShipped.toLocaleString()}</td>
                  <td className="px-4 py-4 text-emerald-800 dark:text-emerald-300 bg-emerald-500/10">{totalElectricityKPI}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Monthly Energy Details" maxWidthClass="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
          
          <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
            <div className="space-y-2 md:w-1/3">
              <label className="text-sm font-bold text-foreground">Select Month</label>
              <select 
                value={logMonth} 
                onChange={(e) => setLogMonth(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
              >
                <option value="JAN">January</option>
                <option value="FEB">February</option>
                <option value="MAR">March</option>
                <option value="APR">April</option>
                <option value="MAY">May</option>
                <option value="JUN">June</option>
                <option value="JUL">July</option>
                <option value="AUG">August</option>
                <option value="SEP">September</option>
                <option value="OCT">October</option>
                <option value="NOV">November</option>
                <option value="DEC">December</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center mb-2">
                <Cpu className="w-3.5 h-3.5 mr-1.5" /> Total Shipped (Pcs)
              </label>
              <input type="number" placeholder="0" value={shippedVal} onChange={(e) => setShippedVal(e.target.value === "" ? "" : Number(e.target.value))} required className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors" />
            </div>
            
            <div className="space-y-2 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl shadow-sm hover:shadow-md transition-all">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center mb-2">
                <Zap className="w-3.5 h-3.5 mr-1.5" /> Electricity Cons. (kWh)
              </label>
              <input type="number" placeholder="0" value={electricityVal} onChange={(e) => setElectricityVal(e.target.value === "" ? "" : Number(e.target.value))} required className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors" />
            </div>
            
            <div className="space-y-2 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl shadow-sm hover:shadow-md transition-all">
              <label className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 flex items-center mb-2">
                <Flame className="w-3.5 h-3.5 mr-1.5" /> Natural Gas Cons. (m³)
              </label>
              <input type="number" placeholder="0" value={gasVal} onChange={(e) => setGasVal(e.target.value === "" ? "" : Number(e.target.value))} required className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-colors" />
            </div>
            
            <div className="space-y-2 p-4 bg-gray-500/5 border border-gray-500/20 rounded-xl shadow-sm hover:shadow-md transition-all">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-400 flex items-center mb-2">
                <Battery className="w-3.5 h-3.5 mr-1.5" /> Diesel Cons. (Liters)
              </label>
              <input type="number" placeholder="0" value={dieselVal} onChange={(e) => setDieselVal(e.target.value === "" ? "" : Number(e.target.value))} required className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-colors" />
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-95">Save Monthly Log</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
