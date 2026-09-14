"use client";

import React from "react";
import { Droplets, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { SOURCING_COLORS } from "../types";

interface WaterSourcingSectionProps {
  sourcingPieData: Array<{ name: string; value: number }>;
  monthlyChartData: Array<{
    name: string;
    Groundwater: number;
    Municipal: number;
    Rainwater: number;
    Recycled: number;
    Total: number;
  }>;
  totalWithdrawal: number;
}

export const WaterSourcingSection: React.FC<WaterSourcingSectionProps> = ({
  sourcingPieData,
  monthlyChartData,
  totalWithdrawal,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Donut Chart: 5 Water Sources */}
      <div className="bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-border/50 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-teal-500/10 text-teal-600 rounded-xl">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold">3. Water Sourcing &amp; Withdrawal</h3>
                <p className="text-xs text-muted-foreground">Groundwater vs Sustainable Sources</p>
              </div>
            </div>
          </div>

          <div className="h-[230px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcingPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sourcingPieData.map((_, index) => (
                    <Cell key={`source-cell-${index}`} fill={SOURCING_COLORS[index % SOURCING_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} m³`, "Volume"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Total m³</span>
              <span className="text-lg font-extrabold text-foreground">{totalWithdrawal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Source breakdown legend & metrics */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border/40 text-xs font-semibold">
          {sourcingPieData.map((s, idx) => (
            <div key={s.name} className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SOURCING_COLORS[idx] }} />
                <span className="text-muted-foreground truncate max-w-[90px]">{s.name}</span>
              </div>
              <span className="font-bold text-foreground">{s.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stacked Bar Chart: Monthly Water Sourcing Trend */}
      <div className="lg:col-span-2 bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-border/50 shadow-sm relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold">Monthly Sourcing Trends</h3>
              <p className="text-xs text-muted-foreground">Monthly withdrawal composition across active sources</p>
            </div>
          </div>
        </div>

        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1f2937', fontWeight: 600 }}
              />
              <Legend verticalAlign="top" height={32} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
              <Bar dataKey="Groundwater" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Municipal" stackId="a" fill="#0ea5e9" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Rainwater" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Recycled" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
