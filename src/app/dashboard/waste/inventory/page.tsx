"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Plus, PackageSearch, Factory, AlertTriangle, Trash2, Download, Loader2, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { exportInventoryExcel } from "@/lib/exportWasteExcel";
import { useGetWasteInventoryQuery, useCreateWasteInventoryMutation } from "@/lib/redux/slices/wasteApi";

export interface InventoryRecord {
  _id?: string;
  id?: string;
  wasteName: string;
  sourceOfWaste: string;
  wasteClassification: "Non-Hazardous" | "Hazardous";
  quantity: number;
  unit: string;
  labeling: "Yes" | "No" | "N/A" | "";
  identification: "Yes" | "No" | "N/A" | "";
  ppe: "Yes" | "No" | "N/A" | "";
  wasteStorageRequirement: string;
  locationOfStorage: string;
  wasteDisposalRoute: string;
  applicableLegalPermit: string;
  onSiteTreatmentMethod: string;
  quantityOfRecycledWaste: string;
  approvedWasteContractor: string;
  dateOfLastWasteHandover: string;
  challanNo: string;
  emergencyContactPerson: string;
  checkedBy: string;
  checkedOn: string;
  remarks: string;
}

export default function WasteInventoryPage() {
  const { data: records = [], isLoading, refetch } = useGetWasteInventoryQuery();
  const [createWasteInventory, { isLoading: isSaving }] = useCreateWasteInventoryMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "Non-Hazardous" | "Hazardous">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState<Partial<InventoryRecord>>({
    wasteClassification: 'Non-Hazardous', unit: 'Kg', labeling: 'No', identification: 'Yes', ppe: 'No'
  });
  
  const handleChange = (field: keyof InventoryRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord = {
      wasteName: formData.wasteName || '',
      sourceOfWaste: formData.sourceOfWaste || '',
      wasteClassification: (formData.wasteClassification as any) || 'Non-Hazardous',
      quantity: Number(formData.quantity) || 0,
      unit: formData.unit || 'Kg',
      labeling: (formData.labeling as any) || 'No',
      identification: (formData.identification as any) || 'Yes',
      ppe: (formData.ppe as any) || 'No',
      wasteStorageRequirement: formData.wasteStorageRequirement || '',
      locationOfStorage: formData.locationOfStorage || '',
      wasteDisposalRoute: formData.wasteDisposalRoute || '',
      applicableLegalPermit: formData.applicableLegalPermit || '',
      onSiteTreatmentMethod: formData.onSiteTreatmentMethod || '',
      quantityOfRecycledWaste: formData.quantityOfRecycledWaste || '',
      approvedWasteContractor: formData.approvedWasteContractor || '',
      dateOfLastWasteHandover: formData.dateOfLastWasteHandover || '',
      challanNo: formData.challanNo || '',
      emergencyContactPerson: formData.emergencyContactPerson || '',
      checkedBy: formData.checkedBy || '',
      checkedOn: formData.checkedOn || '',
      remarks: formData.remarks || ''
    };

    const res = await createWasteInventory(newRecord);

    if (!res.error) {
      setIsModalOpen(false);
      toast.success("Inventory updated successfully!");
      setFormData({ wasteClassification: 'Non-Hazardous', unit: 'Kg', labeling: 'No', identification: 'Yes', ppe: 'No' });
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to save inventory record";
      toast.error(errorMsg);
    }
  };

  const totalGeneral = records.filter(r => r.wasteClassification === 'Non-Hazardous').reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  const totalHaz = records.filter(r => r.wasteClassification === 'Hazardous').reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);

  // Filtered records based on tab and search
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesTab = activeTab === "all" || r.wasteClassification === activeTab;
      const matchesSearch = !searchQuery || 
        r.wasteName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (r.sourceOfWaste && r.sourceOfWaste.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.approvedWasteContractor && r.approvedWasteContractor.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [records, activeTab, searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1.5">
            <Link href="/dashboard/waste" className="p-2 bg-muted hover:bg-muted/80 rounded-xl transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
              Waste Inventory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium ml-11">
            Track stored hazardous and non-hazardous waste with real-time handover manifests.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => exportInventoryExcel(records)}
            className="bg-background hover:bg-muted border border-border text-foreground px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center shadow-sm h-9 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export Excel
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform" /> Add to Inventory
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-stone-400 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Non-Hazardous Waste</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{totalGeneral.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">kg</span></h3>
            </div>
            <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl text-stone-600 dark:text-stone-400">
              <Trash2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-rose-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Hazardous Waste</p>
              <h3 className="text-3xl font-black mt-2 text-rose-600 dark:text-rose-400">{totalHaz.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">kg</span></h3>
            </div>
            <div className="p-3 bg-rose-100 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Total Stored Records</p>
              <h3 className="text-3xl font-black mt-2 text-emerald-600 dark:text-emerald-400">{records.length} <span className="text-xs font-normal text-muted-foreground">items</span></h3>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
              <PackageSearch className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-background/50 backdrop-blur-xl p-3 rounded-2xl border border-border/50">
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border/40">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Inventory ({records.length})
          </button>
          <button
            onClick={() => setActiveTab("Non-Hazardous")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "Non-Hazardous" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Non-Hazardous
          </button>
          <button
            onClick={() => setActiveTab("Hazardous")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "Hazardous" ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Hazardous
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search waste or contractor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Responsive Table */}
      <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto w-full pb-2">
          <table className="w-full text-xs sm:text-sm text-left border-collapse min-w-max">
            <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
              <tr>
                <th className="px-4 py-3.5 border-b border-border text-left sticky left-0 bg-muted/90 backdrop-blur-md z-20 font-bold text-foreground">Waste Name</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Class</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Source</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Quantity</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Storage Req.</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Location</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Contractor</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Handover Date</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Challan No</th>
                <th className="px-4 py-3.5 border-b border-border text-center">Checked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredRecords.map((record) => (
                <tr key={record._id || record.id || record.wasteName} className="hover:bg-muted/30 transition-colors whitespace-nowrap">
                  <td className="px-4 py-3 font-bold sticky left-0 bg-background/95 backdrop-blur-md border-r border-border/40 z-10 flex items-center gap-2 text-foreground">
                    {record.wasteClassification === 'Hazardous' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                    {record.wasteName}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      record.wasteClassification === 'Hazardous' 
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400' 
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {record.wasteClassification}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{record.sourceOfWaste || '-'}</td>
                  <td className={`px-4 py-3 text-center font-bold ${
                    record.wasteClassification === 'Hazardous' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {Number(record.quantity).toLocaleString()} {record.unit}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{record.wasteStorageRequirement || '-'}</td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">{record.locationOfStorage || '-'}</td>
                  <td className="px-4 py-3 text-center font-medium text-foreground">{record.approvedWasteContractor || '-'}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{record.dateOfLastWasteHandover || '-'}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs">{record.challanNo || '-'}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{record.checkedBy || '-'}</td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-muted-foreground text-xs">
                    {isLoading ? "Loading waste inventory..." : "No waste inventory records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Waste Inventory Matrix" maxWidthClass="max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6 px-1 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">1. Basic Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Waste Name</label>
                  <input type="text" value={formData.wasteName || ''} onChange={(e) => handleChange('wasteName', e.target.value)} required placeholder="e.g. Chemical drums" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Source of Waste</label>
                  <input type="text" value={formData.sourceOfWaste || ''} onChange={(e) => handleChange('sourceOfWaste', e.target.value)} placeholder="e.g. Dyeing Unit" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Classification</label>
                  <select value={formData.wasteClassification} onChange={(e) => handleChange('wasteClassification', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs">
                    <option value="Non-Hazardous">Non-Hazardous</option>
                    <option value="Hazardous">Hazardous</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Quantity</label>
                  <div className="flex gap-2">
                    <input type="number" value={formData.quantity || ''} onChange={(e) => handleChange('quantity', e.target.value)} required placeholder="0" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                    <select value={formData.unit} onChange={(e) => handleChange('unit', e.target.value)} className="w-20 bg-background border border-border rounded-xl px-2 py-2 text-xs">
                      <option value="Kg">Kg</option>
                      <option value="Pcs">Pcs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">2. Storage & Handling</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Location of Storage</label>
                  <input type="text" value={formData.locationOfStorage || ''} onChange={(e) => handleChange('locationOfStorage', e.target.value)} placeholder="Wastage Yard" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Storage Requirement</label>
                  <input type="text" value={formData.wasteStorageRequirement || ''} onChange={(e) => handleChange('wasteStorageRequirement', e.target.value)} placeholder="Covered Shed" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Approved Contractor</label>
                  <input type="text" value={formData.approvedWasteContractor || ''} onChange={(e) => handleChange('approvedWasteContractor', e.target.value)} placeholder="Authorized Recycler" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">3. Verification & Personnel</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Challan / Manifest No</label>
                  <input type="text" value={formData.challanNo || ''} onChange={(e) => handleChange('challanNo', e.target.value)} placeholder="CH-2026-09" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Checked By</label>
                  <input type="text" value={formData.checkedBy || ''} onChange={(e) => handleChange('checkedBy', e.target.value)} placeholder="Officer Name" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Remarks</label>
                  <input type="text" value={formData.remarks || ''} onChange={(e) => handleChange('remarks', e.target.value)} placeholder="Optional note" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex items-center">
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Inventory Data
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
