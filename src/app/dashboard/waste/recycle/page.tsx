"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Recycle, DollarSign, Download } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { exportRecycleExcel } from "@/lib/exportWasteExcel";

interface RecycleRecord {
  id: string;
  date: string;
  materialType: string;
  quantity: number;
  vendor: string;
  revenue: number;
}

const initialData: RecycleRecord[] = [
  { id: '1', date: '2024-05-10', materialType: 'Plastic', quantity: 250, vendor: 'EcoPlast Recyclers', revenue: 1250 },
  { id: '2', date: '2024-05-12', materialType: 'Paper & Cardboard', quantity: 400, vendor: 'GreenPaper Ltd', revenue: 800 },
];

export default function RecycleWastePage() {
  const [records, setRecords] = useState<RecycleRecord[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [date, setDate] = useState("");
  const [materialType, setMaterialType] = useState("Plastic");
  const [quantity, setQuantity] = useState<number | "">("");
  const [vendor, setVendor] = useState("");
  const [revenue, setRevenue] = useState<number | "">("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !quantity || !vendor) {
      toast.error("Please fill all required fields");
      return;
    }

    const newRecord: RecycleRecord = {
      id: Date.now().toString(),
      date,
      materialType,
      quantity: Number(quantity),
      vendor,
      revenue: Number(revenue) || 0
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    toast.success("Recycle record logged successfully!");
    
    // reset
    setDate(""); setQuantity(""); setVendor(""); setRevenue("");
  };

  const totalQuantity = records.reduce((sum, r) => sum + r.quantity, 0);
  const totalRevenue = records.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/waste" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent">Recycled Waste</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium ml-12">Log recycled materials, vendor details, and generated revenue.</p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <button 
            onClick={() => exportRecycleExcel(records)}
            className="bg-white/50 hover:bg-white text-orange-700 dark:bg-white/10 dark:hover:bg-white/20 dark:text-orange-300 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center h-10 border border-orange-200 dark:border-orange-800"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 flex items-center h-10 active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Log Recycled Waste
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-green-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Recycled Volume</p>
              <h3 className="text-2xl font-bold mt-1">{totalQuantity} <span className="text-sm font-normal text-muted-foreground">kg</span></h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <Recycle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-yellow-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue Generated</p>
              <h3 className="text-2xl font-bold mt-1"><span className="text-sm font-normal text-muted-foreground mr-1">$</span>{totalRevenue}</h3>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border flex items-center justify-between bg-orange-50/50 dark:bg-orange-950/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300">Recycling Log</h3>
              <p className="text-sm text-orange-700/70 dark:text-orange-400/70 mt-0.5">Records of all recycled materials and vendors</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted/30 text-muted-foreground font-medium">
              <tr className="text-xs uppercase tracking-wider">
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Date</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Material Type</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Quantity (kg)</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Recycling Vendor</th>
                <th className="px-5 py-4 border-b border-border font-semibold text-foreground">Revenue ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4 font-medium">{record.date}</td>
                  <td className="px-5 py-4 text-muted-foreground font-semibold">{record.materialType}</td>
                  <td className="px-5 py-4 font-bold text-orange-700 dark:text-orange-400 bg-orange-50/20">{record.quantity}</td>
                  <td className="px-5 py-4 text-muted-foreground">{record.vendor}</td>
                  <td className="px-5 py-4 font-semibold text-green-600 dark:text-green-400">${record.revenue}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No recycle records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Recycled Waste" maxWidthClass="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-5 p-2">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Material Type</label>
              <select value={materialType} onChange={(e) => setMaterialType(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm">
                <option>Plastic</option>
                <option>Paper & Cardboard</option>
                <option>Metal</option>
                <option>Glass</option>
                <option>Fabric / Textile</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Quantity (kg)</label>
              <input type="number" placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))} required className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">Revenue Generated ($)</label>
              <input type="number" placeholder="0" value={revenue} onChange={(e) => setRevenue(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">Recycling Vendor</label>
            <input type="text" placeholder="Name of the recycling company" value={vendor} onChange={(e) => setVendor(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 shadow-sm" />
          </div>
          
          <div className="pt-2 flex justify-end gap-3 mt-8 border-t border-border/50 pt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-500/20 hover:shadow-orange-500/40 active:scale-95">Save Record</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
