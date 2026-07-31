"use client";

import Link from "next/link";
import { Trash2, Recycle, ClipboardList, PackageSearch, Factory, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'General Waste', value: 4200 },
  { name: 'Recycled Waste', value: 2800 },
  { name: 'Hazardous Waste', value: 120 },
];
const COLORS = ['#10b981', '#3b82f6', '#f43f5e'];

export default function WasteDashboardHub() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">Waste Management</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">Track waste reports, inventory, and recycled materials.</p>
        </div>
      </div>

      {/* Hub Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tracking Report */}
        <Link href="/dashboard/waste/tracking" className="group block relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <ClipboardList className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Waste Tracking</h3>
            <p className="text-sm text-muted-foreground mb-6">Manage tracking records, gate passes, manifests, and agreements.</p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Open Tracking <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* Inventory */}
        <Link href="/dashboard/waste/inventory" className="group block relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <PackageSearch className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Waste Inventory</h3>
            <p className="text-sm text-muted-foreground mb-6">Keep track of currently stored waste in the facility by category.</p>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Open Inventory <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* Recycle Waste */}
        <Link href="/dashboard/waste/recycle" className="group block relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 cursor-pointer">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
              <Recycle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Recycled Waste</h3>
            <p className="text-sm text-muted-foreground mb-6">Log and monitor recycled materials, vendors, and revenue/cost.</p>
            <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Open Recycle <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>
      </div>

      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Factory className="w-5 h-5 text-emerald-600" /> Waste Generation Distribution
          </h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                  formatter={(value) => `${value} kg`}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm flex flex-col justify-center">
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-emerald-500/5 to-transparent rounded-xl border border-emerald-500/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-emerald-700/70 dark:text-emerald-400/70 mb-1 uppercase tracking-wider">Total General Waste (YTD)</p>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">4.2 <span className="text-sm font-medium">Tons</span></p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
                  <Trash2 className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500/5 to-transparent rounded-xl border border-blue-500/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-blue-700/70 dark:text-blue-400/70 mb-1 uppercase tracking-wider">Total Recycled (YTD)</p>
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-400">2.8 <span className="text-sm font-medium">Tons</span></p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
                  <Recycle className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-rose-500/5 to-transparent rounded-xl border border-rose-500/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-rose-700/70 dark:text-rose-400/70 mb-1 uppercase tracking-wider">Total Hazardous (YTD)</p>
                  <p className="text-2xl font-black text-rose-700 dark:text-rose-400">120 <span className="text-sm font-medium">kg</span></p>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-600">
                  <Factory className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
