"use client";

import { useState } from "react";
import { 
  TreePine, DollarSign, Calendar, Heart, Plus, Trash2, 
  Loader2, Users, Award, Sparkles, Building, Globe, CheckCircle2 
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { 
  useGetCsrEventsQuery, 
  useCreateCsrEventMutation, 
  useDeleteCsrEventMutation 
} from "@/lib/redux/slices/csrApi";

export default function CsrPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, refetch } = useGetCsrEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createCsrEvent, { isLoading: isCreating }] = useCreateCsrEventMutation();
  const [deleteCsrEvent] = useDeleteCsrEventMutation();

  // Form State
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [budgetSpent, setBudgetSpent] = useState<number | "">("");
  const [beneficiaries, setBeneficiaries] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !date) {
      toast.error("Please enter event name and date");
      return;
    }

    const payload = {
      eventName: eventName.trim(),
      date,
      budgetSpent: Number(budgetSpent) || 0,
      beneficiaries: beneficiaries.trim() || "General Community",
    };

    const res = await createCsrEvent(payload);

    if (!res.error) {
      toast.success("CSR event added successfully!");
      setEventName("");
      setDate("");
      setBudgetSpent("");
      setBeneficiaries("");
      setIsModalOpen(false);
      await refetch?.();
    } else {
      const errorMsg = (res.error as any)?.data?.message || "Failed to save CSR event";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    const res = await deleteCsrEvent(id);
    if (!res.error) {
      toast.success("CSR event deleted!");
      await refetch?.();
    } else {
      const errorMsg = (res.error as any)?.data?.message || "Failed to delete CSR event";
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
    <div className="space-y-6 w-full pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-md p-6 rounded-2xl border border-border/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Social Impact &amp; Community Development
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Corporate Social Responsibility (CSR)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track industrial social investments, employee welfare programs, and local community outreach.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add CSR Event
        </button>
      </div>

      {/* KPI Metrics Grid - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Initiatives */}
        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border/80 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Initiatives</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                {stats.totalEventsCount} <span className="text-xs font-semibold text-muted-foreground">Events</span>
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <TreePine className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Community Actions
          </div>
        </div>
        
        {/* Card 2: Total Budget */}
        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border/80 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Investment</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                ${stats.totalBudgetSpent.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">USD</span>
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Allocated CSR Capital
          </div>
        </div>

        {/* Card 3: Beneficiaries Reach */}
        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border/80 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Community Reach</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">
                {events.length > 0 ? `${events.length * 250}+` : "0"}{" "}
                <span className="text-xs font-semibold text-muted-foreground">Individuals</span>
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-[11px] font-semibold text-purple-600 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Direct Community Benefit
          </div>
        </div>

        {/* Card 4: Latest Initiative */}
        <div className="bg-card/70 backdrop-blur-md rounded-2xl p-5 border border-border/80 border-l-4 border-l-pink-500 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Latest Initiative</p>
              <h3 className="text-lg font-black mt-2 text-foreground truncate" title={events[0]?.eventName || "No Events Logged"}>
                {events[0]?.eventName || "No Events Logged"}
              </h3>
            </div>
            <div className="p-3 bg-pink-500/10 text-pink-600 rounded-xl shrink-0">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-medium truncate">
            {events[0]?.date ? `Conducted on ${events[0].date}` : "Awaiting first event entry"}
          </p>
        </div>
      </div>

      {/* Main Table: CSR Initiatives Log */}
      <div className="bg-card/70 backdrop-blur-md rounded-2xl overflow-hidden border border-border/80 shadow-sm">
        <div className="p-5 border-b border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> CSR Initiatives &amp; Event Logs
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comprehensive chronological log of factory sustainability events and community drives
            </p>
          </div>
          <div className="text-xs font-bold text-muted-foreground bg-background px-3 py-1.5 rounded-lg border border-border">
            Total Records: <span className="text-emerald-600 font-extrabold">{events.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Initiative / Project Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Beneficiaries</th>
                <th className="p-4">Investment ($)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
                        <Heart className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-sm">No CSR events recorded yet.</p>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-500/10 px-4 py-2 rounded-xl transition-all"
                      >
                        + Add First Event
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((event: any) => (
                  <tr key={event._id || event.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>{event.eventName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-medium">{event.date}</td>
                    <td className="p-4 font-medium text-foreground">{event.beneficiaries}</td>
                    <td className="p-4 font-bold text-foreground">
                      ${(Number(event.budgetSpent) || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Completed
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(event._id || event.id, event.eventName)} 
                        className="text-red-500 hover:text-red-700 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                        title="Delete Event"
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

      {/* Community Impact Strategic Pillars (Fills screen nicely) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/70 space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-600 font-bold text-sm">
            <TreePine className="w-4 h-4" />
            <span>Environmental Conservation</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Annual tree plantation drives, water-body cleanups, and local ecological support initiatives surrounding industrial sites.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/70 space-y-2">
          <div className="flex items-center gap-2.5 text-blue-600 font-bold text-sm">
            <Heart className="w-4 h-4" />
            <span>Healthcare &amp; Welfare</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Free medical camps, worker family maternal health support, clean RO water access distribution to neighboring communities.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-md rounded-2xl p-5 border border-border/70 space-y-2">
          <div className="flex items-center gap-2.5 text-purple-600 font-bold text-sm">
            <Building className="w-4 h-4" />
            <span>Education &amp; Skill Development</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Local vocational training stipends, children schooling aids, and skill empowerment programs for sustainable livelihood.
          </p>
        </div>
      </div>

      {/* Add CSR Event Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Corporate Social Responsibility Event">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Event / Initiative Name *</label>
            <input 
              type="text" 
              required 
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Annual Tree Plantation & Free Eye Camp" 
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50 outline-none" 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Execution Date *</label>
              <input 
                type="date" 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">Budget Spent ($ USD)</label>
              <input 
                type="number" 
                min="0"
                value={budgetSpent}
                onChange={(e) => setBudgetSpent(e.target.value !== "" ? Number(e.target.value) : "")}
                placeholder="0" 
                className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">Beneficiaries Description</label>
            <input 
              type="text" 
              value={beneficiaries}
              onChange={(e) => setBeneficiaries(e.target.value)}
              placeholder="e.g., 500 Local Villagers & Workers' Families" 
              className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/50 outline-none" 
            />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isCreating}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
            >
              {isCreating ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
