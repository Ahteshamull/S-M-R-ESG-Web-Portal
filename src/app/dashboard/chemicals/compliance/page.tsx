"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, FlaskConical, ShieldCheck, Download, Calendar, 
  RotateCcw, PackageSearch, AlertCircle, ExternalLink, Award
} from "lucide-react";
import { useGetChemicalsQuery, IChemicalItem } from "@/lib/redux/slices/chemicalsApi";

interface DonutSegment {
  name: string;
  value: number;
  color: string;
}

function ConcentricDonutChart({
  totalCount,
  innerValue,
  innerColor = "#6366f1",
  outerSegments,
  size = 230,
}: {
  totalCount: number;
  innerValue: number;
  innerColor?: string;
  outerSegments: DonutSegment[];
  size?: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const center = size / 2;
  
  // Inner ring: radius 54, stroke 14
  const innerR = 54;
  const innerStroke = 14;
  const innerCircumference = 2 * Math.PI * innerR;
  const innerFraction = totalCount > 0 ? Math.min(1, innerValue / totalCount) : 0;
  const innerDash = innerFraction * innerCircumference;

  // Outer ring: radius 73, stroke 16
  const outerR = 73;
  const outerStroke = 16;
  const outerCircumference = 2 * Math.PI * outerR;

  // Calculate segment offsets for outer ring
  let currentOffset = 0;
  const validSegments = outerSegments.filter((s) => s.value > 0);
  const totalOuter = validSegments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex flex-col items-center justify-center relative select-none w-full max-w-[240px] mx-auto">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 overflow-visible">
        {/* Inner Ring Background Track */}
        <circle
          cx={center}
          cy={center}
          r={innerR}
          fill="none"
          stroke="currentColor"
          className="text-muted/30"
          strokeWidth={innerStroke}
        />
        {/* Inner Ring Conformant Value */}
        {totalCount > 0 && innerDash > 0 && (
          <circle
            cx={center}
            cy={center}
            r={innerR}
            fill="none"
            stroke={innerColor}
            strokeWidth={innerStroke}
            strokeDasharray={`${innerDash} ${innerCircumference}`}
            strokeDashoffset={0}
            className="transition-all duration-500 ease-out"
          />
        )}

        {/* Outer Ring Background Track */}
        <circle
          cx={center}
          cy={center}
          r={outerR}
          fill="none"
          stroke="currentColor"
          className="text-muted/20"
          strokeWidth={outerStroke}
        />

        {/* Outer Ring Segments */}
        {totalOuter > 0 ? (
          validSegments.map((segment) => {
            const fraction = segment.value / (totalCount || totalOuter);
            const dash = fraction * outerCircumference;
            const offset = -currentOffset;
            currentOffset += dash;

            return (
              <circle
                key={segment.name}
                cx={center}
                cy={center}
                r={outerR}
                fill="none"
                stroke={segment.color}
                strokeWidth={hovered?.startsWith(segment.name) ? outerStroke + 2 : outerStroke}
                strokeDasharray={`${Math.max(1, dash - 1)} ${outerCircumference}`}
                strokeDashoffset={offset}
                onMouseEnter={() => setHovered(`${segment.name}: ${segment.value} products (${((segment.value / totalCount) * 100).toFixed(0)}%)`)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer transition-all duration-200"
              />
            );
          })
        ) : (
          <circle
            cx={center}
            cy={center}
            r={outerR}
            fill="none"
            stroke="#94a3b8"
            strokeWidth={outerStroke}
            strokeDasharray={`${outerCircumference} ${outerCircumference}`}
            opacity={0.3}
          />
        )}
      </svg>

      {/* Center Text: Matches User Screenshot! */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none">
          {totalCount}
        </span>
        <span className="text-xs font-bold text-foreground mt-1 tracking-tight">
          Uploaded
        </span>
        <span className="text-[11px] text-muted-foreground font-semibold">
          Products
        </span>
      </div>

      {/* Interactive Tooltip on Hover */}
      <div className="h-5 mt-1 flex items-center justify-center text-[11px] font-semibold text-foreground/80">
        {hovered ? (
          <span className="bg-muted px-2 py-0.5 rounded-md border border-border/60">
            {hovered}
          </span>
        ) : null}
      </div>
    </div>
  );
}

const MONTH_OPTIONS = [
  { value: "ALL", label: "All Months" },
  { value: "1", label: "January (01)" },
  { value: "2", label: "February (02)" },
  { value: "3", label: "March (03)" },
  { value: "4", label: "April (04)" },
  { value: "5", label: "May (05)" },
  { value: "6", label: "June (06)" },
  { value: "7", label: "July (07)" },
  { value: "8", label: "August (08)" },
  { value: "9", label: "September (09)" },
  { value: "10", label: "October (10)" },
  { value: "11", label: "November (11)" },
  { value: "12", label: "December (12)" },
];

function parseChemicalDate(dateStr?: string, fallbackCreatedAt?: string): { month: number; year: number } | null {
  const target = dateStr || fallbackCreatedAt;
  if (!target || typeof target !== "string" || target.trim() === "") return null;

  const clean = target.trim();

  // Format: YYYY-MM-DD or ISO String
  if (/^\d{4}[-/.]\d{1,2}/.test(clean)) {
    const parts = clean.split(/[-/.]/);
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (!isNaN(y) && !isNaN(m)) return { year: y, month: m };
  }

  // Format: DD.MM.YYYY or DD/MM/YYYY
  const parts = clean.split(/[./-]/);
  if (parts.length === 3) {
    if (parts[2].length === 4) {
      const y = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) return { year: y, month: m };
    }
    if (parts[0].length === 4) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) return { year: y, month: m };
    }
  }

  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return {
      year: parsed.getFullYear(),
      month: parsed.getMonth() + 1,
    };
  }

  return null;
}

export default function CompliancePage() {
  const { data: chemicals = [], isLoading } = useGetChemicalsQuery();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtering state
  const [selectedMonth, setSelectedMonth] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Gather available years dynamically
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    chemicals.forEach((chem: IChemicalItem) => {
      [chem.date, chem.createdAt, chem.dateOfPurchase, chem.checkedOn].forEach((dStr) => {
        const d = parseChemicalDate(dStr);
        if (d?.year && d.year >= 1990 && d.year <= 2100) {
          yearsSet.add(String(d.year));
        }
      });
    });
    yearsSet.add("2030");
    yearsSet.add("2029");
    yearsSet.add("2028");
    yearsSet.add("2027");
    yearsSet.add("2026");
    yearsSet.add("2025");
    yearsSet.add("2024");
    yearsSet.add("2023");
    return Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
  }, [chemicals]);

  // Filter chemicals by month and year
  const filteredChemicals = useMemo(() => {
    return chemicals.filter((chem: IChemicalItem) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !q ||
        (chem.chemicalName && chem.chemicalName.toLowerCase().includes(q)) ||
        (chem.supplierName && chem.supplierName.toLowerCase().includes(q)) ||
        (chem.certificateName && chem.certificateName.toLowerCase().includes(q));

      let matchesDate = true;
      if (selectedMonth !== "ALL" || selectedYear !== "ALL") {
        const datesToCheck = [
          parseChemicalDate(chem.date),
          parseChemicalDate(chem.createdAt),
          parseChemicalDate(chem.dateOfPurchase),
          parseChemicalDate(chem.checkedOn)
        ].filter((d): d is { month: number; year: number } => d !== null);

        if (datesToCheck.length === 0) {
          matchesDate = false;
        } else {
          const reqMonth = selectedMonth !== "ALL" ? parseInt(selectedMonth, 10) : null;
          const reqYear = selectedYear !== "ALL" ? parseInt(selectedYear, 10) : null;

          if (reqMonth !== null && reqYear !== null) {
            matchesDate = datesToCheck.some((d) => d.month === reqMonth && d.year === reqYear);
          } else if (reqMonth !== null) {
            matchesDate = datesToCheck.some((d) => d.month === reqMonth);
          } else if (reqYear !== null) {
            matchesDate = datesToCheck.some((d) => d.year === reqYear);
          }
        }
      }

      return matchesSearch && matchesDate;
    });
  }, [chemicals, searchQuery, selectedMonth, selectedYear]);

  // Metrics Calculations
  const totalCount = filteredChemicals.length;

  // ZDHC Levels
  const level1Count = filteredChemicals.filter((c: IChemicalItem) => c.zdhcLevel === "Level-1").length;
  const level2Count = filteredChemicals.filter((c: IChemicalItem) => c.zdhcLevel === "Level-2").length;
  const level3Count = filteredChemicals.filter((c: IChemicalItem) => c.zdhcLevel === "Level-3").length;
  
  // Conformant is Level-1 + Level-2 + Level-3
  const conformantCount = level1Count + level2Count + level3Count;

  // Check expired (using expiryDate)
  const now = new Date();
  const expiredCount = filteredChemicals.filter((c: IChemicalItem) => {
    if (!c.expiryDate) return false;
    const exp = new Date(c.expiryDate);
    return !isNaN(exp.getTime()) && exp < now;
  }).length;

  // Not Published in ZDHC Gateway (None or empty)
  const notPublishedCount = filteredChemicals.filter((c: IChemicalItem) => !c.zdhcLevel || c.zdhcLevel === "None").length;

  // Not Evaluated
  const notEvaluatedCount = filteredChemicals.filter((c: IChemicalItem) => c.mrslRslCompliance === "N" || !c.mrslRslCompliance).length;

  // Chemicals to Zero (CtZ)
  // Foundational = Level-1
  const foundationalCount = level1Count;
  // Provisionally Progressive = Level-2 + Level-3
  const progressiveCount = level2Count + level3Count;

  // Percentage Helpers
  const calcPct = (cnt: number) => (totalCount > 0 ? ((cnt / totalCount) * 100).toFixed(0) : "0");
  const calcPctPrecise = (cnt: number) => (totalCount > 0 ? ((cnt / totalCount) * 100).toFixed(2) : "0.00");

  const gatewayPercent = totalCount > 0 ? (((totalCount - notPublishedCount) / totalCount) * 100).toFixed(2) : "0.00";
  const mrslPercent = calcPctPrecise(conformantCount);

  // Outer segments for ZDHC Donut Chart
  const zdhcSegments: DonutSegment[] = [
    { name: "Level 3", value: level3Count, color: "#06b6d4" },
    { name: "Level 2", value: level2Count, color: "#22c55e" },
    { name: "Level 1", value: level1Count, color: "#a3e635" },
    { name: "Not Published", value: notPublishedCount, color: "#60a5fa" },
    { name: "Expired", value: expiredCount, color: "#475569" },
  ];

  // Outer segments for Chemicals to Zero Donut Chart
  const ctzSegments: DonutSegment[] = [
    { name: "Provisionally Progressive", value: progressiveCount, color: "#86efac" },
    { name: "Foundational", value: foundationalCount, color: "#bef264" },
    { name: "Not Published", value: notPublishedCount, color: "#60a5fa" },
    { name: "Expired", value: expiredCount, color: "#475569" },
  ];

  const isAnyFilterActive = selectedMonth !== "ALL" || selectedYear !== "ALL" || searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSelectedMonth("ALL");
    setSelectedYear("ALL");
    setSearchQuery("");
  };

  if (!isMounted) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        Loading ZDHC MRSL Compliance Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 w-full max-w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link 
            href="/dashboard/chemicals" 
            className="p-2.5 hover:bg-muted/80 rounded-xl transition-colors border border-border/50 bg-background/50 shadow-sm shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent truncate">
              ZDHC MRSL Compliance & Performance
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium truncate">
              Chemicals to Zero (CtZ) and MRSL v3.1 evaluation dynamically sourced from Chemical Inventory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <Link
            href="/dashboard/chemicals/inventory"
            className="bg-background hover:bg-muted text-foreground border border-border px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2 shrink-0"
          >
            <PackageSearch className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Chemical Inventory</span>
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter & Period Toolbar */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-border/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-sm w-full min-w-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Evaluation Period:</span>
          {selectedMonth !== "ALL" || selectedYear !== "ALL" ? (
            <span className="font-semibold text-foreground bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
              {MONTH_OPTIONS.find(m => m.value === selectedMonth)?.label} {selectedYear !== "ALL" ? selectedYear : ""}
            </span>
          ) : (
            <span className="font-semibold text-foreground">All Logged Chemical Records</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm focus-within:ring-2 focus-within:ring-blue-500/40 shrink-0">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer text-xs sm:text-sm"
              title="Filter by Month"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value} className="bg-background text-foreground">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-background border border-border rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm cursor-pointer shrink-0"
            title="Filter by Year"
          >
            <option value="ALL">All Years</option>
            {availableYears.map((y) => (
              <option key={y} value={y} className="bg-background text-foreground">
                {y}
              </option>
            ))}
          </select>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Section: Chemical Inventory Performance Progress Bars */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-border/60 shadow-sm space-y-4 w-full min-w-0">
        <div className="border-b border-border/50 pb-3">
          <h2 className="text-lg font-bold text-foreground tracking-tight">Chemical Overview</h2>
          <p className="text-xs text-muted-foreground">High-level conformance benchmarks according to ZDHC Gateway standards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Metric 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">Total amount of chemical inventory products:</span>
              <span className="font-bold text-foreground">{totalCount}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3.5 overflow-hidden border border-border/40">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${totalCount > 0 ? 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">% of products published in Gateway:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{gatewayPercent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3.5 overflow-hidden border border-border/40">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(gatewayPercent)))}%` }}
              />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground font-medium">% of ZDHC MRSL v3.1 Levels 1, 2, 3:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{mrslPercent}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3.5 overflow-hidden border border-border/40">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(mrslPercent)))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2 Column Grid: Evaluation 1 & Evaluation 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        
        {/* CARD 1: Chemical Inventory Performance (ZDHC MRSL v3.1) */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-border/60 shadow-sm flex flex-col justify-between w-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Chemical Inventory Performance</h3>
                  <p className="text-xs text-muted-foreground">ZDHC MRSL v3.1 Conformance Breakdown</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                MRSL v3.1
              </span>
            </div>

            {/* Donut Chart & Breakdown Table Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-6">
              {/* Native SVG Donut Chart Left */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <ConcentricDonutChart
                  totalCount={totalCount}
                  innerValue={conformantCount}
                  innerColor="#6366f1"
                  outerSegments={zdhcSegments}
                  size={230}
                />
              </div>

              {/* Exact Styled Table Matching Official Report (Right) */}
              <div className="sm:col-span-7 overflow-hidden rounded-xl border border-border/70 text-xs shadow-sm">
                <div className="grid grid-cols-2 bg-muted/70 text-muted-foreground font-bold p-2.5 border-b border-border/70 text-[11px] uppercase tracking-wider">
                  <div>Evaluation</div>
                  <div className="text-right">ZDHC MRSL v3.1</div>
                </div>

                <div className="divide-y divide-border/60">
                  {/* Level 1 */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Level 1</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-slate-900 bg-[#bef264] dark:bg-[#a3e635] text-xs">
                        {level1Count} products ({calcPct(level1Count)}%)
                      </span>
                    </div>
                  </div>

                  {/* Level 2 */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Level 2</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-slate-900 bg-[#86efac] dark:bg-[#4ade80] text-xs">
                        {level2Count} products ({calcPct(level2Count)}%)
                      </span>
                    </div>
                  </div>

                  {/* Level 3 */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Level 3</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-white bg-[#0891b2] dark:bg-[#06b6d4] text-xs">
                        {level3Count} products ({calcPct(level3Count)}%)
                      </span>
                    </div>
                  </div>

                  {/* Expired */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Expired</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-white bg-[#475569] text-xs">
                        {expiredCount} products ({calcPct(expiredCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Not Published in ZDHC Gateway */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground text-[11px] leading-tight">Not Published in ZDHC Gateway</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-slate-900 bg-[#93c5fd] dark:bg-[#60a5fa] text-xs">
                        {notPublishedCount} products ({calcPct(notPublishedCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Conformant */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-bold text-foreground">Conformant</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-white bg-[#6366f1] text-xs">
                        {conformantCount} products ({calcPct(conformantCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Not Evaluated */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Not Evaluated</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-white bg-[#94a3b8] text-xs">
                        {notEvaluatedCount} products ({calcPct(notEvaluatedCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* All Products */}
                  <div className="grid grid-cols-2 p-2 items-center bg-muted/40">
                    <span className="font-bold text-foreground text-xs">All Products</span>
                    <div className="text-right font-bold text-foreground text-xs pr-2">
                      {totalCount} products (100%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 text-[11px] text-muted-foreground">
            Find more information about the <a href="https://www.roadmaptozero.com" target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 underline font-semibold inline-flex items-center gap-0.5">ZDHC MRSL Conformance Guidance <ExternalLink className="w-3 h-3" /></a>.
          </div>
        </div>

        {/* CARD 2: Chemicals to Zero Conformance (CtZ) */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-border/60 shadow-sm flex flex-col justify-between w-full min-w-0">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-border/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Chemicals to Zero Conformance</h3>
                  <p className="text-xs text-muted-foreground">Foundational & Progressive Progression</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-lime-500/10 text-lime-700 dark:text-lime-300 border border-lime-500/20">
                CtZ Conformance
              </span>
            </div>

            {/* Donut Chart & Breakdown Table Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-6">
              {/* Native SVG Donut Chart Left */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <ConcentricDonutChart
                  totalCount={totalCount}
                  innerValue={conformantCount}
                  innerColor="#6366f1"
                  outerSegments={ctzSegments}
                  size={230}
                />
              </div>

              {/* Exact Styled Table Matching Official CtZ Report (Right) */}
              <div className="sm:col-span-7 overflow-hidden rounded-xl border border-border/70 text-xs shadow-sm">
                <div className="grid grid-cols-2 bg-muted/70 text-muted-foreground font-bold p-2.5 border-b border-border/70 text-[11px] uppercase tracking-wider">
                  <div>Evaluation</div>
                  <div className="text-right">Chemicals to Zero</div>
                </div>

                <div className="divide-y divide-border/60">
                  {/* Foundational */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Foundational</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-slate-900 bg-[#bef264] dark:bg-[#a3e635] text-xs">
                        {foundationalCount} products ({calcPct(foundationalCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Provisionally Progressive */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground text-[11px] leading-tight">Provisionally Progressive</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-slate-900 bg-[#86efac] dark:bg-[#4ade80] text-xs">
                        {progressiveCount} products ({calcPct(progressiveCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Expired */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Expired</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-white bg-[#475569] text-xs">
                        {expiredCount} products ({calcPct(expiredCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Not Published in ZDHC Gateway */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground text-[11px] leading-tight">Not Published in ZDHC Gateway</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-slate-900 bg-[#93c5fd] dark:bg-[#60a5fa] text-xs">
                        {notPublishedCount} products ({calcPct(notPublishedCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Conformant */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-bold text-foreground">Conformant</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-white bg-[#6366f1] text-xs">
                        {conformantCount} products ({calcPct(conformantCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* Not Evaluated */}
                  <div className="grid grid-cols-2 p-2 items-center hover:bg-muted/30 transition-colors">
                    <span className="font-semibold text-foreground">Not Evaluated</span>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-white bg-[#94a3b8] text-xs">
                        {notEvaluatedCount} products ({calcPct(notEvaluatedCount)}%)
                      </span>
                    </div>
                  </div>

                  {/* All Products */}
                  <div className="grid grid-cols-2 p-2 items-center bg-muted/40">
                    <span className="font-bold text-foreground text-xs">All Products</span>
                    <div className="text-right font-bold text-foreground text-xs pr-2">
                      {totalCount} products (100%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 text-[11px] text-muted-foreground">
            Find more information about <a href="https://www.roadmaptozero.com" target="_blank" rel="noreferrer" className="text-lime-600 dark:text-lime-400 underline font-semibold inline-flex items-center gap-0.5">Chemicals to Zero here <ExternalLink className="w-3 h-3" /></a>.
          </div>
        </div>

      </div>

      {/* Detailed Chemical Conformance Registry Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/60 shadow-sm w-full max-w-full min-w-0">
        <div className="p-4 sm:p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-foreground">Chemical Products Compliance Registry</h3>
            <p className="text-xs text-muted-foreground">Itemized list of chemicals and their verified conformance status</p>
          </div>
          <div className="text-xs font-semibold text-muted-foreground">
            Showing {filteredChemicals.length} of {chemicals.length} chemicals
          </div>
        </div>

        <div className="overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-muted-foreground/20">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12 text-center">S.L</th>
                <th className="p-4">Chemical Product</th>
                <th className="p-4">Supplier & Manufacturer</th>
                <th className="p-4">ZDHC MRSL Level</th>
                <th className="p-4">CtZ Category</th>
                <th className="p-4">Certificate Name</th>
                <th className="p-4">CAS / EINECS</th>
                <th className="p-4">Inventory Log Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Loading compliance records...
                  </td>
                </tr>
              ) : filteredChemicals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                      <FlaskConical className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-foreground">No chemical records found for this period</p>
                    <p className="text-xs mt-1">Try resetting the period filter or check your inventory entries.</p>
                  </td>
                </tr>
              ) : (
                filteredChemicals.map((record: IChemicalItem, index: number) => {
                  const isLevel3 = record.zdhcLevel === "Level-3";
                  const isLevel2 = record.zdhcLevel === "Level-2";
                  const isLevel1 = record.zdhcLevel === "Level-1";

                  const ctzLabel = isLevel3 || isLevel2 
                    ? "Provisionally Progressive" 
                    : isLevel1 
                    ? "Foundational" 
                    : "Not Evaluated";

                  return (
                    <tr key={record._id || index} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-center text-muted-foreground font-medium">{index + 1}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-sm">{record.chemicalName}</span>
                          <span className="text-xs text-muted-foreground">{record.functionOfChemical || record.chemicalType || "Textile Auxiliary"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col max-w-[200px] truncate">
                          <span className="font-medium text-foreground text-xs">{record.supplierName || "—"}</span>
                          <span className="text-[11px] text-muted-foreground truncate">{record.manufacturerName || "—"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                          isLevel3 
                            ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300/40" 
                            : isLevel2
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40"
                            : isLevel1
                            ? "bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300 border border-lime-300/40"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}>
                          {isLevel1 || isLevel2 || isLevel3 ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {record.zdhcLevel || "None"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          ctzLabel === "Provisionally Progressive"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                            : ctzLabel === "Foundational"
                            ? "bg-lime-50 dark:bg-lime-950/40 text-lime-700 dark:text-lime-300"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {ctzLabel}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-foreground">
                        {record.certificateName || "—"}
                      </td>
                      <td className="p-4 text-xs font-mono text-muted-foreground max-w-[150px] truncate" title={record.casNo}>
                        {record.casNo || "—"}
                      </td>
                      <td className="p-4 text-xs font-mono text-muted-foreground">
                        {record.date || record.createdAt?.slice(0, 10) || "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
