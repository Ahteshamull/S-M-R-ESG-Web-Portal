"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Download, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { exportWasteGenerationExcel } from "@/lib/exportWasteExcel";

export interface WasteGenerationRecord {
  id: string;
  month: string;
  nonHaz: Record<string, number>;
  haz: Record<string, number>;
}

const initialNonHazCols = ['Jhut', 'Paper cartoon', 'Paper Roll', 'Poly Bag & Gani', 'Moni Fabric', 'Loose Thread', 'Empty Cone', 'Iron Cloth', 'Plastics (Hanger)', 'Dust', 'Broken Chair', 'Water tank', 'Printed paper', 'Iron', 'Tin', 'Thai Aluminium', 'Food'];
const initialHazCols = ['Empty containers (cleaning/sanitizing)', 'Batteries', 'Chemical drum (steel)', 'Chemical drum (plastic)', 'Fluorescent light bulb', 'Ink cartridges', 'Electronic waste'];

const initialData: WasteGenerationRecord[] = [
  {
    id: '1', month: 'January',
    nonHaz: {
      'Jhut': 193258.7, 'Paper cartoon': 15939.8, 'Paper Roll': 12590.9, 'Poly Bag & Gani': 3596.3,
      'Moni Fabric': 5101.5, 'Loose Thread': 4247.0, 'Empty Cone': 1476.2, 'Iron Cloth': 0,
      'Plastics (Hanger)': 66.2, 'Dust': 29178.7, 'Broken Chair': 0, 'Water tank': 0,
      'Printed paper': 240.0, 'Iron': 1352.7, 'Tin': 352.1, 'Thai Aluminium': 6.4, 'Food': 385.0
    },
    haz: {
      'Empty containers (cleaning/sanitizing)': 261.5, 'Batteries': 45.0, 'Chemical drum (steel)': 0,
      'Chemical drum (plastic)': 22.0, 'Fluorescent light bulb': 167.0, 'Ink cartridges': 126.0,
      'Electronic waste': 31.0
    }
  }
];

export default function WasteGenerationPage() {
  const [records, setRecords] = useState<WasteGenerationRecord[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"nonHaz" | "haz">("nonHaz");

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
    toast.success("New field added successfully!");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parse = (val: string | undefined) => (!val || val === "") ? 0 : Number(val);

    const nonHazData: Record<string, number> = {};
    nonHazCols.forEach(col => { nonHazData[col] = parse(nonHazState[col]); });

    const hazData: Record<string, number> = {};
    hazCols.forEach(col => { hazData[col] = parse(hazState[col]); });

    const newRecord: WasteGenerationRecord = {
      id: Date.now().toString(),
      month,
      nonHaz: nonHazData,
      haz: hazData
    };

    setRecords([...records, newRecord]);
    setIsModalOpen(false);
    toast.success("Monthly record logged successfully!");
    
    // Reset inputs
    setNonHazState({});
    setHazState({});
  };

  return (
    <div className="space-y-8 pb-10 overflow-x-hidden w-full max-w-[100vw]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/waste" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Waste Generation Details</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium ml-12">Detailed tracking of non-hazardous and hazardous waste categories.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={() => exportWasteGenerationExcel(records, nonHazCols, hazCols)}
            className="bg-white/50 hover:bg-white text-blue-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-blue-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center h-10 border border-blue-200 dark:border-blue-800"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center h-10 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Log Monthly Data
          </button>
        </div>
      </div>

      {/* Non-Hazardous Table */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col w-full max-w-full min-w-0">
        <div className="p-4 border-b border-border bg-emerald-100/50 dark:bg-emerald-900/20 text-center">
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">Non-Hazardous Waste</h3>
        </div>
        <div className="overflow-x-auto w-full max-w-full pb-4 custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/30 font-medium">
              <tr>
                <th className="px-4 py-3 border border-border text-left sticky left-0 bg-muted/50 backdrop-blur-md z-20 shadow-[1px_0_0_0_var(--border)] font-semibold">Waste Category / Item</th>
                {records.map(r => (
                  <th key={r.id} className="px-3 py-3 border border-border text-center font-semibold">{r.month}</th>
                ))}
                <th className="px-4 py-3 border border-border text-center bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-300 font-bold min-w-[120px]">Total YTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {nonHazCols.map((col, idx) => {
                const rowTotal = records.reduce((sum, r) => sum + (r.nonHaz[col] || 0), 0);
                return (
                  <tr key={col} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium sticky left-0 bg-background border border-border shadow-[1px_0_0_0_var(--border)] z-10">{col}</td>
                    {records.map(r => (
                      <td key={`${col}-${r.id}`} className="px-3 py-2.5 border border-border text-center text-muted-foreground">
                        {r.nonHaz[col] || 0}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 border border-border text-center font-bold bg-muted/10 text-foreground">{rowTotal.toFixed(1)}</td>
                  </tr>
                );
              })}
              {records.length > 0 && (
                <tr className="bg-muted/40 font-bold border-t-2 border-border text-sm">
                  <td className="px-4 py-3.5 font-bold sticky left-0 bg-muted/40 border border-border shadow-[1px_0_0_0_var(--border)] z-10 text-right uppercase tracking-wider text-muted-foreground">Monthly Total</td>
                  {records.map(r => {
                    const monthTotal = nonHazCols.reduce((sum, col) => sum + (r.nonHaz[col] || 0), 0);
                    return <td key={`total-${r.id}`} className="px-3 py-3.5 border border-border text-center text-foreground">{monthTotal.toFixed(1)}</td>
                  })}
                  <td className="px-4 py-3.5 border border-border text-center text-emerald-700 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/20 text-base">
                    {records.reduce((sum, r) => sum + nonHazCols.reduce((s, col) => s + (r.nonHaz[col] || 0), 0), 0).toFixed(1)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hazardous Table */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col mt-8 w-full max-w-full min-w-0">
        <div className="p-4 border-b border-border bg-rose-100/50 dark:bg-rose-900/20 text-center">
          <h3 className="text-lg font-bold text-rose-900 dark:text-rose-300">Hazardous Waste</h3>
        </div>
        <div className="overflow-x-auto w-full max-w-full pb-4 custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/30 font-medium">
              <tr>
                <th className="px-4 py-3 border border-border text-left sticky left-0 bg-muted/50 backdrop-blur-md z-20 shadow-[1px_0_0_0_var(--border)] font-semibold">Waste Category / Item</th>
                {records.map(r => (
                  <th key={r.id} className="px-3 py-3 border border-border text-center font-semibold">{r.month}</th>
                ))}
                <th className="px-4 py-3 border border-border text-center bg-rose-50/50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300 font-bold min-w-[120px]">Total YTD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hazCols.map((col, idx) => {
                const rowTotal = records.reduce((sum, r) => sum + (r.haz[col] || 0), 0);
                return (
                  <tr key={col} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-medium sticky left-0 bg-background border border-border shadow-[1px_0_0_0_var(--border)] z-10">{col}</td>
                    {records.map(r => (
                      <td key={`${col}-${r.id}`} className="px-3 py-2.5 border border-border text-center text-muted-foreground">
                        {r.haz[col] || 0}
                      </td>
                    ))}
                    <td className="px-4 py-2.5 border border-border text-center font-bold bg-muted/10 text-foreground">{rowTotal.toFixed(1)}</td>
                  </tr>
                );
              })}
              {records.length > 0 && (
                <tr className="bg-muted/40 font-bold border-t-2 border-border text-sm">
                  <td className="px-4 py-3.5 font-bold sticky left-0 bg-muted/40 border border-border shadow-[1px_0_0_0_var(--border)] z-10 text-right uppercase tracking-wider text-muted-foreground">Monthly Total</td>
                  {records.map(r => {
                    const monthTotal = hazCols.reduce((sum, col) => sum + (r.haz[col] || 0), 0);
                    return <td key={`total-haz-${r.id}`} className="px-3 py-3.5 border border-border text-center text-foreground">{monthTotal.toFixed(1)}</td>
                  })}
                  <td className="px-4 py-3.5 border border-border text-center text-rose-700 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-900/20 text-base">
                    {records.reduce((sum, r) => sum + hazCols.reduce((s, col) => s + (r.haz[col] || 0), 0), 0).toFixed(1)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Waste Generation" maxWidthClass="max-w-5xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-muted/30 p-5 rounded-2xl border border-border/50">
            <div className="space-y-2 md:w-1/3">
              <label className="text-sm font-bold text-foreground">Select Month</label>
              <select 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
            <button 
              type="button" 
              onClick={() => setActiveTab("nonHaz")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'nonHaz' ? 'bg-background shadow text-emerald-600' : 'text-muted-foreground hover:bg-muted/80'}`}
            >
              Non-Hazardous Inputs
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab("haz")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'haz' ? 'bg-background shadow text-rose-600' : 'text-muted-foreground hover:bg-muted/80'}`}
            >
              Hazardous Inputs
            </button>
          </div>

          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm min-h-[400px]">
            
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-semibold text-muted-foreground">Fill in the quantities (in kg/pcs) for the generated items.</h4>
              
              {!isAddingField ? (
                <button 
                  type="button" 
                  onClick={() => setIsAddingField(true)}
                  className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1" /> Add Custom Field
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="E.g., Wood Waste" 
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-blue-500"
                    autoFocus
                  />
                  <button type="button" onClick={handleAddField} className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg">Add</button>
                  <button type="button" onClick={() => setIsAddingField(false)} className="text-xs font-bold text-muted-foreground px-2 hover:text-foreground">Cancel</button>
                </div>
              )}
            </div>

            {activeTab === 'nonHaz' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                {nonHazCols.map(col => (
                  <div key={col} className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground truncate block" title={col}>{col} (kg)</label>
                    <input 
                      type="number" 
                      step="any"
                      placeholder="0"
                      value={nonHazState[col] || ""} 
                      onChange={(e) => handleNonHazChange(col, e.target.value)} 
                      className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
                    />
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'haz' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5">
                {hazCols.map(col => (
                  <div key={col} className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground truncate block" title={col}>{col} (kg/pcs)</label>
                    <input 
                      type="number" 
                      step="any"
                      placeholder="0"
                      value={hazState[col] || ""} 
                      onChange={(e) => handleHazChange(col, e.target.value)} 
                      className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50" 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95">Save Monthly Data</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
