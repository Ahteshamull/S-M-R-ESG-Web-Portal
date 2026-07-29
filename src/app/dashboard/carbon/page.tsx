"use client";

import { useState, useMemo } from "react";
import { Cloud, Factory, Truck, Plus, FileText, Download, TrendingDown, Leaf, Activity, ChevronDown, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const trendData = [
  { month: 'Jan', scope1: 18, scope2: 45, scope3: 90 },
  { month: 'Feb', scope1: 17, scope2: 42, scope3: 88 },
  { month: 'Mar', scope1: 19, scope2: 48, scope3: 95 },
  { month: 'Apr', scope1: 16, scope2: 40, scope3: 85 },
  { month: 'May', scope1: 18, scope2: 44, scope3: 92 },
  { month: 'Jun', scope1: 20, scope2: 50, scope3: 100 },
];

const targetData = [
  { name: 'Scope 1', actual: 108, target: 120 },
  { name: 'Scope 2', actual: 269, target: 280 },
  { name: 'Scope 3', actual: 550, target: 600 },
];

const INITIAL_FACTORS = {
  "1": [
    { id: 's1_1', activity: 'Diesel (Stationary Boiler)', unit: 'Liters', factor: 0.00268, type: 'Fuel' },
    { id: 's1_2', activity: 'Natural Gas', unit: 'm³', factor: 0.00202, type: 'Fuel' },
    { id: 's1_3', activity: 'Company Vehicles (Petrol)', unit: 'Liters', factor: 0.00231, type: 'Transport' },
  ],
  "2": [
    { id: 's2_1', activity: 'Grid Electricity', unit: 'kWh', factor: 0.0005, type: 'Electricity' },
    { id: 's2_2', activity: 'Purchased Steam', unit: 'kg', factor: 0.00017, type: 'Heating' },
  ],
  "3": [
    { id: 's3_1', activity: 'Business Travel (Air)', unit: 'km', factor: 0.00015, type: 'Travel' },
    { id: 's3_2', activity: 'Waste to Landfill', unit: 'kg', factor: 0.0005, type: 'Waste' },
    { id: 's3_3', activity: 'Purchased Goods (Textiles)', unit: 'kg', factor: 0.015, type: 'Supply Chain' },
  ]
};

type FactorType = { id: string; activity: string; unit: string; factor: number; type: string; scopeName?: string; scopeId?: "1" | "2" | "3" };

export default function CarbonPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'factors'>('dashboard');
  
  // State for Factors
  const [emissionFactors, setEmissionFactors] = useState(INITIAL_FACTORS);
  const [isEditFactorModalOpen, setIsEditFactorModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState<FactorType | null>(null);
  const [editFactorValue, setEditFactorValue] = useState<number | "">("");

  // Data Entry State
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [calcScope, setCalcScope] = useState<"1" | "2" | "3">("1");
  const [calcActivityId, setCalcActivityId] = useState<string>("");
  const [calcAmount, setCalcAmount] = useState<number | "">("");

  // Combine factors for library view
  const allFactors = useMemo(() => {
    return [
      ...emissionFactors["1"].map(f => ({ ...f, scopeName: 'Scope 1', scopeId: "1" as const })),
      ...emissionFactors["2"].map(f => ({ ...f, scopeName: 'Scope 2', scopeId: "2" as const })),
      ...emissionFactors["3"].map(f => ({ ...f, scopeName: 'Scope 3', scopeId: "3" as const })),
    ];
  }, [emissionFactors]);

  const activeFactor = useMemo(() => {
    return emissionFactors[calcScope].find(f => f.id === calcActivityId) || null;
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

  const handleSaveEmissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFactor || calcAmount === "") return;
    setIsCalcModalOpen(false);
    toast.success(`${calculatedEmissions} tCO2e added to Scope ${calcScope} emissions!`);
  };

  const openEditFactorModal = (factor: FactorType) => {
    setEditingFactor(factor);
    setEditFactorValue(factor.factor);
    setIsEditFactorModalOpen(true);
  };

  const handleSaveFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFactor || editFactorValue === "" || !editingFactor.scopeId) return;

    setEmissionFactors(prev => {
      const updatedScopeFactors = prev[editingFactor.scopeId!].map(f => {
        if (f.id === editingFactor.id) {
          return { ...f, factor: Number(editFactorValue) };
        }
        return f;
      });
      return { ...prev, [editingFactor.scopeId!]: updatedScopeFactors };
    });

    setIsEditFactorModalOpen(false);
    toast.success(`${editingFactor.activity} emission factor updated!`);
  };

  const handleDownloadReport = () => {
    toast.success("Generating Carbon Footprint Report (PDF)...");
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Carbon Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Track GHG emissions across Scope 1, 2, and 3 value chains.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            className="bg-white dark:bg-zinc-900 border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Report
          </button>
          
          <div className="h-6 w-px bg-border hidden sm:block mx-1"></div>
          
          <button 
            onClick={() => openDataEntryModal("1")}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all flex items-center shadow-sm hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-1" /> Scope 1
          </button>
          <button 
            onClick={() => openDataEntryModal("2")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center shadow-sm hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-1" /> Scope 2
          </button>
          <button 
            onClick={() => openDataEntryModal("3")}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-all flex items-center shadow-sm hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-1" /> Scope 3
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-gray-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><Factory className="w-4 h-4 mr-1.5 text-gray-500" /> Scope 1</p>
              <h3 className="text-3xl font-bold mt-2">108.0</h3>
              <p className="text-xs text-emerald-500 mt-2 flex items-center"><TrendingDown className="w-3 h-3 mr-1" /> 2.1% (tCO2e)</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><Cloud className="w-4 h-4 mr-1.5 text-blue-500" /> Scope 2</p>
              <h3 className="text-3xl font-bold mt-2">269.0</h3>
              <p className="text-xs text-red-500 mt-2 flex items-center"><TrendingDown className="w-3 h-3 mr-1 rotate-180" /> 1.5% (tCO2e)</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><Truck className="w-4 h-4 mr-1.5 text-orange-500" /> Scope 3</p>
              <h3 className="text-3xl font-bold mt-2">550.0</h3>
              <p className="text-xs text-emerald-500 mt-2 flex items-center"><TrendingDown className="w-3 h-3 mr-1" /> 5.4% (tCO2e)</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all relative overflow-hidden group bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400 flex items-center"><Activity className="w-4 h-4 mr-1.5" /> Intensity</p>
              <h3 className="text-3xl font-bold mt-2 text-emerald-900 dark:text-emerald-50">0.42</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center">tCO2e / unit (Avg: 0.55)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'dashboard' 
              ? "text-emerald-600 dark:text-emerald-400" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Overview & Trends
          {activeTab === 'dashboard' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 shadow-[0_-2px_10px_rgba(16,185,129,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('factors')}
          className={cn(
            "px-6 py-3 text-sm font-medium transition-colors relative",
            activeTab === 'factors' 
              ? "text-emerald-600 dark:text-emerald-400" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Emission Factor Library
          {activeTab === 'factors' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 shadow-[0_-2px_10px_rgba(16,185,129,0.5)]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500">
          <div className="glass-card rounded-xl p-6 border border-border/50 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Monthly Emissions Trend</h3>
              <select className="bg-transparent border border-border text-xs rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-emerald-500 text-muted-foreground">
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#6b7280" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="scope2" name="Scope 2" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line type="monotone" dataKey="scope3" name="Scope 3" stroke="#f97316" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 border border-border/50 shadow-sm">
             <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Target vs Actual (YTD)</h3>
              <span className="bg-emerald-500/10 text-emerald-600 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">On Track</span>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={targetData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar dataKey="actual" name="Actual (tCO2e)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="target" name="Target (tCO2e)" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
          <div className="p-5 border-b border-border/50 bg-muted/10">
            <h3 className="font-semibold text-lg">Standard Emission Factors</h3>
            <p className="text-sm text-muted-foreground mt-1">Library of factors used by the Automatic GHG Calculator. You can edit custom factors here.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Scope</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Activity / Source</th>
                  <th className="p-4 font-medium">Unit</th>
                  <th className="p-4 font-medium">Factor (tCO2e/unit)</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {allFactors.map((factor) => (
                  <tr key={factor.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase",
                        factor.scopeName === 'Scope 1' && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                        factor.scopeName === 'Scope 2' && "bg-blue-100/50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                        factor.scopeName === 'Scope 3' && "bg-orange-100/50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                      )}>
                        {factor.scopeName}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{factor.type}</td>
                    <td className="p-4 font-medium text-foreground">{factor.activity}</td>
                    <td className="p-4 text-muted-foreground">per {factor.unit}</td>
                    <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 font-medium">{factor.factor}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => openEditFactorModal(factor)}
                        className="p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded transition-colors"
                        title="Edit Factor"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GHG Calculator Modal */}
      <Modal isOpen={isCalcModalOpen} onClose={() => setIsCalcModalOpen(false)} title={`Add Scope ${calcScope} Emissions`} maxWidthClass="max-w-xl">
        <form onSubmit={handleSaveEmissions} className="space-y-6 px-1 pb-2 mt-2">
          
          <div className="bg-gradient-to-br from-emerald-500/10 to-transparent p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg shrink-0">
              <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <strong className="block mb-1 text-emerald-950 dark:text-emerald-100">Automatic GHG Calculator</strong>
              Select your activity for Scope {calcScope}. Enter raw data, and we will automatically apply the standard emission factor.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Activity / Source</label>
              <div className="relative">
                <select 
                  required
                  value={calcActivityId}
                  onChange={(e) => setCalcActivityId(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl pl-4 pr-10 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all"
                >
                  <option value="" disabled>-- Select Activity for Scope {calcScope} --</option>
                  {emissionFactors[calcScope].map(f => (
                    <option key={f.id} value={f.id}>{f.activity} ({f.type})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {activeFactor && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-foreground">Activity Amount <span className="text-muted-foreground font-normal">({activeFactor.unit})</span></label>
                <div className="flex gap-3">
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="any"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value ? Number(e.target.value) : "")}
                    placeholder={`e.g., 5000`} 
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
                  />
                  <div className="bg-muted px-5 py-3 rounded-xl border border-border flex items-center justify-center text-sm font-semibold text-muted-foreground whitespace-nowrap shadow-sm">
                    {activeFactor.unit}
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reporting Month</label>
              <input 
                type="month" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-6 border border-border flex flex-col items-center justify-center mt-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5 pointer-events-none"></div>
            <p className="text-sm font-medium text-muted-foreground mb-2 relative z-10">Calculated Emissions</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className={cn(
                "text-5xl font-bold tracking-tight transition-all duration-300",
                calcAmount !== "" && activeFactor ? "text-emerald-600 dark:text-emerald-400 scale-110" : "text-foreground"
              )}>
                {calculatedEmissions}
              </span>
              <span className="text-xl font-medium text-muted-foreground">tCO2e</span>
            </div>
            {activeFactor && (
              <p className="text-xs text-muted-foreground mt-4 relative z-10 bg-background/50 px-3 py-1 rounded-full border border-border/50">
                Formula: Amount × <span className="font-mono text-emerald-600 dark:text-emerald-400">{activeFactor.factor}</span>
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
            <button type="button" onClick={() => setIsCalcModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!activeFactor || calcAmount === ""} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              Save Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Factor Modal */}
      <Modal isOpen={isEditFactorModalOpen} onClose={() => setIsEditFactorModalOpen(false)} title="Edit Emission Factor" maxWidthClass="max-w-md">
        {editingFactor && (
          <form onSubmit={handleSaveFactor} className="space-y-6 px-1 pb-2 mt-2">
            <div className="bg-muted/30 p-4 rounded-xl border border-border/50 text-sm">
              <p className="text-muted-foreground mb-1">Activity / Source</p>
              <p className="font-medium text-foreground">{editingFactor.activity} <span className="text-muted-foreground font-normal">({editingFactor.scopeName})</span></p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Emission Factor <span className="text-muted-foreground font-normal">(tCO2e per {editingFactor.unit})</span>
              </label>
              <input 
                type="number" 
                required
                step="any"
                min="0"
                value={editFactorValue}
                onChange={(e) => setEditFactorValue(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all font-mono" 
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
              <button type="button" onClick={() => setIsEditFactorModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={editFactorValue === ""} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50">
                Update Factor
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
