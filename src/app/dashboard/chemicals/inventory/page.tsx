"use client";

import { useState } from "react";
import { FlaskConical, FileCheck, Search, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { 
  useGetChemicalsQuery, 
  useCreateChemicalMutation, 
  useDeleteChemicalMutation 
} from "@/lib/redux/slices/chemicalsApi";

export default function ChemicalInventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [chemicalToDelete, setChemicalToDelete] = useState<string | null>(null);
  
  const { data: chemicals = [], isLoading } = useGetChemicalsQuery();
  const [createChemical] = useCreateChemicalMutation();
  const [deleteChemical] = useDeleteChemicalMutation();

  // Form State
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [chemName, setChemName] = useState("");
  const [chemType, setChemType] = useState("");
  const [chemQty, setChemQty] = useState("");
  const [chemArea, setChemArea] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chemName || !chemType) return;

    const payload = {
      date,
      chemicalName: chemName,
      chemicalType: chemType,
      quantity: chemQty || "0 Kg",
      useArea: chemArea || "General Floor",
      incheckStatus: "Submitted"
    };

    const res = await createChemical(payload);

    if (!res.error) {
      toast.success("New chemical added to inventory!");
      setIsAddModalOpen(false);
      setChemName(""); setChemType(""); setChemQty(""); setChemArea("");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to add chemical";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async () => {
    if (!chemicalToDelete) return;
    const res = await deleteChemical(chemicalToDelete);
    if (!res.error) {
      toast.success(`Removed chemical successfully!`);
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to remove chemical";
      toast.error(errorMsg);
    }
    setChemicalToDelete(null);
  };

  const selectedChemicalName = chemicals.find((c: any) => c._id === chemicalToDelete)?.chemicalName || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/chemicals" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Chemical Inventory</h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mt-1">Manage chemical stock, usage areas, and inventory records.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Add Chemical
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
          <h3 className="font-semibold text-lg">Chemical Inventory List</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search chemicals..." className="bg-background border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-emerald-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Chemical Name</th>
                <th className="p-4 font-medium">Types of Chemical</th>
                <th className="p-4 font-medium">Chemical Inventory</th>
                <th className="p-4 font-medium">Chemical Use Area</th>
                <th className="p-4 font-medium">Monthly Incheck Report</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                    Loading inventory...
                  </td>
                </tr>
              ) : chemicals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No chemical inventory records found.
                  </td>
                </tr>
              ) : (
                chemicals.map((record: any) => (
                  <tr key={record._id}>
                    <td className="p-4 font-medium">{record.chemicalName}</td>
                    <td className="p-4">{record.chemicalType}</td>
                    <td className="p-4">{record.quantity}</td>
                    <td className="p-4">{record.useArea}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                        {record.incheckStatus || "Submitted"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setChemicalToDelete(record._id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Chemical"
        maxWidthClass="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input 
                type="date" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Name of chemical</label>
              <input 
                type="text" 
                placeholder="e.g., Reactive Blue 21" 
                required 
                value={chemName}
                onChange={(e) => setChemName(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Types of Chemical</label>
              <input 
                type="text" 
                placeholder="e.g., Dye, Auxiliary" 
                required
                value={chemType}
                onChange={(e) => setChemType(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Chemical Inventory</label>
              <input 
                type="text" 
                placeholder="e.g., 500 kg" 
                required
                value={chemQty}
                onChange={(e) => setChemQty(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Chemical Use Area</label>
              <input 
                type="text" 
                placeholder="e.g., Dyeing Floor" 
                required
                value={chemArea}
                onChange={(e) => setChemArea(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" 
              />
            </div>
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
              Add Chemical
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!chemicalToDelete}
        onClose={() => setChemicalToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Chemical"
        message={`Are you sure you want to remove ${selectedChemicalName} from the inventory? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
}
