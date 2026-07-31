"use client";

import React, { useState } from "react";
import { Droplets, CloudRain, RotateCcw, Plus, Table2, Trash2, PlusCircle, Download, Activity, FileCheck2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { exportWaterBalanceToExcel } from "@/lib/exportWaterExcel";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MeterReading {
  previous: number;
  present: number;
  difference: number;
}

interface WaterLog {
  id: string;
  month: string;
  withdrawals: MeterReading[];
  totalWithdrawal: number;
  boilers: MeterReading[];
  totalProduction: number;
  domestic: number;
  inletWater: number;
  outletWater: number;
}

const initialData: WaterLog[] = [
  { 
    id: '1', month: 'January', 
    withdrawals: [
      { previous: 3955, present: 4081, difference: 126 },
      { previous: 30, present: 118, difference: 88 }
    ],
    totalWithdrawal: 214,
    boilers: [
      { previous: 101, present: 135, difference: 34 },
      { previous: 406, present: 429, difference: 23 }
    ],
    totalProduction: 57,
    domestic: 157,
    inletWater: 210,
    outletWater: 150
  },
  { 
    id: '2', month: 'February', 
    withdrawals: [
      { previous: 4081, present: 4197, difference: 116 },
      { previous: 118, present: 203, difference: 85 }
    ],
    totalWithdrawal: 201,
    boilers: [
      { previous: 135, present: 161, difference: 26 },
      { previous: 429, present: 445, difference: 16 }
    ],
    totalProduction: 42,
    domestic: 159,
    inletWater: 190,
    outletWater: 140
  }
];

interface MeterInput {
  previous: number | "";
  present: number | "";
}

export default function WaterPage() {
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processLossesY, setProcessLossesY] = useState<number>(65.45);

  const [logMonth, setLogMonth] = useState("January");
  const [inletVal, setInletVal] = useState<number | "">("");
  const [outletVal, setOutletVal] = useState<number | "">("");

  const [withdrawalsInput, setWithdrawalsInput] = useState<MeterInput[]>([{ previous: "", present: "" }]);
  const [boilersInput, setBoilersInput] = useState<MeterInput[]>([{ previous: "", present: "" }]);

  const handleAddWithdrawal = () => setWithdrawalsInput([...withdrawalsInput, { previous: "", present: "" }]);
  const handleRemoveWithdrawal = (index: number) => {
    if (withdrawalsInput.length > 1) {
      setWithdrawalsInput(withdrawalsInput.filter((_, i) => i !== index));
    }
  };

  const handleAddBoiler = () => setBoilersInput([...boilersInput, { previous: "", present: "" }]);
  const handleRemoveBoiler = (index: number) => {
    if (boilersInput.length > 1) {
      setBoilersInput(boilersInput.filter((_, i) => i !== index));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allWithdrawalsValid = withdrawalsInput.every(w => w.previous !== "" && w.present !== "");
    const allBoilersValid = boilersInput.every(b => b.previous !== "" && b.present !== "");

    if (!allWithdrawalsValid || !allBoilersValid) {
      toast.error("Please fill all meter reading fields to calculate.");
      return;
    }

    const processedWithdrawals = withdrawalsInput.map(w => ({
      previous: w.previous as number,
      present: w.present as number,
      difference: (w.present as number) - (w.previous as number)
    }));

    const processedBoilers = boilersInput.map(b => ({
      previous: b.previous as number,
      present: b.present as number,
      difference: (b.present as number) - (b.previous as number)
    }));

    const totalWith = processedWithdrawals.reduce((sum, w) => sum + w.difference, 0);
    const totalProd = processedBoilers.reduce((sum, b) => sum + b.difference, 0);
    const domestic = totalWith - totalProd;

    const newLog: WaterLog = {
      id: Date.now().toString(),
      month: logMonth,
      withdrawals: processedWithdrawals,
      totalWithdrawal: totalWith,
      boilers: processedBoilers,
      totalProduction: totalProd,
      domestic: domestic,
      inletWater: inletVal === "" ? 0 : Number(inletVal),
      outletWater: outletVal === "" ? 0 : Number(outletVal)
    };

    setWaterLogs([...waterLogs, newLog]);
    setIsModalOpen(false);
    toast.success("Water usage logged successfully!");
    
    setWithdrawalsInput([{ previous: "", present: "" }]);
    setBoilersInput([{ previous: "", present: "" }]);
    setInletVal("");
    setOutletVal("");
  };

  const chartData = waterLogs.map(log => ({
    name: log.month.substring(0, 3),
    consumed: log.domestic,
    production: log.totalProduction,
    withdrawal: log.totalWithdrawal
  }));

  const grandTotalWithdrawal = waterLogs.reduce((sum, log) => sum + log.totalWithdrawal, 0);
  const grandTotalProduction = waterLogs.reduce((sum, log) => sum + log.totalProduction, 0);
  const grandTotalDomestic = waterLogs.reduce((sum, log) => sum + log.domestic, 0);
  const grandTotalInlet = waterLogs.reduce((sum, log) => sum + log.inletWater, 0);
  const grandTotalOutlet = waterLogs.reduce((sum, log) => sum + log.outletWater, 0);

  const maxWithdrawals = Math.max(...waterLogs.map(l => l.withdrawals.length), 1);
  const maxBoilers = Math.max(...waterLogs.map(l => l.boilers.length), 1);

  const valX = grandTotalWithdrawal;
  const valBoiler = grandTotalProduction;
  const valY = processLossesY;
  const valZ = Math.max(0, valX - valBoiler - valY); 
  const waterBalanceValue = valZ + valBoiler;
  const marginOfError = valX > 0 ? (waterBalanceValue / valX) * 100 : 0;
  const percentClosureResult = 100 - marginOfError;

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">Water Management</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Track consumption, sources, and monitor recycling metrics seamlessly.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border/60 shadow-sm transition-all hover:border-emerald-500/30">
             <label className="text-xs font-semibold text-muted-foreground">Process Losses (Y):</label>
             <input 
               type="number" 
               value={processLossesY} 
               onChange={(e) => setProcessLossesY(Number(e.target.value))} 
               className="w-20 bg-transparent border-b border-dashed border-emerald-500/50 text-sm px-1 py-0.5 font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors text-center" 
             />
          </div>
          <button 
            onClick={() => exportWaterBalanceToExcel({ waterLogs, valX, valY, valBoiler, valZ, waterBalanceValue, marginOfError, percentClosureResult })}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center h-10 active:scale-95"
          >
            <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" /> Export Balance
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center h-10 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Log Water
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-2xl p-6 border border-blue-500/20 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-blue-900/70 dark:text-blue-200/70 uppercase tracking-wider">Total Withdrawal (YTD)</p>
              <h3 className="text-4xl font-black mt-2 bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">{grandTotalWithdrawal.toLocaleString()} <span className="text-base font-medium text-muted-foreground">m³</span></h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform">
              <Droplets className="w-7 h-7" />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent rounded-2xl p-6 border border-emerald-500/20 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-emerald-900/70 dark:text-emerald-200/70 uppercase tracking-wider">Production Cons. (YTD)</p>
              <h3 className="text-4xl font-black mt-2 bg-gradient-to-r from-emerald-700 to-emerald-500 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">{grandTotalProduction.toLocaleString()} <span className="text-base font-medium text-muted-foreground">m³</span></h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
              <CloudRain className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent rounded-2xl p-6 border border-amber-500/20 shadow-sm hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-semibold text-amber-900/70 dark:text-amber-200/70 uppercase tracking-wider">Domestic Cons. (YTD)</p>
              <h3 className="text-4xl font-black mt-2 bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-200 bg-clip-text text-transparent">{grandTotalDomestic.toLocaleString()} <span className="text-base font-medium text-muted-foreground">m³</span></h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 group-hover:scale-110 transition-transform">
              <RotateCcw className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
               <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Water Consumption Trends</h3>
          </div>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                  cursor={{ fill: '#f3f4f6', opacity: 0.5 }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                <Bar dataKey="withdrawal" name="Withdrawal" fill="url(#colorWithdrawal)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="production" name="Production" fill="url(#colorProduction)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consumed" name="Domestic" fill="url(#colorDomestic)" radius={[4, 4, 0, 0]} />
                
                <defs>
                  <linearGradient id="colorWithdrawal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="colorDomestic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
               <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Compliance & Records</h3>
          </div>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-xl border border-border/50 hover:border-emerald-500/30 transition-colors group">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">SOP - Water Leakage</p>
              <p className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">Implemented & Monitored</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-700/70 dark:text-emerald-400/70 mb-1 uppercase tracking-wider">Permit Authorization</p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Valid till Dec 2026</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-700/70 dark:text-emerald-400/70 mb-1 uppercase tracking-wider">ETP Parameter Test</p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Passed (All within limit)</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-muted/50 to-transparent rounded-xl border border-border/50 hover:border-emerald-500/30 transition-colors group">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">ETP Inlet - Outlet</p>
              <p className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">Maintained Daily</p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Water Withdrawal Log */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col mt-8">
        <div className="p-5 border-b border-border flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Water Withdrawal (Sources)</h3>
              <p className="text-sm text-blue-700/70 dark:text-blue-400/70 mt-0.5">Monthly meter readings for water withdrawal</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr>
                <th rowSpan={2} className="px-4 py-3 border-r border-b border-border align-middle min-w-[120px] sticky left-0 bg-muted/50 backdrop-blur-md z-20 font-semibold text-foreground text-left">Month</th>
                {Array.from({ length: maxWithdrawals }).map((_, i) => (
                  <th key={`w-hdr-${i}`} colSpan={3} className="px-3 py-2 border-r border-b border-border text-foreground font-semibold">Meter {i + 1}</th>
                ))}
                <th rowSpan={2} className="px-3 py-2 border-b border-border align-middle bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 font-bold min-w-[140px]">Total Withdrawal</th>
              </tr>
              <tr className="text-xs">
                {Array.from({ length: maxWithdrawals }).map((_, i) => (
                  <React.Fragment key={`w-subhdr-${i}`}>
                    <th className="px-2 py-2 border-r border-b border-border bg-muted/10">Prev</th>
                    <th className="px-2 py-2 border-r border-b border-border bg-muted/10">Pres</th>
                    <th className="px-2 py-2 border-r border-b border-border bg-muted/30 font-semibold text-foreground">Diff</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {waterLogs.map((log) => (
                <tr key={`w-row-${log.id}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 border-r border-border font-medium text-left sticky left-0 bg-background z-10">{log.month}</td>
                  {Array.from({ length: maxWithdrawals }).map((_, i) => {
                    const w = log.withdrawals[i];
                    if (w) {
                      return (
                        <React.Fragment key={`w-cell-${i}`}>
                          <td className="px-2 py-3 border-r border-border text-muted-foreground">{w.previous}</td>
                          <td className="px-2 py-3 border-r border-border text-muted-foreground">{w.present}</td>
                          <td className="px-2 py-3 border-r border-border font-semibold bg-muted/10 text-foreground">{w.difference}</td>
                        </React.Fragment>
                      );
                    }
                    return (
                      <React.Fragment key={`w-cell-empty-${i}`}>
                        <td className="px-2 py-3 border-r border-border text-muted-foreground/30">-</td>
                        <td className="px-2 py-3 border-r border-border text-muted-foreground/30">-</td>
                        <td className="px-2 py-3 border-r border-border text-muted-foreground/30 bg-muted/10">-</td>
                      </React.Fragment>
                    );
                  })}
                  <td className="px-3 py-3 font-bold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 text-base">{log.totalWithdrawal}</td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-bold border-t-2 border-border">
                <td className="px-4 py-4 border-r border-border text-right sticky left-0 bg-muted/40 z-10 text-xs">TOTAL YTD</td>
                {Array.from({ length: maxWithdrawals }).map((_, i) => (
                  <React.Fragment key={`w-tot-${i}`}>
                    <td colSpan={2} className="px-2 py-4 border-r border-border text-right text-muted-foreground font-medium text-[10px] uppercase">Total M-{i+1}</td>
                    <td className="px-2 py-4 border-r border-border text-foreground text-base bg-muted/20">
                      {waterLogs.reduce((sum, log) => sum + (log.withdrawals[i]?.difference || 0), 0)}
                    </td>
                  </React.Fragment>
                ))}
                <td className="px-3 py-4 text-lg text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/20">{grandTotalWithdrawal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Boiler Production Log */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-5 border-b border-border flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300">Production (Boilers)</h3>
              <p className="text-sm text-emerald-700/70 dark:text-emerald-400/70 mt-0.5">Monthly meter readings for boiler consumption</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr>
                <th rowSpan={2} className="px-4 py-3 border-r border-b border-border align-middle min-w-[120px] sticky left-0 bg-muted/50 backdrop-blur-md z-20 font-semibold text-foreground text-left">Month</th>
                {Array.from({ length: maxBoilers }).map((_, i) => (
                  <th key={`b-hdr-${i}`} colSpan={3} className="px-3 py-2 border-r border-b border-border text-foreground font-semibold">Boiler {i + 1}</th>
                ))}
                <th rowSpan={2} className="px-3 py-2 border-b border-border align-middle bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 font-bold min-w-[140px]">Total Production</th>
              </tr>
              <tr className="text-xs">
                {Array.from({ length: maxBoilers }).map((_, i) => (
                  <React.Fragment key={`b-subhdr-${i}`}>
                    <th className="px-2 py-2 border-r border-b border-border bg-muted/10">Prev</th>
                    <th className="px-2 py-2 border-r border-b border-border bg-muted/10">Pres</th>
                    <th className="px-2 py-2 border-r border-b border-border bg-muted/30 font-semibold text-foreground">Diff</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {waterLogs.map((log) => (
                <tr key={`b-row-${log.id}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 border-r border-border font-medium text-left sticky left-0 bg-background z-10">{log.month}</td>
                  {Array.from({ length: maxBoilers }).map((_, i) => {
                    const b = log.boilers[i];
                    if (b) {
                      return (
                        <React.Fragment key={`b-cell-${i}`}>
                          <td className="px-2 py-3 border-r border-border text-muted-foreground">{b.previous}</td>
                          <td className="px-2 py-3 border-r border-border text-muted-foreground">{b.present}</td>
                          <td className="px-2 py-3 border-r border-border font-semibold bg-muted/10 text-foreground">{b.difference}</td>
                        </React.Fragment>
                      );
                    }
                    return (
                      <React.Fragment key={`b-cell-empty-${i}`}>
                        <td className="px-2 py-3 border-r border-border text-muted-foreground/30">-</td>
                        <td className="px-2 py-3 border-r border-border text-muted-foreground/30">-</td>
                        <td className="px-2 py-3 border-r border-border text-muted-foreground/30 bg-muted/10">-</td>
                      </React.Fragment>
                    );
                  })}
                  <td className="px-3 py-3 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10 text-base">{log.totalProduction}</td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-bold border-t-2 border-border">
                <td className="px-4 py-4 border-r border-border text-right sticky left-0 bg-muted/40 z-10 text-xs">TOTAL YTD</td>
                {Array.from({ length: maxBoilers }).map((_, i) => (
                  <React.Fragment key={`b-tot-${i}`}>
                    <td colSpan={2} className="px-2 py-4 border-r border-border text-right text-muted-foreground font-medium text-[10px] uppercase">Total B-{i+1}</td>
                    <td className="px-2 py-4 border-r border-border text-foreground text-base bg-muted/20">
                      {waterLogs.reduce((sum, log) => sum + (log.boilers[i]?.difference || 0), 0)}
                    </td>
                  </React.Fragment>
                ))}
                <td className="px-3 py-4 text-lg text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/20">{grandTotalProduction}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Monthly Consumption Summary */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col mt-6">
        <div className="p-5 border-b border-border flex items-center justify-between bg-amber-50/50 dark:bg-amber-900/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <Table2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-300">Monthly Consumption Summary</h3>
              <p className="text-sm text-amber-700/70 dark:text-amber-400/70 mt-0.5">Calculated domestic and overall production consumption</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr>
                <th className="px-4 py-3 border-r border-b border-border align-middle sticky left-0 bg-muted/50 backdrop-blur-md z-20 font-semibold text-foreground text-left">Month</th>
                <th className="px-4 py-3 border-r border-b border-border font-semibold text-blue-800 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/10">Total Withdrawal</th>
                <th className="px-4 py-3 border-r border-b border-border font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10">Total Production</th>
                <th className="px-4 py-3 border-r border-b border-border font-semibold text-amber-800 dark:text-amber-300 bg-amber-50/50 dark:bg-amber-900/10">Consumption (Domestic)</th>
                <th className="px-4 py-3 border-r border-b border-border font-semibold text-teal-800 dark:text-teal-300 bg-teal-50/50 dark:bg-teal-900/10">ETP Inlet Water (m³)</th>
                <th className="px-4 py-3 border-b border-border font-semibold text-cyan-800 dark:text-cyan-300 bg-cyan-50/50 dark:bg-cyan-900/10">ETP Outlet Water (m³)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {waterLogs.map((log) => (
                <tr key={`sum-row-${log.id}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 border-r border-border font-medium text-left sticky left-0 bg-background z-10">{log.month}</td>
                  <td className="px-4 py-3 border-r border-border font-bold text-blue-700 dark:text-blue-400 bg-blue-50/20">{log.totalWithdrawal}</td>
                  <td className="px-4 py-3 border-r border-border font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/20">{log.totalProduction}</td>
                  <td className="px-4 py-3 border-r border-border font-bold text-amber-700 dark:text-amber-400 bg-amber-50/20">{log.domestic}</td>
                  <td className="px-4 py-3 border-r border-border font-bold text-teal-700 dark:text-teal-400 bg-teal-50/20">{log.inletWater}</td>
                  <td className="px-4 py-3 font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50/20">{log.outletWater}</td>
                </tr>
              ))}
              <tr className="bg-muted/40 font-bold border-t-2 border-border text-lg">
                <td className="px-4 py-4 border-r border-border text-right sticky left-0 bg-muted/40 z-10 text-xs uppercase text-muted-foreground">Total YTD</td>
                <td className="px-4 py-4 border-r border-border text-blue-700 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/20">{grandTotalWithdrawal}</td>
                <td className="px-4 py-4 border-r border-border text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/20">{grandTotalProduction}</td>
                <td className="px-4 py-4 border-r border-border text-amber-700 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/20">{grandTotalDomestic}</td>
                <td className="px-4 py-4 border-r border-border text-teal-700 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-900/20">{grandTotalInlet}</td>
                <td className="px-4 py-4 text-cyan-700 dark:text-cyan-400 bg-cyan-100/50 dark:bg-cyan-900/20">{grandTotalOutlet}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Water Usage & Meters" maxWidthClass="max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
            <div className="space-y-2 md:w-1/3">
              <label className="text-sm font-bold text-foreground">Select Month</label>
              <select 
                value={logMonth} 
                onChange={(e) => setLogMonth(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
              >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dynamic Withdrawals */}
            <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-blue-500/20 pb-3">
                <h4 className="font-bold text-blue-800 dark:text-blue-300 flex items-center">
                  <Droplets className="w-4 h-4 mr-2" /> Water Withdrawal
                </h4>
                <button 
                  type="button" 
                  onClick={handleAddWithdrawal}
                  className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Meter
                </button>
              </div>
              
              <div className="space-y-4">
                {withdrawalsInput.map((w, index) => (
                  <div key={`w-input-${index}`} className="p-4 bg-background border border-border rounded-xl relative group shadow-sm hover:shadow-md transition-all">
                    {withdrawalsInput.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveWithdrawal(index)}
                        className="absolute -top-3 -right-3 text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white p-1.5 rounded-full transition-all shadow-sm"
                        title="Remove Meter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-3">Meter {index + 1}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Previous Reading</label>
                        <input 
                          type="number" 
                          value={w.previous} 
                          onChange={(e) => {
                            const newInputs = [...withdrawalsInput];
                            newInputs[index].previous = e.target.value === "" ? "" : Number(e.target.value);
                            setWithdrawalsInput(newInputs);
                          }} 
                          required 
                          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Present Reading</label>
                        <input 
                          type="number" 
                          value={w.present} 
                          onChange={(e) => {
                            const newInputs = [...withdrawalsInput];
                            newInputs[index].present = e.target.value === "" ? "" : Number(e.target.value);
                            setWithdrawalsInput(newInputs);
                          }} 
                          required 
                          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Boilers */}
            <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-emerald-500/20 pb-3">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center">
                  <CloudRain className="w-4 h-4 mr-2" /> Production Boilers
                </h4>
                <button 
                  type="button" 
                  onClick={handleAddBoiler}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Boiler
                </button>
              </div>
              
              <div className="space-y-4">
                {boilersInput.map((b, index) => (
                  <div key={`b-input-${index}`} className="p-4 bg-background border border-border rounded-xl relative group shadow-sm hover:shadow-md transition-all">
                    {boilersInput.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveBoiler(index)}
                        className="absolute -top-3 -right-3 text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white p-1.5 rounded-full transition-all shadow-sm"
                        title="Remove Boiler"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">Boiler {index + 1}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Previous Reading</label>
                        <input 
                          type="number" 
                          value={b.previous} 
                          onChange={(e) => {
                            const newInputs = [...boilersInput];
                            newInputs[index].previous = e.target.value === "" ? "" : Number(e.target.value);
                            setBoilersInput(newInputs);
                          }} 
                          required 
                          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Present Reading</label>
                        <input 
                          type="number" 
                          value={b.present} 
                          onChange={(e) => {
                            const newInputs = [...boilersInput];
                            newInputs[index].present = e.target.value === "" ? "" : Number(e.target.value);
                            setBoilersInput(newInputs);
                          }} 
                          required 
                          className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-colors" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-2xl border border-border/60 shadow-sm space-y-5">
            <h4 className="font-bold text-foreground border-b border-border/60 pb-3 flex items-center">
              <FileCheck2 className="w-4 h-4 mr-2 text-emerald-600" /> Documents & Compliances
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">SOP - Water Leakage (PDF only)</label>
                <input type="file" accept=".pdf" className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Water Permit</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select className="w-full sm:w-1/3 bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer font-medium">
                    <option value="">Authority</option>
                    <option value="city_corporation">City Corp.</option>
                    <option value="warpo">WRPO</option>
                    <option value="union_parishad">Union Parishad</option>
                  </select>
                  <input type="file" accept=".pdf" className="w-full sm:w-2/3 bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">ETP Parameter Test Record</label>
                <input type="file" accept=".pdf" className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer transition-all" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-semibold">ETP Waste Water Record</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Inlet Water (m³)</label>
                    <input 
                      type="number" 
                      value={inletVal}
                      onChange={(e) => setInletVal(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Outlet Water (m³)</label>
                    <input 
                      type="number" 
                      value={outletVal}
                      onChange={(e) => setOutletVal(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 mt-8">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95">Save Monthly Log</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
