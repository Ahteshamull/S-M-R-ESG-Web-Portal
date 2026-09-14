"use client";

import { useState, useMemo } from "react";
import { 
  Zap, Activity, Battery, Plus, Table2, ShieldCheck, 
  Flame, Cpu, Download, Loader2, Filter, Calendar, BarChart3,
  Layers, RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { exportEnergyToExcel } from "@/lib/exportEnergyExcel";
import { useGetEnergyLogsQuery, useCreateEnergyLogMutation } from "@/lib/redux/slices/energyApi";

interface EnergyLog {
  _id?: string;
  id?: string;
  month: string;
  year?: number;
  gas: number;
  diesel: number;
  electricity: number;
  shipped: number;
}

const ENERGY_MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const ENERGY_YEARS = [2030, 2029, 2028, 2027, 2026, 2025, 2024];

export default function EnergyPage() {
  const [activeTab, setActiveTab] = useState<"analytics" | "records">("analytics");
  const [tableType, setTableType] = useState<"all" | "gas" | "diesel" | "electricity">("all");
  
  const { data: energyLogs = [], isLoading, refetch } = useGetEnergyLogsQuery();
  const [createEnergyLog, { isLoading: isSaving }] = useCreateEnergyLogMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Month and Yearly Filter States
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  
  // Form State
  const [logMonth, setLogMonth] = useState("JUN");
  const [gasVal, setGasVal] = useState<number | "">("");
  const [dieselVal, setDieselVal] = useState<number | "">("");
  const [electricityVal, setElectricityVal] = useState<number | "">("");
  const [shippedVal, setShippedVal] = useState<number | "">("");

  // Dynamically Filtered Energy Logs
  const filteredEnergyLogs = useMemo(() => {
    return energyLogs.filter((log: any) => {
      const matchYear = selectedYear === "All" || (log.year ? log.year === selectedYear : true);
      const matchMonth = selectedMonth === "All" || log.month.toUpperCase().startsWith(selectedMonth.toUpperCase().substring(0, 3));
      return matchYear && matchMonth;
    });
  }, [energyLogs, selectedYear, selectedMonth]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gasVal === "" || dieselVal === "" || electricityVal === "" || shippedVal === "") {
      toast.error("Please fill all consumption and shipped fields.");
      return;
    }

    const payload = {
      month: logMonth,
      gas: Number(gasVal),
      diesel: Number(dieselVal),
      electricity: Number(electricityVal),
      shipped: Number(shippedVal)
    };

    const res = await createEnergyLog(payload);

    if (!res.error) {
      setIsModalOpen(false);
      toast.success("Energy usage logged successfully!");
      setGasVal(""); setDieselVal(""); setElectricityVal(""); setShippedVal("");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to log energy usage";
      toast.error(errorMsg);
    }
  };

  // Calculations for Totals based on filteredEnergyLogs
  const totalGas = filteredEnergyLogs.reduce((acc, curr) => acc + (Number(curr.gas) || 0), 0);
  const totalDiesel = filteredEnergyLogs.reduce((acc, curr) => acc + (Number(curr.diesel) || 0), 0);
  const totalElectricity = filteredEnergyLogs.reduce((acc, curr) => acc + (Number(curr.electricity) || 0), 0);
  const totalShipped = filteredEnergyLogs.reduce((acc, curr) => acc + (Number(curr.shipped) || 0), 0);

  const totalGasKPI = totalShipped > 0 ? (totalGas / totalShipped).toFixed(5) : "0";
  const totalDieselKPI = totalShipped > 0 ? (totalDiesel / totalShipped).toFixed(5) : "0";
  const totalElectricityKPI = totalShipped > 0 ? (totalElectricity / totalShipped).toFixed(5) : "0";

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 via-orange-500 to-amber-400 dark:from-amber-400 dark:via-orange-300 dark:to-amber-200 bg-clip-text text-transparent">
            Energy Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">
            Monitor and benchmark electricity, natural gas, and diesel consumption across production facilities.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Years</option>
              {ENERGY_YEARS.map(y => (
                <option key={y} value={y} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Months (YTD)</option>
              {ENERGY_MONTHS.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => exportEnergyToExcel({ energyLogs: filteredEnergyLogs.length > 0 ? filteredEnergyLogs : energyLogs, totalGas, totalDiesel, totalElectricity, totalShipped })}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center h-9 active:scale-95"
            title="Download Excel Report"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Excel
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 flex items-center h-9 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform" /> Log Energy
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "analytics"
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-500" />
            Analytics & Trends
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "records"
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table2 className="w-4 h-4 text-orange-500" />
            Monthly Records & Tables
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Fetching logs...
            </span>
          ) : (
            <span className="bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
              {filteredEnergyLogs.length} Records Loaded
            </span>
          )}
        </div>
      </div>

      {/* TAB 1: ANALYTICS & TRENDS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Electricity */}
            <div className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/20 shadow-sm hover:shadow-md transition-all group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Grid Electricity</p>
                  <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                    {(totalElectricity / 1000).toFixed(1)} <span className="text-sm font-medium text-muted-foreground">MWh</span>
                  </h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Specific KPI:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{totalElectricityKPI} kWh/pc</span>
              </div>
            </div>
            
            {/* Natural Gas */}
            <div className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-orange-500/20 shadow-sm hover:shadow-md transition-all group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Natural Gas</p>
                  <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
                    {(totalGas / 1000).toFixed(1)} <span className="text-sm font-medium text-muted-foreground">k m³</span>
                  </h3>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20">
                  <Flame className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Specific KPI:</span>
                <span className="font-bold text-orange-700 dark:text-orange-300">{totalGasKPI} m³/pc</span>
              </div>
            </div>

            {/* Diesel */}
            <div className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-gray-500/20 shadow-sm hover:shadow-md transition-all group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-500/10 rounded-full blur-2xl group-hover:bg-gray-500/20 transition-all"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-400 uppercase tracking-wider">Diesel Generators</p>
                  <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                    {(totalDiesel / 1000).toFixed(1)} <span className="text-sm font-medium text-muted-foreground">k Ltr</span>
                  </h3>
                </div>
                <div className="p-3 bg-gray-500/10 rounded-2xl text-gray-600 dark:text-gray-400 ring-1 ring-gray-500/20">
                  <Battery className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Specific KPI:</span>
                <span className="font-bold text-foreground">{totalDieselKPI} L/pc</span>
              </div>
            </div>

            {/* Total Shipped Units */}
            <div className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-blue-500/20 shadow-sm hover:shadow-md transition-all group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Total Shipped</p>
                  <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                    {(totalShipped / 1000).toFixed(1)} <span className="text-sm font-medium text-muted-foreground">k Pcs</span>
                  </h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Total Units:</span>
                <span className="font-bold text-blue-700 dark:text-blue-300">{totalShipped.toLocaleString()} pcs</span>
              </div>
            </div>
          </div>

          {/* Chart & Targets Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm relative">
              <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Energy Consumption Trends</h3>
                    <p className="text-xs text-muted-foreground">Monthly historical progression of electricity and gas</p>
                  </div>
                </div>
              </div>
              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={filteredEnergyLogs}
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.3} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
                    <Area type="monotone" dataKey="electricity" name="Electricity (kWh)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorElectricity)" />
                    <Area type="monotone" dataKey="gas" name="Gas (m³)" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Compliance & Targets */}
            <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Targets & Compliance</h3>
                  <p className="text-xs text-muted-foreground">ESG targets and baseline comparison</p>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="p-3.5 bg-gradient-to-r from-orange-500/5 to-transparent rounded-xl border border-orange-500/20">
                  <p className="text-[11px] font-semibold text-orange-700/80 dark:text-orange-400/80 uppercase tracking-wider">Natural Gas Baseline</p>
                  <p className="text-base font-bold text-orange-700 dark:text-orange-400 mt-0.5">{totalGas.toLocaleString()} m³</p>
                </div>
                <div className="p-3.5 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl border border-emerald-500/20">
                  <p className="text-[11px] font-semibold text-emerald-700/80 dark:text-emerald-400/80 uppercase tracking-wider">Grid Electricity Baseline</p>
                  <p className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{totalElectricity.toLocaleString()} kWh</p>
                </div>
                <div className="p-3.5 bg-gradient-to-r from-muted/40 to-transparent rounded-xl border border-border/50">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Yearly Reduction Target</p>
                  <p className="text-base font-bold text-foreground mt-0.5">5.0% Reduction (vs 2024)</p>
                </div>
                <div className="p-3.5 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">KPI Status</p>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">On Track (Compliant)</p>
                  </div>
                  <span className="relative flex h-3 w-3 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY RECORDS & TABLES */}
      {activeTab === "records" && (
        <div className="space-y-6">
          {/* Sub-selector for table types */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-background/50 backdrop-blur-xl p-3 rounded-2xl border border-border/50">
            <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/40">
              <button
                onClick={() => setTableType("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tableType === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Consolidated Overview
              </button>
              <button
                onClick={() => setTableType("gas")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tableType === "gas" ? "bg-orange-500/15 text-orange-600 dark:text-orange-400 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Natural Gas
              </button>
              <button
                onClick={() => setTableType("diesel")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tableType === "diesel" ? "bg-gray-500/15 text-gray-700 dark:text-gray-300 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Diesel
              </button>
              <button
                onClick={() => setTableType("electricity")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tableType === "electricity" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Electricity
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Record
            </button>
          </div>

          {/* 1. Consolidated Overview Table */}
          {(tableType === "all") && (
            <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border/60 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Consolidated Monthly Consumption</h3>
                    <p className="text-xs text-muted-foreground">All energy sources with production output</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-right border-collapse">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold">
                    <tr className="uppercase tracking-wider text-[11px]">
                      <th className="px-4 py-3 text-left border-b border-border">Month</th>
                      <th className="px-4 py-3 border-b border-border">Shipped (Pcs)</th>
                      <th className="px-4 py-3 border-b border-border text-emerald-600 dark:text-emerald-400">Electricity (kWh)</th>
                      <th className="px-4 py-3 border-b border-border text-orange-600 dark:text-orange-400">Gas (m³)</th>
                      <th className="px-4 py-3 border-b border-border text-gray-600 dark:text-gray-300">Diesel (Ltr)</th>
                      <th className="px-4 py-3 border-b border-border text-center">Elec KPI</th>
                      <th className="px-4 py-3 border-b border-border text-center">Gas KPI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredEnergyLogs.map((log: any) => (
                      <tr key={`cons-${log._id || log.id || log.month}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-left font-bold text-foreground">{log.month}</td>
                        <td className="px-4 py-3 text-muted-foreground">{Number(log.shipped).toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{Number(log.electricity).toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-orange-600 dark:text-orange-400">{Number(log.gas).toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{Number(log.diesel).toLocaleString()}</td>
                        <td className="px-4 py-3 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {log.shipped > 0 ? (log.electricity / log.shipped).toFixed(4) : "0"}
                        </td>
                        <td className="px-4 py-3 text-center text-xs font-semibold text-orange-600 dark:text-orange-400">
                          {log.shipped > 0 ? (log.gas / log.shipped).toFixed(4) : "0"}
                        </td>
                      </tr>
                    ))}
                    {filteredEnergyLogs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-xs">
                          No energy records found for the selected period.
                        </td>
                      </tr>
                    )}
                    <tr className="bg-muted/40 font-bold border-t-2 border-border text-xs sm:text-sm">
                      <td className="px-4 py-3.5 text-left text-foreground">TOTAL YTD</td>
                      <td className="px-4 py-3.5 text-foreground">{totalShipped.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-emerald-600 dark:text-emerald-400">{totalElectricity.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-orange-600 dark:text-orange-400">{totalGas.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-foreground">{totalDiesel.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-center text-emerald-700 dark:text-emerald-300 font-black">{totalElectricityKPI}</td>
                      <td className="px-4 py-3.5 text-center text-orange-700 dark:text-orange-300 font-black">{totalGasKPI}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. Natural Gas Table */}
          {(tableType === "gas") && (
            <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border/60 flex items-center justify-between bg-orange-500/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-orange-950 dark:text-orange-300">Natural Gas Consumption</h3>
                    <p className="text-xs text-orange-700/70 dark:text-orange-400/70">Monthly breakdown with Production KPIs</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-right border-collapse">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left border-b border-border">Month</th>
                      <th className="px-4 py-3 border-b border-border">Cons. (m³)</th>
                      <th className="px-4 py-3 border-b border-border">Shipped (Pcs)</th>
                      <th className="px-4 py-3 border-b border-border text-orange-600 dark:text-orange-400">KPI (m³/pc)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredEnergyLogs.map((log: any) => (
                      <tr key={`gas-${log._id || log.id || log.month}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-left font-bold text-foreground">{log.month}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{Number(log.gas).toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">{Number(log.shipped).toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-orange-600 dark:text-orange-400">
                          {log.shipped > 0 ? (log.gas / log.shipped).toFixed(5) : "0"}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/40 font-bold border-t-2 border-border text-xs sm:text-sm">
                      <td className="px-4 py-3.5 text-left text-foreground">TOTAL YTD</td>
                      <td className="px-4 py-3.5 text-orange-600 dark:text-orange-400">{totalGas.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-foreground">{totalShipped.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-orange-700 dark:text-orange-300 font-black">{totalGasKPI}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Diesel Table */}
          {(tableType === "diesel") && (
            <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border/60 flex items-center justify-between bg-gray-500/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-lg">
                    <Battery className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Diesel Consumption (Generators)</h3>
                    <p className="text-xs text-muted-foreground">Monthly breakdown with Production KPIs</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-right border-collapse">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left border-b border-border">Month</th>
                      <th className="px-4 py-3 border-b border-border">Cons. (Ltr)</th>
                      <th className="px-4 py-3 border-b border-border">Shipped (Pcs)</th>
                      <th className="px-4 py-3 border-b border-border">KPI (Ltr/pc)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredEnergyLogs.map((log: any) => (
                      <tr key={`diesel-${log._id || log.id || log.month}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-left font-bold text-foreground">{log.month}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{Number(log.diesel).toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">{Number(log.shipped).toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-foreground">
                          {log.shipped > 0 ? (log.diesel / log.shipped).toFixed(5) : "0"}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/40 font-bold border-t-2 border-border text-xs sm:text-sm">
                      <td className="px-4 py-3.5 text-left text-foreground">TOTAL YTD</td>
                      <td className="px-4 py-3.5 text-foreground">{totalDiesel.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-foreground">{totalShipped.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-foreground font-black">{totalDieselKPI}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Electricity Table */}
          {(tableType === "electricity") && (
            <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border/60 flex items-center justify-between bg-emerald-500/5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-300">Purchased Electricity</h3>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">Monthly breakdown with Production KPIs</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-right border-collapse">
                  <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left border-b border-border">Month</th>
                      <th className="px-4 py-3 border-b border-border">Cons. (kWh)</th>
                      <th className="px-4 py-3 border-b border-border">Shipped (Pcs)</th>
                      <th className="px-4 py-3 border-b border-border text-emerald-600 dark:text-emerald-400">KPI (kWh/pc)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredEnergyLogs.map((log: any) => (
                      <tr key={`elec-${log._id || log.id || log.month}`} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-left font-bold text-foreground">{log.month}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{Number(log.electricity).toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">{Number(log.shipped).toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                          {log.shipped > 0 ? (log.electricity / log.shipped).toFixed(5) : "0"}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/40 font-bold border-t-2 border-border text-xs sm:text-sm">
                      <td className="px-4 py-3.5 text-left text-foreground">TOTAL YTD</td>
                      <td className="px-4 py-3.5 text-emerald-600 dark:text-emerald-400">{totalElectricity.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-foreground">{totalShipped.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-emerald-700 dark:text-emerald-300 font-black">{totalElectricityKPI}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Logging Monthly Energy Details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Monthly Energy Details" maxWidthClass="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
          <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
            <div className="space-y-1.5 sm:w-1/2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Month</label>
              <select 
                value={logMonth} 
                onChange={(e) => setLogMonth(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
                style={{ colorScheme: "dark" }}
              >
                <option value="JAN" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">January</option>
                <option value="FEB" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">February</option>
                <option value="MAR" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">March</option>
                <option value="APR" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">April</option>
                <option value="MAY" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">May</option>
                <option value="JUN" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">June</option>
                <option value="JUL" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">July</option>
                <option value="AUG" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">August</option>
                <option value="SEP" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">September</option>
                <option value="OCT" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">October</option>
                <option value="NOV" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">November</option>
                <option value="DEC" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">December</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-4 bg-background border border-border rounded-xl shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center mb-1">
                <Cpu className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Total Shipped (Pcs)
              </label>
              <input 
                type="number" 
                placeholder="e.g. 150000" 
                value={shippedVal} 
                onChange={(e) => setShippedVal(e.target.value === "" ? "" : Number(e.target.value))} 
                required 
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/50" 
              />
            </div>
            
            <div className="space-y-1.5 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center mb-1">
                <Zap className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Electricity Cons. (kWh)
              </label>
              <input 
                type="number" 
                placeholder="e.g. 45000" 
                value={electricityVal} 
                onChange={(e) => setElectricityVal(e.target.value === "" ? "" : Number(e.target.value))} 
                required 
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            
            <div className="space-y-1.5 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400 flex items-center mb-1">
                <Flame className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Natural Gas Cons. (m³)
              </label>
              <input 
                type="number" 
                placeholder="e.g. 12000" 
                value={gasVal} 
                onChange={(e) => setGasVal(e.target.value === "" ? "" : Number(e.target.value))} 
                required 
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-orange-500/50" 
              />
            </div>
            
            <div className="space-y-1.5 p-4 bg-gray-500/5 border border-gray-500/20 rounded-xl shadow-sm">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center mb-1">
                <Battery className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> Diesel Cons. (Liters)
              </label>
              <input 
                type="number" 
                placeholder="e.g. 800" 
                value={dieselVal} 
                onChange={(e) => setDieselVal(e.target.value === "" ? "" : Number(e.target.value))} 
                required 
                className="w-full bg-muted/40 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:bg-background focus:outline-none focus:ring-2 focus:ring-gray-500/50" 
              />
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-95 flex items-center"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Monthly Log
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
