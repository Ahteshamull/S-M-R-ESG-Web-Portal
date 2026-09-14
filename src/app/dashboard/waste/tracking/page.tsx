"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Download, PlusCircle, Filter, Calendar, Layers, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { exportWasteGenerationExcel } from "@/lib/exportWasteExcel";
import { useGetWasteTrackingQuery, useCreateWasteTrackingMutation } from "@/lib/redux/slices/wasteApi";

export interface WasteGenerationRecord {
  id: string;
  month: string;
  year?: number;
  nonHaz: Record<string, number>;
  haz: Record<string, number>;
}

const initialNonHazCols = ['Jhut', 'Paper cartoon', 'Paper Roll', 'Poly Bag & Gani', 'Moni Fabric', 'Loose Thread', 'Empty Cone', 'Iron Cloth', 'Plastics (Hanger)', 'Dust', 'Broken Chair', 'Water tank', 'Printed paper', 'Iron', 'Tin', 'Thai Aluminium', 'Food'];
const initialHazCols = ['Empty containers (cleaning/sanitizing)', 'Batteries', 'Chemical drum (steel)', 'Chemical drum (plastic)', 'Fluorescent light bulb', 'Ink cartridges', 'Electronic waste'];

const WASTE_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WASTE_YEARS = [2030, 2029, 2028, 2027, 2026, 2025, 2024];

export default function WasteGenerationPage() {
  const { data: records = [], isLoading, refetch } = useGetWasteTrackingQuery();
  const [createWasteTracking, { isLoading: isSaving }] = useCreateWasteTrackingMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"nonHaz" | "haz">("nonHaz");

  // Month & Yearly Filters
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  // Filtered records based on Month and Year
  const filteredRecords = useMemo(() => {
    return records.filter((r: any) => {
      const matchYear = selectedYear === "All" || (r.year ? r.year === selectedYear : true);
      const matchMonth = selectedMonth === "All" || r.month.toLowerCase() === selectedMonth.toLowerCase();
      return matchYear && matchMonth;
    });
  }, [records, selectedYear, selectedMonth]);

  // Dynamic Columns State
  const [nonHazCols, setNonHazCols] = useState<string[]>(initialNonHazCols);
  const [hazCols, setHazCols] = useState<string[]>(initialHazCols);

  // Form State
  const [month, setMonth] = useState("February");
  const [nonHazState, setNonHazState] = useState<Record<string, string>>({});
  const [hazState, setHazState] = useState<Record<string, string>>({});

  // New Field State
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const handleNonHazChange = (field: string, val: string) => {
    setNonHazState(prev => ({ ...prev, [field]: val }));
  };

  const handleHazChange = (field: string, val: string) => {
    setHazState(prev => ({ ...prev, [field]: val }));
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    if (activeTab === "nonHaz") {
      if (nonHazCols.includes(newFieldName)) return toast.error("Field already exists!");
      setNonHazCols([...nonHazCols, newFieldName]);
    } else {
      if (hazCols.includes(newFieldName)) return toast.error("Field already exists!");
      setHazCols([...hazCols, newFieldName]);
    }
    setNewFieldName("");
    setIsAddingField(false);
    toast.success("New waste category added!");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parse = (val: string | undefined) => (!val || val === "") ? 0 : Number(val);

    const nonHazData: Record<string, number> = {};
    nonHazCols.forEach(col => { nonHazData[col] = parse(nonHazState[col]); });

    const hazData: Record<string, number> = {};
    hazCols.forEach(col => { hazData[col] = parse(hazState[col]); });

    const newRecord = {
      month,
      nonHaz: nonHazData,
      haz: hazData
    };

    const res = await createWasteTracking(newRecord);

    if (!res.error) {
      setIsModalOpen(false);
      toast.success("Monthly record logged successfully!");
      setNonHazState({});
      setHazState({});
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to log tracking record";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 pb-12 overflow-x-hidden w-full max-w-[100vw] animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1.5">
            <Link href="/dashboard/waste" className="p-2 bg-muted hover:bg-muted/80 rounded-xl transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Waste Generation Tracking
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium ml-11">
            Track category-wise monthly generation for hazardous and non-hazardous materials.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          {/* Year Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Years</option>
              {WASTE_YEARS.map(y => (
                <option key={y} value={y} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
            <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
              style={{ colorScheme: "dark" }}
            >
              <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Months (YTD)</option>
              {WASTE_MONTHS.map(m => (
                <option key={m} value={m} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => exportWasteGenerationExcel(filteredRecords.length > 0 ? filteredRecords : records, nonHazCols, hazCols)}
            className="bg-background hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm h-9 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Excel
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform" /> Log Monthly Data
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-background/50 backdrop-blur-xl p-3 rounded-2xl border border-border/50">
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/40">
          <button
            onClick={() => setActiveTab("nonHaz")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "nonHaz" ? "bg-background text-foreground shadow-sm font-bold text-emerald-600 dark:text-emerald-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-emerald-500" />
            Non-Hazardous Waste ({nonHazCols.length} Categories)
          </button>
          <button
            onClick={() => setActiveTab("haz")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "haz" ? "bg-background text-foreground shadow-sm font-bold text-rose-600 dark:text-rose-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Hazardous Waste ({hazCols.length} Categories)
          </button>
        </div>

        <button 
          onClick={() => setIsAddingField(true)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Add Category Column
        </button>
      </div>

      {/* New Category Modal/Input */}
      {isAddingField && (
        <div className="p-4 bg-muted/30 border border-border rounded-2xl flex flex-wrap items-center gap-3 animate-in fade-in duration-200">
          <input
            type="text"
            placeholder={`Enter new category for ${activeTab === 'nonHaz' ? 'Non-Hazardous' : 'Hazardous'}...`}
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            className="flex-1 min-w-[200px] bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button onClick={handleAddField} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">Add Category</button>
          <button onClick={() => { setIsAddingField(false); setNewFieldName(""); }} className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-medium">Cancel</button>
        </div>
      )}

      {/* Non-Hazardous Table */}
      {activeTab === "nonHaz" && (
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col w-full">
          <div className="p-4 border-b border-border/60 flex items-center justify-between bg-emerald-500/5">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-foreground">Non-Hazardous Waste Generation Matrix (kg)</h3>
            </div>
          </div>
          <div className="overflow-x-auto w-full pb-2">
            <table className="w-full text-xs text-center border-collapse min-w-max">
              <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3 border-b border-border text-left sticky left-0 bg-muted/95 backdrop-blur-md z-20 font-bold text-foreground">Month</th>
                  {nonHazCols.map((col) => (
                    <th key={col} className="px-3 py-3 border-b border-border font-medium">{col}</th>
                  ))}
                  <th className="px-4 py-3 border-b border-border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">Monthly Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRecords.map((r: any) => {
                  const rowTotal = nonHazCols.reduce((sum, c) => sum + (Number(r.nonHaz?.[c]) || 0), 0);
                  return (
                    <tr key={`nonhaz-${r._id || r.id || r.month}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 border-r border-border/40 font-bold text-left sticky left-0 bg-background/95 backdrop-blur-md z-10 text-foreground">
                        {r.month}
                      </td>
                      {nonHazCols.map((col) => (
                        <td key={col} className="px-3 py-2.5 text-muted-foreground">
                          {r.nonHaz?.[col] !== undefined && r.nonHaz?.[col] !== 0 ? Number(r.nonHaz[col]).toLocaleString() : '-'}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/5">
                        {rowTotal > 0 ? rowTotal.toLocaleString() : '-'}
                      </td>
                    </tr>
                  );
                })}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={nonHazCols.length + 2} className="px-5 py-8 text-center text-muted-foreground text-xs">
                      {isLoading ? "Loading monthly records..." : "No tracking records found for this period."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hazardous Table */}
      {activeTab === "haz" && (
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col w-full">
          <div className="p-4 border-b border-border/60 flex items-center justify-between bg-rose-500/5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-foreground">Hazardous Waste Generation Matrix (kg / units)</h3>
            </div>
          </div>
          <div className="overflow-x-auto w-full pb-2">
            <table className="w-full text-xs text-center border-collapse min-w-max">
              <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
                <tr>
                  <th className="px-4 py-3 border-b border-border text-left sticky left-0 bg-muted/95 backdrop-blur-md z-20 font-bold text-foreground">Month</th>
                  {hazCols.map((col) => (
                    <th key={col} className="px-3 py-3 border-b border-border font-medium">{col}</th>
                  ))}
                  <th className="px-4 py-3 border-b border-border bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold">Monthly Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRecords.map((r: any) => {
                  const rowTotal = hazCols.reduce((sum, c) => sum + (Number(r.haz?.[c]) || 0), 0);
                  return (
                    <tr key={`haz-${r._id || r.id || r.month}`} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5 border-r border-border/40 font-bold text-left sticky left-0 bg-background/95 backdrop-blur-md z-10 text-foreground">
                        {r.month}
                      </td>
                      {hazCols.map((col) => (
                        <td key={col} className="px-3 py-2.5 text-muted-foreground">
                          {r.haz?.[col] !== undefined && r.haz?.[col] !== 0 ? Number(r.haz[col]).toLocaleString() : '-'}
                        </td>
                      ))}
                      <td className="px-4 py-2.5 font-bold text-rose-700 dark:text-rose-400 bg-rose-500/5">
                        {rowTotal > 0 ? rowTotal.toLocaleString() : '-'}
                      </td>
                    </tr>
                  );
                })}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={hazCols.length + 2} className="px-5 py-8 text-center text-muted-foreground text-xs">
                      {isLoading ? "Loading monthly records..." : "No tracking records found for this period."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Monthly Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Monthly Generation Matrix" maxWidthClass="max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
          <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
            <div className="space-y-1 sm:w-1/3">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Month</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {WASTE_MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-2xl border border-border/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                Non-Hazardous Waste Quantities (kg)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {nonHazCols.map((col) => (
                  <div key={col} className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground truncate block" title={col}>{col}</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={nonHazState[col] || ''} 
                      onChange={(e) => handleNonHazChange(col, e.target.value)} 
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded-2xl border border-border/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-3">
                Hazardous Waste Quantities (kg / units)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {hazCols.map((col) => (
                  <div key={col} className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground truncate block" title={col}>{col}</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={hazState[col] || ''} 
                      onChange={(e) => handleHazChange(col, e.target.value)} 
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center">
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Generation Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
