"use client";

import { useState } from "react";
import { ArrowLeft, Plus, PackageSearch, Factory, AlertTriangle, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import toast from "react-hot-toast";
import { exportInventoryExcel } from "@/lib/exportWasteExcel";

export interface InventoryRecord {
  id: string;
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

const initialData: InventoryRecord[] = [
  { 
    id: '1', wasteName: 'Materials', sourceOfWaste: 'Production floor', wasteClassification: 'Non-Hazardous', quantity: 23124, unit: 'Kg',
    labeling: 'No', identification: 'Yes', ppe: 'No', wasteStorageRequirement: 'Store separately', locationOfStorage: 'Wastage Store Room',
    wasteDisposalRoute: 'Handover to waste contractor', applicableLegalPermit: 'No', onSiteTreatmentMethod: 'N/A', quantityOfRecycledWaste: 'N/A',
    approvedWasteContractor: 'URS AB Enterprise', dateOfLastWasteHandover: '21.01.24', challanNo: '3093', 
    emergencyContactPerson: 'Saiful Islam, Manager (HR,Compliance)', checkedBy: 'Shahnayaz Hossain Joy, Executive-Environment', checkedOn: '30/09/2024', remarks: ''
  },
  { 
    id: '2', wasteName: 'Battery', sourceOfWaste: 'Different Sector', wasteClassification: 'Hazardous', quantity: 0, unit: 'Kg',
    labeling: 'Yes', identification: 'Yes', ppe: 'Yes', wasteStorageRequirement: 'Store separately', locationOfStorage: 'Wastage Store Room',
    wasteDisposalRoute: 'Handover to waste contractor', applicableLegalPermit: 'No', onSiteTreatmentMethod: 'N/A', quantityOfRecycledWaste: 'N/A',
    approvedWasteContractor: 'URS AB Enterprise', dateOfLastWasteHandover: '21.01.24', challanNo: '3093', 
    emergencyContactPerson: 'Saiful Islam, Manager (HR,Compliance)', checkedBy: 'Shahnayaz Hossain Joy, Executive-Environment', checkedOn: '30/09/2024', remarks: ''
  }
];

export default function WasteInventoryPage() {
  const [records, setRecords] = useState<InventoryRecord[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<InventoryRecord>>({
    wasteClassification: 'Non-Hazardous', unit: 'Kg', labeling: 'No', identification: 'Yes', ppe: 'No'
  });

  const handleChange = (field: keyof InventoryRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: InventoryRecord = {
      id: Date.now().toString(),
      wasteName: formData.wasteName || '',
      sourceOfWaste: formData.sourceOfWaste || '',
      wasteClassification: formData.wasteClassification as any || 'Non-Hazardous',
      quantity: Number(formData.quantity) || 0,
      unit: formData.unit || 'Kg',
      labeling: formData.labeling as any || 'No',
      identification: formData.identification as any || 'Yes',
      ppe: formData.ppe as any || 'No',
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

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    toast.success("Inventory updated successfully!");
    setFormData({ wasteClassification: 'Non-Hazardous', unit: 'Kg', labeling: 'No', identification: 'Yes', ppe: 'No' });
  };

  const totalGeneral = records.filter(r => r.wasteClassification === 'Non-Hazardous').reduce((sum, r) => sum + r.quantity, 0);
  const totalHaz = records.filter(r => r.wasteClassification === 'Hazardous').reduce((sum, r) => sum + r.quantity, 0);

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

      {/* Tables Section */}
      <div className="space-y-8">
        
        {/* Non-Hazardous Table */}
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col w-full max-w-full min-w-0">
          <div className="p-4 border-b border-border bg-emerald-100/50 dark:bg-emerald-900/20 text-center">
            <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">Non-Hazardous Waste Inventory</h3>
          </div>
          <div className="overflow-x-auto w-full max-w-full pb-4 custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse min-w-max">
              <thead className="bg-muted/30 font-medium">
                <tr>
                  <th className="px-4 py-3 border border-border text-left sticky left-0 bg-muted/50 backdrop-blur-md z-20 shadow-[1px_0_0_0_var(--border)] font-semibold">Waste Name</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Source</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Quantity</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Labeling</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Identification</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">PPE</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Storage Req.</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Location</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Disposal Route</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Legal Permit</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Treatment</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Recycled Qty</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Contractor</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Handover Date</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Challan No</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Emergency Contact</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Checked By</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Checked On</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.filter(r => r.wasteClassification === 'Non-Hazardous').map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors whitespace-nowrap">
                    <td className="px-4 py-2.5 font-medium sticky left-0 bg-background border border-border shadow-[1px_0_0_0_var(--border)] z-10 flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 text-stone-500" /> {record.wasteName}
                    </td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.sourceOfWaste}</td>
                    <td className="px-4 py-2.5 border border-border text-center font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/20">{record.quantity} {record.unit}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.labeling}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.identification}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.ppe}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.wasteStorageRequirement}</td>
                    <td className="px-4 py-2.5 border border-border text-center font-medium">{record.locationOfStorage}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.wasteDisposalRoute}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.applicableLegalPermit}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.onSiteTreatmentMethod}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.quantityOfRecycledWaste}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.approvedWasteContractor}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.dateOfLastWasteHandover}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.challanNo}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-xs max-w-[200px] truncate" title={record.emergencyContactPerson}>{record.emergencyContactPerson}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-xs">{record.checkedBy}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.checkedOn}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.remarks}</td>
                  </tr>
                ))}
                {records.filter(r => r.wasteClassification === 'Non-Hazardous').length === 0 && (
                  <tr>
                    <td colSpan={19} className="px-5 py-8 text-center text-muted-foreground">
                      No Non-Hazardous waste inventory found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hazardous Table */}
        <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden flex flex-col w-full max-w-full min-w-0">
          <div className="p-4 border-b border-border bg-rose-100/50 dark:bg-rose-900/20 text-center">
            <h3 className="text-lg font-bold text-rose-900 dark:text-rose-300">Hazardous Waste Inventory</h3>
          </div>
          <div className="overflow-x-auto w-full max-w-full pb-4 custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse min-w-max">
              <thead className="bg-muted/30 font-medium">
                <tr>
                  <th className="px-4 py-3 border border-border text-left sticky left-0 bg-muted/50 backdrop-blur-md z-20 shadow-[1px_0_0_0_var(--border)] font-semibold">Waste Name</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Source</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Quantity</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Labeling</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Identification</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">PPE</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Storage Req.</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Location</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Disposal Route</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Legal Permit</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Treatment</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Recycled Qty</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Contractor</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Handover Date</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Challan No</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Emergency Contact</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Checked By</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Checked On</th>
                  <th className="px-4 py-3 border border-border font-semibold text-center">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.filter(r => r.wasteClassification === 'Hazardous').map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors whitespace-nowrap">
                    <td className="px-4 py-2.5 font-medium sticky left-0 bg-background border border-border shadow-[1px_0_0_0_var(--border)] z-10 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> {record.wasteName}
                    </td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.sourceOfWaste}</td>
                    <td className="px-4 py-2.5 border border-border text-center font-bold text-red-700 dark:text-red-400 bg-red-50/20">{record.quantity} {record.unit}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.labeling}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.identification}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.ppe}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.wasteStorageRequirement}</td>
                    <td className="px-4 py-2.5 border border-border text-center font-medium">{record.locationOfStorage}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.wasteDisposalRoute}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.applicableLegalPermit}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.onSiteTreatmentMethod}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.quantityOfRecycledWaste}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.approvedWasteContractor}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.dateOfLastWasteHandover}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.challanNo}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-xs max-w-[200px] truncate" title={record.emergencyContactPerson}>{record.emergencyContactPerson}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-xs">{record.checkedBy}</td>
                    <td className="px-4 py-2.5 border border-border text-center">{record.checkedOn}</td>
                    <td className="px-4 py-2.5 border border-border text-center text-muted-foreground">{record.remarks}</td>
                  </tr>
                ))}
                {records.filter(r => r.wasteClassification === 'Hazardous').length === 0 && (
                  <tr>
                    <td colSpan={19} className="px-5 py-8 text-center text-muted-foreground">
                      No Hazardous waste inventory found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Inventory Matrix" maxWidthClass="max-w-5xl">
        <form onSubmit={handleSave} className="space-y-6 px-1">
          
          <div className="space-y-6">
            {/* Section 1: Basic Info */}
            <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-4">
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b border-border pb-2">1. Basic Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Waste Name</label>
                  <input type="text" value={formData.wasteName || ''} onChange={(e) => handleChange('wasteName', e.target.value)} required className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Source of Waste</label>
                  <input type="text" value={formData.sourceOfWaste || ''} onChange={(e) => handleChange('sourceOfWaste', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Classification</label>
                  <select value={formData.wasteClassification} onChange={(e) => handleChange('wasteClassification', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm">
                    <option value="Non-Hazardous">Non-Hazardous</option>
                    <option value="Hazardous">Hazardous</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Quantity</label>
                  <div className="flex gap-2">
                    <input type="number" value={formData.quantity || ''} onChange={(e) => handleChange('quantity', e.target.value)} required className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                    <select value={formData.unit} onChange={(e) => handleChange('unit', e.target.value)} className="w-20 bg-background border border-border rounded-xl px-2 py-2 text-sm">
                      <option value="Kg">Kg</option>
                      <option value="Pcs">Pcs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Handling & Storage */}
            <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-4">
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b border-border pb-2">2. Handling & Storage</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Labeling (Yes/No)</label>
                  <select value={formData.labeling} onChange={(e) => handleChange('labeling', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm">
                    <option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Identification</label>
                  <select value={formData.identification} onChange={(e) => handleChange('identification', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm">
                    <option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">PPE Required?</label>
                  <select value={formData.ppe} onChange={(e) => handleChange('ppe', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm">
                    <option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Storage Requirement</label>
                  <input type="text" value={formData.wasteStorageRequirement || ''} onChange={(e) => handleChange('wasteStorageRequirement', e.target.value)} placeholder="e.g. Store separately" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-foreground">Location of Storage</label>
                  <input type="text" value={formData.locationOfStorage || ''} onChange={(e) => handleChange('locationOfStorage', e.target.value)} placeholder="e.g. Wastage Store Room" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
            </div>

            {/* Section 3: Disposal & Route */}
            <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-4">
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b border-border pb-2">3. Disposal & Treatment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Waste Disposal Route</label>
                  <input type="text" value={formData.wasteDisposalRoute || ''} onChange={(e) => handleChange('wasteDisposalRoute', e.target.value)} placeholder="e.g. Handover to waste contractor" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Legal Permit Req?</label>
                  <input type="text" value={formData.applicableLegalPermit || ''} onChange={(e) => handleChange('applicableLegalPermit', e.target.value)} placeholder="Yes/No" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">On-Site Treatment</label>
                  <input type="text" value={formData.onSiteTreatmentMethod || ''} onChange={(e) => handleChange('onSiteTreatmentMethod', e.target.value)} placeholder="N/A or detail" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Quantity of Recycled Waste</label>
                  <input type="text" value={formData.quantityOfRecycledWaste || ''} onChange={(e) => handleChange('quantityOfRecycledWaste', e.target.value)} placeholder="N/A or detail" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
            </div>

            {/* Section 4: Handover & Personnel */}
            <div className="bg-muted/30 p-5 rounded-2xl border border-border space-y-4">
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b border-border pb-2">4. Handover & Verification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Approved Contractor</label>
                  <input type="text" value={formData.approvedWasteContractor || ''} onChange={(e) => handleChange('approvedWasteContractor', e.target.value)} placeholder="URS AB Enterprise" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Date of Last Handover</label>
                  <input type="text" value={formData.dateOfLastWasteHandover || ''} onChange={(e) => handleChange('dateOfLastWasteHandover', e.target.value)} placeholder="21.01.24" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Challan No</label>
                  <input type="text" value={formData.challanNo || ''} onChange={(e) => handleChange('challanNo', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Checked On (DD/MM/YYYY)</label>
                  <input type="text" value={formData.checkedOn || ''} onChange={(e) => handleChange('checkedOn', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-foreground">Emergency Contact</label>
                  <input type="text" value={formData.emergencyContactPerson || ''} onChange={(e) => handleChange('emergencyContactPerson', e.target.value)} placeholder="Name, Designation, Number" className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-foreground">Checked By (Name & Desig)</label>
                  <input type="text" value={formData.checkedBy || ''} onChange={(e) => handleChange('checkedBy', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-foreground">Remarks</label>
                  <input type="text" value={formData.remarks || ''} onChange={(e) => handleChange('remarks', e.target.value)} className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t border-border flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-bold transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95">Save Inventory Data</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
