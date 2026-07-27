"use client";

import { 
  ArrowDownRight, ArrowUpRight, Cloud, Droplets, 
  Zap, AlertTriangle, CheckCircle2, FileText 
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DashboardOverview() {
  const router = useRouter();

  const handleDownload = () => {
    toast.success("Generating ESG Report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Here&apos;s your factory&apos;s ESG performance at a glance.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownload}
            className="bg-emerald-50 border-emerald-200 text-emerald-800 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            Download Report
          </button>
          <button 
            onClick={() => router.push('/dashboard/reports')}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center"
          >
            <FileText className="w-4 h-4 mr-1" /> View All Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Energy KPI */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-yellow-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Energy</p>
              <h3 className="text-2xl font-bold mt-1">45.2 <span className="text-sm font-normal text-muted-foreground">MWh</span></h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              12.5%
            </span>
            <span className="text-muted-foreground ml-2">vs last month</span>
          </div>
        </div>

        {/* Water KPI */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Water Usage</p>
              <h3 className="text-2xl font-bold mt-1">12,450 <span className="text-sm font-normal text-muted-foreground">Liters</span></h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-red-600 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              4.2%
            </span>
            <span className="text-muted-foreground ml-2">vs last month</span>
          </div>
        </div>

        {/* Carbon KPI */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-gray-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Carbon (Scope 1+2)</p>
              <h3 className="text-2xl font-bold mt-1">840 <span className="text-sm font-normal text-muted-foreground">tCO2e</span></h3>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <Cloud className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              8.1%
            </span>
            <span className="text-muted-foreground ml-2">vs last month</span>
          </div>
        </div>

        {/* Compliance KPI */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
              <h3 className="text-2xl font-bold mt-1">94<span className="text-sm font-normal text-muted-foreground">/100</span></h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              2.0 pts
            </span>
            <span className="text-muted-foreground ml-2">vs last month</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Monthly ESG Trends</h3>
            <select className="bg-muted border-none text-sm rounded-md py-1 px-2">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72 w-full flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/20">
            {/* Recharts goes here - Placeholder for now */}
            <p className="text-muted-foreground text-sm font-medium">Chart visualization (Recharts) will render here</p>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Active Alerts</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-red-50 text-red-900 rounded-lg border border-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Water usage spike</p>
                  <p className="text-xs opacity-80 mt-0.5">Dyeing unit 3 exceeded daily limit by 15%</p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-yellow-50 text-yellow-900 rounded-lg border border-yellow-100">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Permit expiring soon</p>
                  <p className="text-xs opacity-80 mt-0.5">Fire safety license expires in 12 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/dashboard/energy')}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-medium border border-transparent"
              >
                + Log Daily Energy
              </button>
              <button 
                onClick={() => router.push('/dashboard/chemicals')}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-medium border border-transparent"
              >
                + Upload SDS
              </button>
              <button 
                onClick={() => router.push('/dashboard/training')}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors font-medium border border-transparent"
              >
                + Record Training
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
