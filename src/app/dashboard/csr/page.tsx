"use client";

import { useState } from "react";
import { TreePine, DollarSign, Calendar, Heart, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { useGetCsrEventsQuery, useCreateCsrEventMutation, useDeleteCsrEventMutation } from "@/lib/redux/slices/csrApi";

export default function CsrPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useGetCsrEventsQuery();
  const [createCsrEvent] = useCreateCsrEventMutation();
  const [deleteCsrEvent] = useDeleteCsrEventMutation();

  // Form State
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [budgetSpent, setBudgetSpent] = useState<number | "">("");
  const [beneficiaries, setBeneficiaries] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !date) return;

    const payload = {
      eventName,
      date,
      budgetSpent: Number(budgetSpent) || 0,
      beneficiaries: beneficiaries || "General Public",
    };

    const res = await createCsrEvent(payload);
    setIsModalOpen(false);

    if (!res.error) {
      toast.success("CSR event added successfully!");
      setEventName(""); setDate(""); setBudgetSpent(""); setBeneficiaries("");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to save CSR event";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteCsrEvent(id);
    if (!res.error) {
      toast.success("CSR event deleted!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to delete CSR event";
      toast.error(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const events = data?.events || [];
  const stats = data?.stats || { totalEventsCount: 0, totalBudgetSpent: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Corporate Social Responsibility</h1>
          <p className="text-sm text-muted-foreground mt-1">Track community engagement and sustainability initiatives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Add CSR Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Initiatives</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalEventsCount} <span className="text-sm font-normal text-muted-foreground">Events</span></h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <TreePine className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Budget Spent</p>
              <h3 className="text-2xl font-bold mt-1">${stats.totalBudgetSpent.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">USD</span></h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-pink-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Latest Initiative</p>
              <h3 className="text-2xl font-bold mt-1 truncate max-w-[200px]" title={events[0]?.eventName || "None"}>
                {events[0]?.eventName || "None"}
              </h3>
            </div>
            <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-lg">CSR Initiatives Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Initiative Name</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Beneficiaries</th>
                <th className="p-4 font-medium">Budget Spent</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">No events found. Add a new CSR event.</td>
                </tr>
              ) : (
                events.map((event: any) => (
                  <tr key={event._id || event.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-medium">{event.eventName}</td>
                    <td className="p-4 text-muted-foreground">{event.date}</td>
                    <td className="p-4">{event.beneficiaries}</td>
                    <td className="p-4 font-medium">${(event.budgetSpent || 0).toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(event._id || event.id)} 
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add CSR Event">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Event Name</label>
            <input 
              type="text" 
              required 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Free Eye Checkup Camp" 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date</label>
              <input 
                type="date" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Budget ($)</label>
              <input 
                type="number" 
                value={budgetSpent}
                onChange={(e) => setBudgetSpent(e.target.value !== "" ? Number(e.target.value) : "")}
                placeholder="0" 
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Beneficiaries</label>
            <input 
              type="text" 
              value={beneficiaries}
              onChange={(e) => setBeneficiaries(e.target.value)}
              placeholder="e.g., 500 Local Villagers" 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Save Event</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
