"use client";

import { useState, useMemo } from "react";
import { 
  Cloud, Factory, Truck, Plus, FileText, Download, 
  TrendingDown, Leaf, Activity, ChevronDown, Pencil, Loader2,
  BarChart3, Calculator, BookOpen, Layers, CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useGetCarbonSummaryQuery, useCreateCarbonEntryMutation, useUpdateEmissionFactorMutation } from "@/lib/redux/slices/carbonApi";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FactorType = { id: string; activity: string; unit: string; factor: number; type: string; scopeName?: string; scopeId?: "1" | "2" | "3" };

export default function CarbonPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'logging' | 'factors'>('analytics');
  const { data: carbonData, isLoading, refetch } = useGetCarbonSummaryQuery();
  const [createCarbonEntry, { isLoading: isSavingEntry }] = useCreateCarbonEntryMutation();
  const [updateEmissionFactor, { isLoading: isSavingFactor }] = useUpdateEmissionFactorMutation();

  const trendData = useMemo(() => {
    return (carbonData as any)?.trends || [];
  }, [carbonData]);

  const targetData = useMemo(() => {
    return (carbonData as any)?.targetData || [];
  }, [carbonData]);
  
  // State for Factors
  const [isEditFactorModalOpen, setIsEditFactorModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState<FactorType | null>(null);
  const [editFactorValue, setEditFactorValue] = useState<number | "">("");

  // Data Entry State
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [calcScope, setCalcScope] = useState<"1" | "2" | "3">("1");
  const [calcActivityId, setCalcActivityId] = useState<string>("");
  const [calcAmount, setCalcAmount] = useState<number | "">("");
  const [factorSearch, setFactorSearch] = useState("");

  // Group factors by scope dynamically from RTK Query data
  const emissionFactors = useMemo(() => {
    const s1 = (carbonData?.factors || []).filter((f: any) => f.scope === '1').map((f: any) => ({ id: f._id || f.id, activity: f.activity, unit: f.unit, factor: f.factor, type: f.type }));
    const s2 = (carbonData?.factors || []).filter((f: any) => f.scope === '2').map((f: any) => ({ id: f._id || f.id, activity: f.activity, unit: f.unit, factor: f.factor, type: f.type }));
    const s3 = (carbonData?.factors || []).filter((f: any) => f.scope === '3').map((f: any) => ({ id: f._id || f.id, activity: f.activity, unit: f.unit, factor: f.factor, type: f.type }));
    return { "1": s1, "2": s2, "3": s3 };
  }, [carbonData]);

  // Combine factors for library view
  const allFactors = useMemo(() => {
    const list = [
      ...emissionFactors["1"].map((f: any) => ({ ...f, scopeName: 'Scope 1', scopeId: "1" as const })),
      ...emissionFactors["2"].map((f: any) => ({ ...f, scopeName: 'Scope 2', scopeId: "2" as const })),
      ...emissionFactors["3"].map((f: any) => ({ ...f, scopeName: 'Scope 3', scopeId: "3" as const })),
    ];
    if (!factorSearch) return list;
    const q = factorSearch.toLowerCase();
    return list.filter(f => f.activity.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || f.scopeName.toLowerCase().includes(q));
  }, [emissionFactors, factorSearch]);

  const activeFactor = useMemo(() => {
    return emissionFactors[calcScope].find((f: any) => f.id === calcActivityId) || null;
  }, [emissionFactors, calcScope, calcActivityId]);

  const calculatedEmissions = useMemo(() => {
    if (activeFactor && calcAmount !== "") {
      return (Number(calcAmount) * activeFactor.factor).toFixed(4);
    }
    return "0.0000";
  }, [activeFactor, calcAmount]);

  const openDataEntryModal = (scope: "1" | "2" | "3") => {
    setCalcScope(scope);
    setCalcActivityId("");
    setCalcAmount("");
    setIsCalcModalOpen(true);
  };

  const handleSaveEmissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFactor || calcAmount === "") return;
    
    setIsCalcModalOpen(false);

    const payload = {
      scope: calcScope,
      activityId: activeFactor.id,
      amount: Number(calcAmount),
    };

    const res = await createCarbonEntry(payload);

    if (!res.error) {
      toast.success(`${calculatedEmissions} tCO2e added to Scope ${calcScope} emissions!`);
      setCalcAmount("");
      setCalcActivityId("");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to save emissions entry";
      toast.error(errorMsg);
    }
  };

  const openEditFactorModal = (factor: FactorType) => {
    setEditingFactor(factor);
    setEditFactorValue(factor.factor);
    setIsEditFactorModalOpen(true);
  };

  const handleSaveFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFactor || editFactorValue === "" || !editingFactor.scopeId) return;

    const res = await updateEmissionFactor({
      id: editingFactor.id,
      factor: Number(editFactorValue),
    });

    setIsEditFactorModalOpen(false);

    if (!res.error) {
      toast.success(`${editingFactor.activity} emission factor updated!`);
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to update factor";
      toast.error(errorMsg);
    }
  };

  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  const CARBON_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const CARBON_YEARS = [2030, 2029, 2028, 2027, 2026, 2025, 2024];

  const handleDownloadReport = () => {
    toast.success("Generating Carbon Footprint Report (PDF)...");
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">
            Carbon Accounting & GHG
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">
            Monitor, calculate, and benchmark Scope 1, 2, and 3 greenhouse gas emissions across all supply chains.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
            <span className="text-muted-foreground">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Years</option>
              {CARBON_YEARS.map(y => (
                <option key={y} value={y} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
            <span className="text-muted-foreground">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Months (YTD)</option>
              {CARBON_MONTHS.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleDownloadReport}
            className="bg-background hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm h-9 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Export PDF
          </button>
          
          <button 
            onClick={() => openDataEntryModal("1")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm h-9 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Scope 1
          </button>
          <button 
            onClick={() => openDataEntryModal("2")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm h-9 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Scope 2
          </button>
          <button 
            onClick={() => openDataEntryModal("3")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm h-9 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Scope 3
          </button>
        </div>
      </div>

      {/* KPI Cards (Always Accessible) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-gray-500 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                <Factory className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> Scope 1 (Direct)
              </p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                {(carbonData?.kpis?.scope1 || 0).toFixed(1)}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">tCO2e generated</p>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                <Cloud className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> Scope 2 (Indirect)
              </p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                {(carbonData?.kpis?.scope2 || 0).toFixed(1)}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">tCO2e (Purchased electricity)</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-orange-500" /> Scope 3 (Value Chain)
              </p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                {(carbonData?.kpis?.scope3 || 0).toFixed(1)}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">tCO2e upstream & downstream</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-emerald-500/10 backdrop-blur-xl rounded-2xl p-5 border border-emerald-500/30 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Total GHG Footprint
              </p>
              <h3 className="text-3xl font-black mt-2 text-emerald-950 dark:text-emerald-100">
                {(carbonData?.kpis?.totalEmissions || 0).toFixed(1)}
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2 font-semibold">tCO2e (All Scopes Combined)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-2xl border border-border/50 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all",
              activeTab === 'analytics'
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            Emissions Analytics & Trends
          </button>
          <button
            onClick={() => setActiveTab('logging')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all",
              activeTab === 'logging'
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calculator className="w-4 h-4 text-blue-500" />
            GHG Activity Data Entry
          </button>
          <button
            onClick={() => setActiveTab('factors')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all",
              activeTab === 'factors'
                ? "bg-background text-foreground shadow-sm shadow-black/5"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            Emission Factors Library
          </button>
        </div>

        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
          {isLoading ? (
            <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synchronizing data...
            </span>
          ) : (
            <span className="bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
              {allFactors.length} Factors Registered
            </span>
          )}
        </div>
      </div>

      {/* TAB 1: EMISSIONS ANALYTICS & TRENDS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Monthly GHG Emissions Trend</h3>
                <p className="text-xs text-muted-foreground">Historical breakdown per Scope (tCO2e)</p>
              </div>
            </div>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                  <Line type="monotone" dataKey="scope1" name="Scope 1 (Direct)" stroke="#6b7280" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="scope2" name="Scope 2 (Electricity)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="scope3" name="Scope 3 (Value Chain)" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold text-foreground">Target vs Actual Emissions (YTD)</h3>
                <p className="text-xs text-muted-foreground">Progress towards SBTi Science Based Targets</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-600 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                On Track
              </span>
            </div>
            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={targetData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                  <Bar dataKey="actual" name="Actual (tCO2e)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="target" name="Target (tCO2e)" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GHG ACTIVITY DATA ENTRY WIZARD */}
      {activeTab === 'logging' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-300">
          {/* Scope 1 Card */}
          <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col justify-between hover:border-gray-500/50 transition-all">
            <div>
              <div className="p-3 bg-gray-500/10 text-gray-600 dark:text-gray-300 rounded-xl w-fit mb-4">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Scope 1 Direct Logging</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Log direct combustion sources: Boilers (natural gas/diesel), generators, company-owned vehicles, and refrigerants.
              </p>
              <div className="mt-4 p-3 bg-muted/40 rounded-xl border border-border/40 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Sources:</span>
                  <span className="font-bold">{emissionFactors["1"].length} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current YTD:</span>
                  <span className="font-bold">{(carbonData?.kpis?.scope1 || 0).toFixed(1)} tCO2e</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => openDataEntryModal("1")}
              className="mt-6 w-full bg-gray-700 hover:bg-gray-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Scope 1 Activity
            </button>
          </div>

          {/* Scope 2 Card */}
          <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all">
            <div>
              <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl w-fit mb-4">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Scope 2 Electricity Logging</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Record location-based or market-based purchased grid electricity, steam, heating, and cooling usage.
              </p>
              <div className="mt-4 p-3 bg-muted/40 rounded-xl border border-border/40 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Sources:</span>
                  <span className="font-bold">{emissionFactors["2"].length} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current YTD:</span>
                  <span className="font-bold">{(carbonData?.kpis?.scope2 || 0).toFixed(1)} tCO2e</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => openDataEntryModal("2")}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Scope 2 Activity
            </button>
          </div>

          {/* Scope 3 Card */}
          <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col justify-between hover:border-orange-500/50 transition-all">
            <div>
              <div className="p-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl w-fit mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Scope 3 Value Chain Logging</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Record raw material transportation, business travel, upstream logistics, waste generated in operations, and water supply.
              </p>
              <div className="mt-4 p-3 bg-muted/40 rounded-xl border border-border/40 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Sources:</span>
                  <span className="font-bold">{emissionFactors["3"].length} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current YTD:</span>
                  <span className="font-bold">{(carbonData?.kpis?.scope3 || 0).toFixed(1)} tCO2e</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => openDataEntryModal("3")}
              className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Scope 3 Activity
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: EMISSION FACTOR LIBRARY */}
      {activeTab === 'factors' && (
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
          <div className="p-5 border-b border-border/50 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-foreground">Standard GHG Emission Factors Library</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Library of verified emission factors applied by the automatic calculator.</p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search factor or source..."
                value={factorSearch}
                onChange={(e) => setFactorSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-semibold text-[11px] uppercase">
                <tr>
                  <th className="p-4">Scope</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Activity / Source</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Factor (tCO2e/unit)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {allFactors.map((factor) => (
                  <tr key={factor.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase",
                        factor.scopeName === 'Scope 1' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                        factor.scopeName === 'Scope 2' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                        factor.scopeName === 'Scope 3' && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
                      )}>
                        {factor.scopeName}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{factor.type}</td>
                    <td className="p-4 font-bold text-foreground">{factor.activity}</td>
                    <td className="p-4 text-muted-foreground">per {factor.unit}</td>
                    <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-bold">{factor.factor}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => openEditFactorModal(factor)}
                        className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors"
                        title="Edit Factor"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {allFactors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                      No emission factors found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GHG Calculator Modal */}
      <Modal isOpen={isCalcModalOpen} onClose={() => setIsCalcModalOpen(false)} title={`Add Scope ${calcScope} GHG Activity`} maxWidthClass="max-w-xl">
        <form onSubmit={handleSaveEmissions} className="space-y-6 px-1 pb-2 mt-2">
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg shrink-0">
              <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <strong className="block mb-0.5 text-emerald-950 dark:text-emerald-100">Automatic GHG Carbon Calculator</strong>
              Select the activity for Scope {calcScope}. Enter raw consumption, and the platform will automatically compute certified tCO2e emissions.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Activity / Source</label>
              <div className="relative">
                <select 
                  required
                  value={calcActivityId}
                  onChange={(e) => setCalcActivityId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-4 pr-10 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm font-medium"
                >
                  <option value="" disabled>-- Select Activity for Scope {calcScope} --</option>
                  {emissionFactors[calcScope].map((f: any) => (
                    <option key={f.id} value={f.id}>{f.activity} ({f.type})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {activeFactor && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Activity Quantity <span className="text-emerald-600 dark:text-emerald-400 font-semibold">({activeFactor.unit})</span>
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="any"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder={`e.g., 5000`} 
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm font-semibold" 
                  />
                  <div className="bg-muted px-4 py-2.5 rounded-xl border border-border flex items-center justify-center text-xs font-bold text-muted-foreground whitespace-nowrap shadow-sm">
                    {activeFactor.unit}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/40 rounded-xl p-5 border border-border flex flex-col items-center justify-center relative overflow-hidden">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Calculated Emissions</p>
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-4xl sm:text-5xl font-black tracking-tight transition-all duration-300",
                calcAmount !== "" && activeFactor ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
              )}>
                {calculatedEmissions}
              </span>
              <span className="text-sm sm:text-base font-bold text-muted-foreground">tCO2e</span>
            </div>
            {activeFactor && (
              <p className="text-[11px] text-muted-foreground mt-3 bg-background/80 px-3 py-1 rounded-full border border-border/60 font-medium">
                Formula: Quantity × <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{activeFactor.factor}</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <button 
              type="button" 
              onClick={() => setIsCalcModalOpen(false)} 
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!activeFactor || calcAmount === "" || isSavingEntry} 
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center"
            >
              {isSavingEntry && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Factor Modal */}
      <Modal isOpen={isEditFactorModalOpen} onClose={() => setIsEditFactorModalOpen(false)} title="Edit Emission Factor" maxWidthClass="max-w-md">
        {editingFactor && (
          <form onSubmit={handleSaveFactor} className="space-y-6 px-1 pb-2 mt-2">
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-xs">
              <p className="text-muted-foreground mb-1 uppercase font-bold tracking-wider">Activity / Source</p>
              <p className="font-bold text-foreground text-sm">{editingFactor.activity} <span className="text-muted-foreground font-normal">({editingFactor.scopeName})</span></p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Emission Factor <span className="text-emerald-600 dark:text-emerald-400 font-semibold">(tCO2e per {editingFactor.unit})</span>
              </label>
              <input 
                type="number" 
                required
                step="any"
                min="0"
                value={editFactorValue}
                onChange={(e) => setEditFactorValue(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm font-mono font-bold" 
              />
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-border">
              <button 
                type="button" 
                onClick={() => setIsEditFactorModalOpen(false)} 
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={editFactorValue === "" || isSavingFactor} 
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center"
              >
                {isSavingFactor && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
                Update Factor
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
