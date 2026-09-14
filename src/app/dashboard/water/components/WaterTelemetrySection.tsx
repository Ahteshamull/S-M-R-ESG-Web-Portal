"use client";

import React from "react";
import { Layers, AlertTriangle, X } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface WaterTelemetrySectionProps {
  activeTelemetry: any;
  selectedProcessType: string;
  setSelectedProcessType: (val: string) => void;
  isTelemetryLoading: boolean;
  isAlertDismissed: boolean;
  setIsAlertDismissed: (val: boolean) => void;
  hasComparisonChart: boolean;
  activeComparisonData: any[];
  capacityUsagePercent: number;
  displayTotalLiters: string;
}

export const WaterTelemetrySection: React.FC<WaterTelemetrySectionProps> = ({
  activeTelemetry,
  selectedProcessType,
  setSelectedProcessType,
  isTelemetryLoading,
  isAlertDismissed,
  setIsAlertDismissed,
  hasComparisonChart,
  activeComparisonData,
  capacityUsagePercent,
  displayTotalLiters,
}) => {
  return (
    <div className="bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-border/50 shadow-sm space-y-6">
      {/* Section Header with Multi-Dropdown Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-bold">{activeTelemetry.title}</h3>
              {isTelemetryLoading && (
                <span className="text-[10px] bg-teal-500/10 text-teal-600 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  Syncing...
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{activeTelemetry.subtitle}</p>
          </div>
        </div>

        {/* Top Interactive Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-background border border-border/80 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
            <span className="text-muted-foreground">Water Use Area:</span>
            <select
              value={selectedProcessType}
              onChange={(e) => setSelectedProcessType(e.target.value)}
              className="bg-transparent font-bold text-teal-600 focus:outline-none cursor-pointer"
              style={{ colorScheme: "dark" }}
            >
              <option value="All Departments" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All (Consolidated)</option>
              <option value="Dyeing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Dyeing</option>
              <option value="Washing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Washing</option>
              <option value="Printing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Printing</option>
              <option value="Garments (Cut to Pack)" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Garments (Cut to Pack)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-background border border-border/80 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
            <span className="text-muted-foreground">Active Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Online
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Alert Banner */}
      {!isAlertDismissed && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 dark:text-amber-200 animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              {activeTelemetry.alertMessage || (
                selectedProcessType === "Dyeing" || selectedProcessType === "All Departments"
                  ? "ALERT: HIGH CONSUMPTION IN DYEING BATCH 102! Exceeded 1:7 liquor ratio benchmark (+18% excess usage detected)"
                  : selectedProcessType === "Washing"
                  ? "WARNING: Washing Line 02 Running Rinse Cycle with Elevated Flow (+12% above standard)"
                  : selectedProcessType === "Printing"
                  ? "NOTICE: Screen Printing Sub-meter #3 under regular scheduled sensor calibration"
                  : selectedProcessType === "Utility"
                  ? "ALERT: Boiler Steam Generation High Make-up Water Flow Detected — Check condensate return"
                  : `ALERT: Active IoT monitoring & flow telemetry enabled for ${selectedProcessType} Department.`
              )}
            </span>
          </div>
          <button
            onClick={() => setIsAlertDismissed(true)}
            className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dynamic Grid: Adapts to 2 or 3 Columns */}
      <div className={`grid grid-cols-1 ${hasComparisonChart ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6 items-start`}>
        {/* Column 1: DASHBOARD SUMMARY & MONTHLY TREND */}
        <div className="bg-background/80 rounded-2xl border border-border/70 p-5 space-y-6 shadow-sm">
          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">DASHBOARD SUMMARY</h4>
            
            {/* Total Usage Gauge Card */}
            <div className="bg-muted/20 rounded-xl p-4 border border-border/40 text-center space-y-3">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
                {selectedProcessType === "All Departments" ? "TOTAL USAGE TODAY" : `${selectedProcessType.toUpperCase()} CONSUMPTION`}
              </span>
              
              {/* Semi-circular Radial Gauge Meter */}
              <div className="relative flex flex-col items-center justify-center pt-2">
                <svg className="w-56 h-28 overflow-visible" viewBox="0 0 200 100">
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="currentColor"
                    className="text-muted/20"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 * (1 - (activeTelemetry.capacityPercent ?? capacityUsagePercent) / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                  <line
                    x1="100"
                    y1="100"
                    x2={100 + 62 * Math.cos(Math.PI * (1 - (activeTelemetry.capacityPercent ?? capacityUsagePercent) / 100))}
                    y2={100 - 62 * Math.sin(Math.PI * (1 - (activeTelemetry.capacityPercent ?? capacityUsagePercent) / 100))}
                    stroke="#1e293b"
                    className="dark:stroke-white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="100" r="5.5" className="fill-slate-900 dark:fill-white" />
                </svg>
                
                <div className="text-center mt-3">
                  <div className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                    {activeTelemetry.totalUsageLiters ? activeTelemetry.totalUsageLiters.toLocaleString() : displayTotalLiters} Liters
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground mt-0.5">
                    ({activeTelemetry.capacityPercent ?? capacityUsagePercent}% of capacity)
                  </div>
                </div>
              </div>

              {/* Department Breakdown Pill Badges */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/40 text-[11px] font-bold">
                {activeTelemetry.breakdownTags && activeTelemetry.breakdownTags.length > 0 ? (
                  activeTelemetry.breakdownTags.map((tag: any, idx: number) => {
                    const name = tag.name || tag.label?.split("(")[0]?.trim() || tag.label || "Process";
                    const pct = tag.percentage ?? tag.percent ?? 0;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/40 text-foreground ${
                          activeTelemetry.breakdownTags.length % 2 !== 0 && idx === activeTelemetry.breakdownTags.length - 1 ? "col-span-2 justify-center" : ""
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tag.color || "#0ea5e9" }} />
                        <span className="truncate">{name} ({pct}%)</span>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span>Dyeing (0%)</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>Washing (0%)</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sub-card 2: MONTHLY TREND */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">MONTHLY TREND</h4>
              <span className="text-[11px] font-semibold text-muted-foreground">Days 1 - 30</span>
            </div>
            <div className="w-full h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeTelemetry.trendData || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} opacity={0.2} />
                  <XAxis dataKey="day" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '11px' }}
                    itemStyle={{ color: '#1f2937', fontWeight: 700 }}
                    formatter={(val: any) => [`${val} m³`, "Consumption"]}
                  />
                  <Bar dataKey="value" fill="#0284c7" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 2: COMPARISON BENCHMARKS (Conditional) */}
        {hasComparisonChart && (
          <div className="bg-background/80 rounded-2xl border border-border/70 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-foreground uppercase tracking-wider">
                  {activeTelemetry.comparisonTitle}
                </h4>
                <p className="text-[11px] text-muted-foreground">{activeTelemetry.comparisonSubtitle}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-blue-600 rounded-sm" />
                  <span className="text-muted-foreground">ACTUAL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-emerald-400 rounded-sm" />
                  <span className="text-muted-foreground">TARGET</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={activeComparisonData}
                  margin={{ top: 10, right: 20, left: 15, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                  <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={95} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#1f2937', fontWeight: 700 }}
                    formatter={(value: any, name: any, item: any) => [`${value} ${item?.payload?.unit || 'L/kg'}`, name]}
                  />
                  <Bar dataKey="actual" fill="#2563eb" name="ACTUAL" barSize={11} radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" fill="#4ade80" name="TARGET" barSize={11} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Column 3: EFFLUENT / PROCESS BALANCE & LIVE SENSOR READINGS */}
        <div className="space-y-6">
          <div className="bg-background/80 rounded-2xl border border-border/70 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {activeTelemetry.effluentTitle}
                </h4>
                <span className="text-xs font-black text-foreground">INFLOW vs. TREATED / RECOVERED</span>
              </div>
              <div className="px-2.5 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-extrabold text-xs rounded-xl shadow-sm">
                {activeTelemetry.effluentBadge}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                <span className="text-muted-foreground">INFLOW / LOAD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span className="text-muted-foreground">TREATED / RECOVERED</span>
              </div>
            </div>

            <div className="w-full h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeTelemetry.effluentData || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '11px' }}
                    itemStyle={{ color: '#1f2937', fontWeight: 700 }}
                  />
                  <Bar dataKey="inflow" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="treated" fill="#22c55e" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Sensor Readings Table */}
          <div className="bg-background/80 rounded-2xl border border-border/70 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <span>{activeTelemetry.sensorTitle}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </h4>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                Area: {selectedProcessType}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground text-[10px] uppercase font-bold">
                    <th className="py-1.5 px-2">MACHINE / METER</th>
                    <th className="py-1.5 px-2">FLOW (L/m)</th>
                    <th className="py-1.5 px-2">TEMP</th>
                    <th className="py-1.5 px-2">PH / TDS</th>
                    <th className="py-1.5 px-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {activeTelemetry.sensorReadings?.map((sensor: any) => (
                    <tr key={sensor.id} className="hover:bg-muted/30 transition-colors font-semibold">
                      <td className="py-2 px-2 font-bold text-foreground truncate max-w-[100px]">{sensor.id}</td>
                      <td className="py-2 px-2 text-foreground">{sensor.flow.toFixed(1)}</td>
                      <td className="py-2 px-2">
                        <span className={sensor.isWarningTemp ? "bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded shadow-sm" : "text-foreground"}>
                          {sensor.temp.toFixed(1)}°
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className={sensor.isWarningPh ? "bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded shadow-sm" : "text-foreground"}>
                          {sensor.ph.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        {sensor.status ? (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                            sensor.status === "OPTIMAL" || sensor.status === "PASS"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : sensor.status === "EXCESS" || sensor.status === "WARNING"
                              ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          }`}>
                            {sensor.status}
                          </span>
                        ) : sensor.extraMetric ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/15 text-blue-700 dark:text-blue-300">
                            {sensor.extraMetric}
                          </span>
                        ) : (
                          <span className="text-muted-foreground truncate max-w-[85px]">{sensor.operator}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Highlight Cards */}
      {activeTelemetry.extraCards && activeTelemetry.extraCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {activeTelemetry.extraCards.map((card: any, idx: number) => (
            <div key={idx} className="bg-background/80 rounded-2xl border border-border/70 p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase">{card.title}</p>
                <p className="text-xl font-extrabold text-foreground mt-0.5">{card.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{card.subtitle || card.sub}</p>
              </div>
              {card.badge && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  {card.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
