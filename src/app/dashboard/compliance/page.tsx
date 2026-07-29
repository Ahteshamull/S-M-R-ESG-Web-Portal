"use client";

import { useState } from "react";
import { Scale, FileWarning, CheckCircle2, ShieldAlert, Plus, Download, BarChart2, FileText, Users, AlertTriangle, CheckCircle, Clock, FileBadge, Calendar, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const capStatusData = [
  { name: 'Open', value: 12, color: '#ef4444' },
  { name: 'In Progress', value: 8, color: '#eab308' },
  { name: 'Closed', value: 45, color: '#10b981' },
];

const auditTrendsData = [
  { month: 'Jan', findings: 5 },
  { month: 'Feb', findings: 8 },
  { month: 'Mar', findings: 3 },
  { month: 'Apr', findings: 12 },
  { month: 'May', findings: 4 },
  { month: 'Jun', findings: 6 },
];

const CAP_LIST = [
  { id: 'CAP-001', issue: 'Secondary containment missing for chemical drum', type: 'Internal Audit', deadline: '2023-10-15', severity: 'High', status: 'Overdue' },
  { id: 'CAP-002', issue: 'Fire extinguisher access blocked in cutting section', type: 'Brand Audit', deadline: '2023-11-30', severity: 'Critical', status: 'In Progress' },
  { id: 'CAP-003', issue: 'Missing PPE in dyeing floor', type: 'Third-Party (Sedex)', deadline: '2023-12-15', severity: 'Medium', status: 'Open' },
  { id: 'CAP-004', issue: 'Worker training records incomplete', type: 'Internal Audit', deadline: '2023-09-10', severity: 'Low', status: 'Closed' },
];

const LEGAL_DOCS = [
  { id: 'DOC-001', name: 'Environmental Clearance Certificate (ECC)', authority: 'Department of Environment', issueDate: '2023-01-10', expiryDate: '2024-01-09', status: 'Expiring Soon' },
  { id: 'DOC-002', name: 'Fire Safety License', authority: 'Fire Service & Civil Defense', issueDate: '2023-05-20', expiryDate: '2023-11-20', status: 'Expired' },
  { id: 'DOC-003', name: 'Trade License', authority: 'City Corporation', issueDate: '2023-07-01', expiryDate: '2024-06-30', status: 'Valid' },
  { id: 'DOC-004', name: 'Boiler Operation Certificate', authority: 'Office of the Chief Inspector of Boilers', issueDate: '2023-02-15', expiryDate: '2024-02-14', status: 'Valid' },
];

const COMMITTEES = [
  { id: 'COM-001', name: 'Participation Committee (PC)', members: 15, lastMeeting: '2023-10-05', nextMeeting: '2023-11-05', status: 'Active' },
  { id: 'COM-002', name: 'Safety Committee', members: 12, lastMeeting: '2023-09-20', nextMeeting: '2023-10-20', status: 'Active' },
  { id: 'COM-003', name: 'Anti-Harassment Committee', members: 8, lastMeeting: '2023-08-15', nextMeeting: '2023-11-15', status: 'Active' },
];

type TabType = 'dashboard' | 'audits' | 'legal' | 'committees';

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddCommitteeModalOpen, setIsAddCommitteeModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    toast.success("Audit finding and CAP logged successfully!");
  };

  const handleAddDocSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddDocModalOpen(false);
    toast.success("Document uploaded and saved to repository!");
  };

  const handleAddCommitteeSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddCommitteeModalOpen(false);
    toast.success("New committee created and scheduled successfully!");
  };

  const handleDownloadReport = () => {
    toast.success("Generating Compliance Report (PDF)...");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Overdue':
      case 'Expired':
        return <span className="px-2.5 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded-full text-xs font-medium flex items-center w-fit"><AlertTriangle className="w-3 h-3 mr-1" /> {status}</span>;
      case 'In Progress':
      case 'Expiring Soon':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 rounded-full text-xs font-medium flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> {status}</span>;
      case 'Closed':
      case 'Valid':
      case 'Active':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full text-xs font-medium flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> {status}</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium w-fit">{status}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return <span className="text-red-600 dark:text-red-400 font-bold text-xs">CRITICAL</span>;
      case 'High': return <span className="text-orange-600 dark:text-orange-400 font-semibold text-xs">HIGH</span>;
      case 'Medium': return <span className="text-yellow-600 dark:text-yellow-400 font-medium text-xs">MEDIUM</span>;
      case 'Low': return <span className="text-blue-600 dark:text-blue-400 font-medium text-xs">LOW</span>;
      default: return <span>{severity}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance & Audits</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage CAPs, Legal Permits, and Committees seamlessly.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            className="bg-white dark:bg-zinc-900 border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" /> Report
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all flex items-center shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-1" /> Log Finding
          </button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-red-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><ShieldAlert className="w-4 h-4 mr-1.5 text-red-500" /> Open CAPs</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">12</h3>
              <p className="text-xs text-red-500 mt-2 font-medium">3 Overdue</p>
            </div>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-yellow-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><FileWarning className="w-4 h-4 mr-1.5 text-yellow-500" /> Expiring Permits</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">2</h3>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 font-medium">In next 30 days</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" /> Closed Findings</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">45</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2 font-medium">This year (78% completion)</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-500 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-1.5 text-blue-500" /> Active Committees</p>
              <h3 className="text-3xl font-bold mt-2 text-foreground">3</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">1 meeting pending this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border mb-4 no-scrollbar">
        {[
          { id: 'dashboard', label: 'Overview & Analytics', icon: BarChart2 },
          { id: 'audits', label: 'Audit & CAP', icon: Scale },
          { id: 'legal', label: 'Legal & Documents', icon: FileBadge },
          { id: 'committees', label: 'Committees', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-5 py-3 text-sm font-medium transition-colors relative whitespace-nowrap flex items-center",
              activeTab === tab.id 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 dark:bg-emerald-400 shadow-[0_-2px_10px_rgba(16,185,129,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in slide-in-from-bottom-2 duration-500">
        
        {/* TAB 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6 border border-border/50 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">CAP Status Distribution</h3>
              <div className="w-full h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={capStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {capStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-border/50 shadow-sm">
               <h3 className="text-lg font-semibold mb-6">Monthly Audit Findings</h3>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={auditTrendsData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                      cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
                    />
                    <Bar dataKey="findings" name="Findings Logged" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Audits & CAP */}
        {activeTab === 'audits' && (
          <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Corrective Action Plan (CAP) Tracker</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage and track resolutions for all internal and external audit findings.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">CAP ID</th>
                    <th className="p-4 font-medium">Issue / Finding</th>
                    <th className="p-4 font-medium">Audit Type</th>
                    <th className="p-4 font-medium">Severity</th>
                    <th className="p-4 font-medium">Deadline</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {CAP_LIST.map((cap) => (
                    <tr key={cap.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-muted-foreground">{cap.id}</td>
                      <td className="p-4 font-medium text-foreground max-w-xs truncate" title={cap.issue}>{cap.issue}</td>
                      <td className="p-4 text-muted-foreground">{cap.type}</td>
                      <td className="p-4">{getSeverityBadge(cap.severity)}</td>
                      <td className={cn("p-4 font-medium", cap.status === 'Overdue' ? "text-red-500" : "text-foreground")}>{cap.deadline}</td>
                      <td className="p-4 flex justify-end">{getStatusBadge(cap.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Legal & Documents */}
        {activeTab === 'legal' && (
          <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Legal Permits & Certificates</h3>
                <p className="text-sm text-muted-foreground mt-1">Track validity and renewal dates for all mandatory licenses.</p>
              </div>
              <button onClick={() => setIsAddDocModalOpen(true)} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Document
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Document Name</th>
                    <th className="p-4 font-medium">Authority</th>
                    <th className="p-4 font-medium">Issue Date</th>
                    <th className="p-4 font-medium">Expiry Date</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {LEGAL_DOCS.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground flex items-center">
                        <FileText className="w-4 h-4 text-muted-foreground mr-2" /> {doc.name}
                      </td>
                      <td className="p-4 text-muted-foreground">{doc.authority}</td>
                      <td className="p-4 text-muted-foreground">{doc.issueDate}</td>
                      <td className="p-4 font-medium">{doc.expiryDate}</td>
                      <td className="p-4 flex justify-end">{getStatusBadge(doc.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Committees */}
        {activeTab === 'committees' && (
          <div className="glass-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 bg-muted/10 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Committee Management</h3>
                <p className="text-sm text-muted-foreground mt-1">Track worker participation and regulatory compliance committees.</p>
              </div>
              <button onClick={() => setIsAddCommitteeModalOpen(true)} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline flex items-center">
                <Plus className="w-4 h-4 mr-1" /> New Committee
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-muted-foreground">
                  <tr>
                    <th className="p-4 font-medium">Committee Name</th>
                    <th className="p-4 font-medium">Total Members</th>
                    <th className="p-4 font-medium">Last Meeting</th>
                    <th className="p-4 font-medium">Next Scheduled Meeting</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {COMMITTEES.map((com) => (
                    <tr key={com.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground">{com.name}</td>
                      <td className="p-4 text-muted-foreground flex items-center">
                        <Users className="w-4 h-4 mr-1.5 opacity-70" /> {com.members}
                      </td>
                      <td className="p-4 text-muted-foreground">{com.lastMeeting}</td>
                      <td className="p-4 font-medium flex items-center text-emerald-600 dark:text-emerald-500">
                        <Calendar className="w-4 h-4 mr-1.5" /> {com.nextMeeting}
                      </td>
                      <td className="p-4 flex justify-end">{getStatusBadge(com.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 1. Log Finding Modal (CAP) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Audit Finding (CAP)" maxWidthClass="max-w-2xl">
        <form onSubmit={handleSave} className="space-y-5 px-1 pb-2 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Issue Description / Finding</label>
            <textarea 
              required 
              placeholder="Detailed description of the non-compliance..." 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all h-24 resize-none" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Audit Type</label>
              <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all appearance-none">
                <option>Internal Audit</option>
                <option>Third-Party Audit (e.g., Sedex, BSCI)</option>
                <option>Brand Audit (e.g., H&M, Zara)</option>
                <option>Regulatory Inspection</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Severity</label>
              <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all appearance-none">
                <option>Critical (Zero Tolerance)</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low (Observation)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Resolution Deadline</label>
              <input 
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Assignee (Responsible Person)</label>
              <input 
                type="text" 
                placeholder="e.g., HR Manager" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              Save Finding
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Add Legal Document Modal */}
      <Modal isOpen={isAddDocModalOpen} onClose={() => setIsAddDocModalOpen(false)} title="Upload Legal Document" maxWidthClass="max-w-2xl">
        <form onSubmit={handleAddDocSave} className="space-y-5 px-1 pb-2 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Document / Permit Name</label>
              <input 
                type="text" 
                placeholder="e.g., Environmental Clearance" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Issuing Authority</label>
              <input 
                type="text" 
                placeholder="e.g., Department of Environment" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Issue Date</label>
              <input 
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Expiry Date</label>
              <input 
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Upload Document (PDF, JPG)</label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer bg-background">
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max. 10MB)</p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
            <button type="button" onClick={() => setIsAddDocModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center">
              <UploadCloud className="w-4 h-4 mr-2" /> Upload & Save
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. New Committee Modal */}
      <Modal isOpen={isAddCommitteeModalOpen} onClose={() => setIsAddCommitteeModalOpen(false)} title="Create New Committee" maxWidthClass="max-w-md">
        <form onSubmit={handleAddCommitteeSave} className="space-y-5 px-1 pb-2 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Committee Name</label>
            <input 
              type="text" 
              placeholder="e.g., Safety & Health Committee" 
              required 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Total Members</label>
            <input 
              type="number" 
              placeholder="e.g., 12" 
              required
              min="1"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Formation / Last Meeting Date</label>
            <input 
              type="date" 
              required 
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Next Scheduled Meeting</label>
            <div className="relative">
              <input 
                type="date" 
                required 
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm transition-all" 
              />
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 pointer-events-none" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-8">
            <button type="button" onClick={() => setIsAddCommitteeModalOpen(false)} className="px-5 py-2.5 bg-transparent hover:bg-muted text-foreground rounded-xl text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
              Create Committee
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
