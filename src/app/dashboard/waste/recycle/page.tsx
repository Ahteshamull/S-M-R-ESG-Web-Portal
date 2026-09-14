"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Plus, Recycle, DollarSign, Download, Loader2, Search, Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { exportRecycleExcel } from "@/lib/exportWasteExcel";
import { useGetWasteRecycleQuery, useCreateWasteRecycleMutation } from "@/lib/redux/slices/wasteApi";

interface RecycleRecord {
  id: string;
  date: string;
  materialType: string;
  quantity: number;
  vendor: string;
  revenue: number;
}

export default function RecycleWastePage() {
  const { data: records = [], isLoading, refetch } = useGetWasteRecycleQuery();
  const [createWasteRecycle, { isLoading: isSaving }] = useCreateWasteRecycleMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [date, setDate] = useState("");
  const [materialType, setMaterialType] = useState("Plastic");
  const [quantity, setQuantity] = useState<number | "">("");
  const [vendor, setVendor] = useState("");
  const [revenue, setRevenue] = useState<number | "">("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !quantity || !vendor) {
      toast.error("Please fill all required fields");
      return;
    }

    const newRecord = {
      date,
      materialType,
      quantity: Number(quantity),
      vendor,
      revenue: Number(revenue) || 0
    };

    const res = await createWasteRecycle(newRecord);

    if (!res.error) {
      setIsModalOpen(false);
      toast.success("Recycle record logged successfully!");
      setDate(""); setQuantity(""); setVendor(""); setRevenue("");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to log recycle record";
      toast.error(errorMsg);
    }
  };

  const totalQuantity = records.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  const totalRevenue = records.reduce((sum, r) => sum + (Number(r.revenue) || 0), 0);

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(r => 
      r.materialType.toLowerCase().includes(q) || 
      r.vendor.toLowerCase().includes(q) ||
      r.date.includes(q)
    );
  }, [records, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1.5">
            <Link href="/dashboard/waste" className="p-2 bg-muted hover:bg-muted/80 rounded-xl transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300 bg-clip-text text-transparent">
              Recycled Materials & Circularity
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium ml-11">
            Log diverted recycling materials, certified vendor agreements, and circular byproduct revenues.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => exportRecycleExcel(records)}
            className="bg-background hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm h-9 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-orange-500/20 active:scale-95 flex items-center h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform" /> Log Recycled Waste
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Total Recycled Volume</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                {totalQuantity.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">kg</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Diverted from landfills</p>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Recycle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Total Recycling Revenue</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                <span className="text-lg font-bold text-muted-foreground mr-1">$</span>{totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Generated from circular materials</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-background/50 backdrop-blur-xl p-3 rounded-2xl border border-border/50">
        <span className="text-xs font-bold text-muted-foreground">
          {records.length} Recycling Transactions Recorded
        </span>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search material or vendor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border/60 flex items-center justify-between bg-orange-500/5">
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-bold text-foreground">Material Handover & Vendor Logs</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
              <tr>
                <th className="px-4 py-3.5 border-b border-border">Date</th>
                <th className="px-4 py-3.5 border-b border-border">Material Type</th>
                <th className="px-4 py-3.5 border-b border-border">Quantity (kg)</th>
                <th className="px-4 py-3.5 border-b border-border">Contracted Vendor</th>
                <th className="px-4 py-3.5 border-b border-border text-right">Revenue ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{record.date}</td>
                  <td className="px-4 py-3 font-bold text-foreground">
                    <span className="px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs">
                      {record.materialType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                    {Number(record.quantity).toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-medium">{record.vendor}</td>
                  <td className="px-4 py-3 text-right font-bold text-amber-600 dark:text-amber-400">
                    ${Number(record.revenue).toLocaleString()}
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-xs">
                    {isLoading ? "Loading records..." : "No recycling records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Recycled Material Entry" maxWidthClass="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4 px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Material Type</label>
              <select 
                value={materialType} 
                onChange={(e) => setMaterialType(e.target.value)} 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="Plastic">Plastic</option>
                <option value="Paper">Paper</option>
                <option value="Metal">Metal</option>
                <option value="Fabric Scrap / Jhut">Fabric Scrap / Jhut</option>
                <option value="Cardboard">Cardboard</option>
                <option value="Glass">Glass</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity (kg)</label>
              <input 
                type="number" 
                placeholder="e.g. 500" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Revenue Generated ($)</label>
              <input 
                type="number" 
                placeholder="e.g. 250" 
                value={revenue} 
                onChange={(e) => setRevenue(e.target.value === "" ? "" : Number(e.target.value))} 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50" 
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Approved Recycler / Vendor</label>
              <input 
                type="text" 
                placeholder="Vendor Name & License" 
                value={vendor} 
                onChange={(e) => setVendor(e.target.value)} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50" 
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 active:scale-95 flex items-center">
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
