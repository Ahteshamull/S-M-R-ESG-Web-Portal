"use client";

import { 
  ArrowDownRight, ArrowUpRight, Cloud, Droplets, 
  Zap, AlertTriangle, CheckCircle2, FileText, Loader2 
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useGetDashboardSummaryQuery } from "@/lib/redux/slices/dashboardApi";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardOverview() {
  const router = useRouter();
  const { data: summary, isLoading } = useGetDashboardSummaryQuery();

  const handleDownload = () => {
    const headers = ["ESG Metric", "Value", "Unit"];
    const rows = [
      ["Total Electricity Consumption", kpis.totalEnergy, "MWh"],
      ["Total Water Withdrawal", kpis.totalWater, "m3"],
      ["Total Carbon Emissions", kpis.totalCarbon, "tCO2e"],
      ["Compliance Score", `${kpis.complianceScore}%`, "%"],
      ["Report Date", new Date().toLocaleDateString(), "Date"],
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Factory_ESG_Overview_Report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Factory ESG Overview Report downloaded!");
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const kpis = summary?.kpis || { totalEnergy: 0, totalWater: 0, totalCarbon: 0, complianceScore: 0 };
  const esgTrendsData = summary?.trends || [];
  const alerts = summary?.alerts || [];

  const comparisons = (esgTrendsData.length >= 2) ? (() => {
    const prev = esgTrendsData[esgTrendsData.length - 2];
    const curr = esgTrendsData[esgTrendsData.length - 1];
    const calcChange = (currVal: number, prevVal: number) => {
      if (prevVal === 0) return currVal > 0 ? 100 : 0;
      return Number((((currVal - prevVal) / prevVal) * 100).toFixed(1));
    };
    return {
      energyDiff: calcChange(curr.energy || 0, prev.energy || 0),
      waterDiff: calcChange(curr.water || 0, prev.water || 0),
      carbonDiff: calcChange(curr.carbon || 0, prev.carbon || 0),
    };
  })() : { energyDiff: null, waterDiff: null, carbonDiff: null };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ESG Performance Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time overview of your sustainability metrics and compliance status.</p>
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
              <h3 className="text-2xl font-bold mt-1">{kpis.totalEnergy} <span className="text-sm font-normal text-muted-foreground">MWh</span></h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {comparisons.energyDiff !== null ? (
              <>
                <span className={cn("flex items-center font-medium", comparisons.energyDiff <= 0 ? "text-green-600" : "text-amber-600")}>
                  {comparisons.energyDiff <= 0 ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
                  {Math.abs(comparisons.energyDiff)}%
                </span>
                <span className="text-muted-foreground ml-2">vs prev logged month</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Logged electricity usage</span>
            )}
          </div>
        </div>

        {/* Water KPI */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Water Usage</p>
              <h3 className="text-2xl font-bold mt-1">{kpis.totalWater.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">m³</span></h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {comparisons.waterDiff !== null ? (
              <>
                <span className={cn("flex items-center font-medium", comparisons.waterDiff <= 0 ? "text-green-600" : "text-amber-600")}>
                  {comparisons.waterDiff <= 0 ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
                  {Math.abs(comparisons.waterDiff)}%
                </span>
                <span className="text-muted-foreground ml-2">vs prev logged month</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Logged withdrawal</span>
            )}
          </div>
        </div>

        {/* Carbon KPI */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-gray-400">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Carbon (Scope 1+2)</p>
              <h3 className="text-2xl font-bold mt-1">{kpis.totalCarbon} <span className="text-sm font-normal text-muted-foreground">tCO2e</span></h3>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
              <Cloud className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            {comparisons.carbonDiff !== null ? (
              <>
                <span className={cn("flex items-center font-medium", comparisons.carbonDiff <= 0 ? "text-green-600" : "text-amber-600")}>
                  {comparisons.carbonDiff <= 0 ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
                  {Math.abs(comparisons.carbonDiff)}%
                </span>
                <span className="text-muted-foreground ml-2">vs prev logged month</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">Logged GHG emissions</span>
            )}
          </div>
        </div>

        {/* Compliance KPI */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
              <h3 className="text-2xl font-bold mt-1">{kpis.complianceScore}<span className="text-sm font-normal text-muted-foreground">/100</span></h3>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={cn("flex items-center font-medium", kpis.complianceScore >= 80 ? "text-green-600" : "text-amber-600")}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {kpis.complianceScore >= 80 ? "Audit Ready" : "Requires Action"}
            </span>
            <span className="text-muted-foreground ml-2">Live score</span>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Monthly ESG Trends</h3>
            <select className="bg-muted border-none text-sm rounded-md py-1 px-2">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={esgTrendsData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="carbon" name="Carbon (tCO2e)" stroke="#9ca3af" strokeWidth={2} fillOpacity={1} fill="url(#colorCarbon)" />
                <Area type="monotone" dataKey="water" name="Water (kL)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorWater)" />
                <Area type="monotone" dataKey="energy" name="Energy (MWh)" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Active Alerts</h3>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="flex gap-3 p-3 bg-muted/30 text-muted-foreground rounded-lg border border-border/50 justify-center">
                  <p className="text-sm font-medium">No active alerts</p>
                </div>
              ) : (
                alerts.map((alert: any) => (
                  <div 
                    key={alert.id} 
                    className={cn(
                      "flex gap-3 p-3 rounded-lg border",
                      alert.type === 'critical' 
                        ? "bg-red-50 text-red-900 border-red-100 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/50" 
                        : "bg-yellow-50 text-yellow-900 border-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-300 dark:border-yellow-900/50"
                    )}
                  >
                    <AlertTriangle className={cn("w-5 h-5 flex-shrink-0", alert.type === 'critical' ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400")} />
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs opacity-80 mt-0.5">{alert.description}</p>
                    </div>
                  </div>
                ))
              )}
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
