"use client";

import { useState } from "react";
import { GraduationCap, BookOpen, Users, Award, Plus, Trash2, Loader2 } from "lucide-react";
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
  const { data, isLoading } = useGetTrainingsQuery();
  const [createTraining] = useCreateTrainingMutation();
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
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to schedule training";
      toast.error(errorMsg);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateTrainingStatus({ id, status: newStatus });
    if (!res.error) {
      toast.success("Training status updated!");
    } else {
      const errorMsg = (res.error as any).data?.message || "Failed to update status";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteTraining(id);
    if (!res.error) {
      toast.success("Training session deleted!");
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training & Capacity Building</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage training calendar, attendance, and worker competency.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> Schedule Training
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <h3 className="text-xl font-bold">{stats.totalHours || 1240}</h3>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BookOpen className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trained Workers</p>
              <h3 className="text-xl font-bold">{stats.trainedWorkers || 850}</h3>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
              <h3 className="text-xl font-bold">{stats.upcomingSessions}</h3>
            </div>
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><GraduationCap className="w-5 h-5" /></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Competency Score</p>
              <h3 className="text-xl font-bold">{stats.competencyScore || 88}%</h3>
            </div>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Award className="w-5 h-5" /></div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border mt-6">
        <div className="p-4 border-b border-border bg-muted/20">
          <h3 className="font-semibold text-lg">Upcoming Training Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Topic</th>
                <th className="p-4 font-medium">Date & Time</th>
                <th className="p-4 font-medium">Trainer</th>
                <th className="p-4 font-medium">Target Audience</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">No sessions scheduled yet.</td>
                </tr>
              ) : (
                sessions.map((session: any) => (
                  <tr key={session._id || session.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-medium">{session.topic}</td>
                    <td className="p-4 text-muted-foreground">{session.dateTime}</td>
                    <td className="p-4">{session.trainer}</td>
                    <td className="p-4 text-muted-foreground">{session.targetAudience}</td>
                    <td className="p-4">
                      <select 
                        value={session.status}
                        onChange={(e) => handleStatusChange(session._id || session.id, e.target.value)}
                        className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer font-semibold outline-none"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(session._id || session.id)} 
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Training">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Training Topic</label>
            <input 
              type="text" 
              required 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Fire Safety Training" 
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
              <label className="text-sm font-medium">Time</label>
              <input 
                type="time" 
                required 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Trainer Name</label>
            <input 
              type="text" 
              required 
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
              placeholder="Internal or External Trainer" 
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Target Participants</label>
            <select 
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            >
              <option>All Workers</option>
              <option>Supervisors & Management</option>
              <option>Dyeing / Chemical Handlers</option>
              <option>Security & Maintenance</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Schedule</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
