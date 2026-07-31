"use client";

import { useState } from "react";
import { ArrowLeft, Plus, PackageSearch, Factory, AlertTriangle, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { exportInventoryExcel } from "@/lib/exportWasteExcel";

interface InventoryRecord {
  id: string;
  date: string;
  wasteType: string;
  quantity: number;
  unit: string;
  storageArea: string;
  notes: string;
}

const initialData: InventoryRecord[] = [
  { id: '1', date: '2024-05-18', wasteType: 'General Waste', quantity: 500, unit: 'kg', storageArea: 'Storage Bin A', notes: 'Weekly collection' },
  { id: '2', date: '2024-05-18', wasteType: 'Hazardous Waste', quantity: 120, unit: 'kg', storageArea: 'HazMat Room 2', notes: 'Chemical drums' },
];

export default function WasteInventoryPage() {
  const [records, setRecords] = useState<InventoryRecord[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState("");
  const [wasteType, setWasteType] = useState("General Waste");
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("kg");
  const [storageArea, setStorageArea] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !quantity || !storageArea) {
      toast.error("Please fill all required fields");
      return;
    }

    const newRecord: InventoryRecord = {
      id: Date.now().toString(),
      date,
      wasteType,
      quantity: Number(quantity),
      unit,
      storageArea,
      notes
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    toast.success("Inventory updated successfully!");
    
    // reset
    setDate(""); setQuantity(""); setStorageArea(""); setNotes("");
  };

  const totalGeneral = records.filter(r => r.wasteType === 'General Waste').reduce((sum, r) => sum + r.quantity, 0);
  const totalHaz = records.filter(r => r.wasteType === 'Hazardous Waste').reduce((sum, r) => sum + r.quantity, 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/waste" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">Waste Inventory</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium ml-12">Track currently stored waste and storage area capacities.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={() => exportInventoryExcel(records)}
            className="bg-white/50 hover:bg-white text-emerald-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center h-10 border border-emerald-200 dark:border-emerald-800"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center h-10 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Add to Inventory
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-stone-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current General Waste</p>
              <h3 className="text-2xl font-bold mt-1">{totalGeneral} <span className="text-sm font-normal text-muted-foreground">kg</span></h3>
            </div>
            <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-stone-600 dark:text-stone-400">
              <Trash2 className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Hazardous Waste</p>
              <h3 className="text-2xl font-bold mt-1">{totalHaz} <span className="text-sm font-normal text-muted-foreground">kg</span></h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <PackageSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300">Inventory Stock</h3>
              <p className="text-sm text-emerald-700/70 dark:text-emerald-400/70 mt-0.5">Details of waste currently waiting for disposal or treatment</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr className="text-xs uppercase tracking-wider">
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Date Logged</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Waste Type</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Quantity</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Storage Area</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 font-medium">{record.date}</td>
                  <td className="px-5 py-4">
                    {record.wasteType === 'Hazardous Waste' ? (
                      <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> {record.wasteType}</span>
                    ) : (
                      <span className="text-stone-600 dark:text-stone-400 font-medium flex items-center gap-1.5"><Trash2 className="w-3.5 h-3.5"/> {record.wasteType}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/20">{record.quantity} {record.unit}</td>
                  <td className="px-5 py-4 font-medium">{record.storageArea}</td>
                  <td className="px-5 py-4 text-muted-foreground">{record.notes || '-'}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    Inventory is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Inventory" maxWidthClass="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-5 p-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Type Of Waste</label>
              <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm">
                <option>General Waste</option>
                <option>Hazardous Waste</option>
                <option>E-Waste</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Quantity</label>
              <div className="flex gap-2">
                <input type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))} required className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm" />
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-24 bg-background border border-border rounded-xl px-2 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm">
                  <option value="kg">kg</option>
                  <option value="Tons">Tons</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Storage Area</label>
              <input type="text" placeholder="e.g., Bin A, HazMat Room" value={storageArea} onChange={(e) => setStorageArea(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">Additional Notes</label>
            <input type="text" placeholder="Any specific details..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm" />
          </div>
          
          <div className="pt-2 flex justify-end gap-3 mt-8 border-t border-border/50 pt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95">Save Inventory</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
