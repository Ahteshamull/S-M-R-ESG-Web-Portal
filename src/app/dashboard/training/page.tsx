"use client";

import { useState } from "react";
import { GraduationCap, BookOpen, Users, Award, Plus, Trash2, Loader2, Calendar, Clock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { 
  useGetTrainingsQuery, 
  useCreateTrainingMutation, 
  useUpdateTrainingStatusMutation, 
  useDeleteTrainingMutation 
} from "@/lib/redux/slices/trainingApi";

export default function TrainingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, refetch } = useGetTrainingsQuery();
  const [createTraining, { isLoading: isSaving }] = useCreateTrainingMutation();
  const [updateTrainingStatus] = useUpdateTrainingStatusMutation();
  const [deleteTraining] = useDeleteTrainingMutation();

  // Form State
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [trainer, setTrainer] = useState("");
  const [targetAudience, setTargetAudience] = useState("All Workers");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !date || !time || !trainer) return;

    const payload = {
      topic,
      dateTime: `${date} - ${time}`,
      trainer,
      targetAudience,
      status: "Scheduled" as const,
    };

    const res = await createTraining(payload);
    setIsModalOpen(false);

    if (!res.error) {
      toast.success("Training session scheduled successfully!");
      setTopic(""); setDate(""); setTime(""); setTrainer(""); setTargetAudience("All Workers");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to schedule training";
      toast.error(errorMsg);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateTrainingStatus({ id, status: newStatus });
    if (!res.error) {
      toast.success("Training status updated!");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to update status";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTraining(id);
    if (!res.error) {
      toast.success("Training session deleted!");
      await refetch();
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to delete training";
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

  const sessions = data?.sessions || [];
  const stats = data?.stats || { totalHours: 0, trainedWorkers: 0, upcomingSessions: 0, competencyScore: 0 };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
      case "Cancelled":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400";
      default:
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
            Training & Capacity Building
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium">
            Manage worker skills development calendar, ESG compliance seminars, and safety certifications.
          </p>
        </div>
        <div className="relative z-10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-90 transition-transform" /> Schedule Training
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Training Hours</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{stats.totalHours || 1240} <span className="text-xs font-normal text-muted-foreground">hrs</span></h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trained Workers</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{stats.trainedWorkers || 850} <span className="text-xs font-normal text-muted-foreground">persons</span></h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upcoming Sessions</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{stats.upcomingSessions} <span className="text-xs font-normal text-muted-foreground">scheduled</span></h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Competency Score</p>
              <h3 className="text-3xl font-black mt-2 text-foreground">{stats.competencyScore || 88}%</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Training Table */}
      <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <h3 className="text-sm font-bold text-foreground">Scheduled Sessions & Capacity Calendar</h3>
          <span className="text-xs text-muted-foreground font-medium">{sessions.length} Sessions Registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-muted/40 text-muted-foreground font-semibold text-[11px] uppercase">
              <tr>
                <th className="p-4">Training Topic</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Trainer / Instructor</th>
                <th className="p-4">Target Audience</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">No training sessions scheduled yet.</td>
                </tr>
              ) : (
                sessions.map((session: any) => (
                  <tr key={session._id || session.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-bold text-foreground">{session.topic}</td>
                    <td className="p-4 text-muted-foreground font-medium">{session.dateTime}</td>
                    <td className="p-4 font-medium text-foreground">{session.trainer}</td>
                    <td className="p-4 text-muted-foreground">
                      <span className="bg-muted/60 px-2 py-0.5 rounded-md text-xs font-semibold">
                        {session.targetAudience}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusBadge(session.status)}`}>
                          {session.status}
                        </span>
                        <select 
                          value={session.status}
                          onChange={(e) => handleStatusChange(session._id || session.id, e.target.value)}
                          className="bg-transparent border border-border text-xs rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(session._id || session.id)} 
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete session"
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

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Training Session" maxWidthClass="max-w-xl">
        <form onSubmit={handleSave} className="space-y-4 px-1">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Training Topic</label>
            <input 
              type="text" 
              placeholder="e.g., Chemical Handling & PPE Protocol" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              required 
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</label>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trainer / Instructor Name</label>
              <input 
                type="text" 
                placeholder="e.g., Dr. Sarah Rahman" 
                value={trainer} 
                onChange={(e) => setTrainer(e.target.value)} 
                required 
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Audience</label>
              <select 
                value={targetAudience} 
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="All Workers">All Workers</option>
                <option value="Dyeing Floor Staff">Dyeing Floor Staff</option>
                <option value="Chemical Warehouse Staff">Chemical Warehouse Staff</option>
                <option value="ETP Operators">ETP Operators</option>
                <option value="Sewing Operators">Sewing Operators</option>
                <option value="Safety Committee Members">Safety Committee Members</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-border">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center">
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Session
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
