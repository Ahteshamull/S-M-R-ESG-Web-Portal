"use client";

import React, { useState, useMemo } from "react";
import {
  Droplets,
  CloudRain,
  RotateCcw,
  Plus,
  Table2,
  Trash2,
  Download,
  Activity,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Waves,
  RefreshCw,
  ExternalLink,
  Filter,
  Eye,
  FileText,
  Sliders,
  Layers,
  Sparkles,
  Gauge,
  Printer,
  ChevronDown,
  X,
  Building2,
  Calendar,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { exportWaterBalanceToExcel } from "@/lib/exportWaterExcel";
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
} from 'recharts';
import {
  useGetWaterLogsQuery,
  useCreateWaterLogMutation,
  useDeleteWaterLogMutation
} from "@/lib/redux/slices/waterApi";

const SOURCING_COLORS = ["#3b82f6", "#0ea5e9", "#06b6d4", "#10b981", "#8b5cf6"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = [2026, 2025, 2024];

export default function EnterpriseWaterPortal() {
  // Redux API
  const { data: waterLogs = [], isLoading } = useGetWaterLogsQuery();
  const [createWaterLog, { isLoading: isCreating }] = useCreateWaterLogMutation();
  const [deleteWaterLog] = useDeleteWaterLogMutation();

  // Active View Tab: Overview Dashboard vs Record Portal
  const [activeTab, setActiveTab] = useState<"overview" | "portal">("overview");

  // Filters
  const [selectedYear, setSelectedYear] = useState<number | "All">("All");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedPlant, setSelectedPlant] = useState<string>("All Facilities");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Process Water Dropdown selection (Section 4)
  const [selectedProcessType, setSelectedProcessType] = useState<"Dyeing" | "Washing" | "Printing" | "Utility" | "Garments">("Dyeing");
  const [selectedGoodsType, setSelectedGoodsType] = useState<"denim" | "fabric_washing" | "garment">("denim");

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState<any | null>(null);

  // Process Losses Parameter
  const [processLossesY, setProcessLossesY] = useState<number>(65.45);

  // Form State for Log Water Entry Modal
  const [formMonth, setFormMonth] = useState<string>("January");
  const [formYear, setFormYear] = useState<number>(2026);
  const [formGoodsType, setFormGoodsType] = useState<"denim" | "fabric_washing" | "garment">("denim");
  const [formProductionKg, setFormProductionKg] = useState<number | "">("");
  const [formLiquorRatio, setFormLiquorRatio] = useState<string>("1:7");

  // Sourcing Inputs (Section 3)
  const [formGroundwater, setFormGroundwater] = useState<number | "">("");
  const [formWarpoDwasa, setFormWarpoDwasa] = useState<number | "">("");
  const [formRainWater, setFormRainWater] = useState<number | "">("");
  const [formRecycleWater, setFormRecycleWater] = useState<number | "">("");
  const [formSurfaceWater, setFormSurfaceWater] = useState<number | "">("");

  // Departmental Inputs (Section 4)
  const [formProcessDyeing, setFormProcessDyeing] = useState<number | "">("");
  const [formProcessWashing, setFormProcessWashing] = useState<number | "">("");
  const [formProcessPrinting, setFormProcessPrinting] = useState<number | "">("");
  const [formBoilerSteam, setFormBoilerSteam] = useState<number | "">("");
  const [formCooling, setFormCooling] = useState<number | "">("");
  const [formToiletCanteen, setFormToiletCanteen] = useState<number | "">("");
  const [formDiningDrinking, setFormDiningDrinking] = useState<number | "">("");

  // Circularity Inputs (Section 5)
  const [formRoRecycled, setFormRoRecycled] = useState<number | "">("");
  const [formRainHarvested, setFormRainHarvested] = useState<number | "">("");
  const [formLowLiquorSavings, setFormLowLiquorSavings] = useState<number | "">("");

  // Compliance & Regulatory (Section 6 & 7)
  const [formSubmeteringCoverage, setFormSubmeteringCoverage] = useState<number | "">("");
  const [formHiggScore, setFormHiggScore] = useState<number | "">("");
  const [formInletWater, setFormInletWater] = useState<number | "">("");
  const [formOutletWater, setFormOutletWater] = useState<number | "">("");

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return waterLogs.filter((log: any) => {
      const matchYear = selectedYear === "All" || (log.year ? log.year === selectedYear : true);
      const matchMonth = selectedMonth === "All" || log.month.toLowerCase() === selectedMonth.toLowerCase();
      const matchSearch =
        searchQuery.trim() === "" ||
        log.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.goodsType && log.goodsType.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchYear && matchMonth && matchSearch;
    });
  }, [waterLogs, selectedYear, selectedMonth, searchQuery]);

  // Aggregate Key Performance Indicators (KPIs)
  const kpis = useMemo(() => {
    const totalWithdrawal = filteredLogs.reduce((sum, log) => sum + (Number(log.totalWithdrawal) || 0), 0);
    const totalProdKg = filteredLogs.reduce((sum, log) => sum + (Number(log.productionKg) || 0), 0);
    const totalGroundwater = filteredLogs.reduce((sum, log) => sum + (Number(log.sources?.groundwater) || 0), 0);
    const totalRain = filteredLogs.reduce((sum, log) => sum + (Number(log.sources?.rainWater) || 0), 0);
    const totalRecycle = filteredLogs.reduce((sum, log) => sum + (Number(log.sources?.recycleWater) || 0), 0);

    const waterIntensity = totalProdKg > 0 ? ((totalWithdrawal * 1000) / totalProdKg).toFixed(1) : "0.0";
    const gwRatio = totalWithdrawal > 0 ? ((totalGroundwater / totalWithdrawal) * 100).toFixed(1) : "0.0";
    const altRatio = totalWithdrawal > 0 ? (((totalRain + totalRecycle) / totalWithdrawal) * 100).toFixed(1) : "0.0";

    return {
      totalWithdrawal,
      waterIntensity: Number(waterIntensity),
      gwRatio: Number(gwRatio),
      altRatio: Number(altRatio),
      totalGroundwater,
      totalAlternative: totalRain + totalRecycle,
      count: filteredLogs.length
    };
  }, [filteredLogs]);

  // Sourcing Distribution Data (Section 3 Donut Chart)
  const sourcingPieData = useMemo(() => {
    let gw = 0, warpo = 0, rain = 0, recycle = 0, surface = 0;
    filteredLogs.forEach((log) => {
      const s = log.sources;
      gw += Number(s?.groundwater) || 0;
      warpo += Number(s?.warpoDwasa) || 0;
      rain += Number(s?.rainWater) || 0;
      recycle += Number(s?.recycleWater) || 0;
      surface += Number(s?.surfaceWater) || 0;
    });

    return [
      { name: "Groundwater", value: gw },
      { name: "WARPO / DWASA", value: warpo },
      { name: "Rain Water", value: rain },
      { name: "Recycle Water", value: recycle },
      { name: "Surface Water", value: surface },
    ];
  }, [filteredLogs]);

  // Dynamic Departmental Breakdown Summary (Section 4)
  const deptSummary = useMemo(() => {
    let boiler = 0, cooling = 0, sanitation = 0, dyeing = 0, washing = 0, printing = 0;
    filteredLogs.forEach((l: any) => {
      boiler += Number(l.departments?.utilityBoilerSteam) || 0;
      cooling += Number(l.departments?.utilityCooling) || 0;
      sanitation += (Number(l.departments?.domesticToiletCanteen) || 0) + (Number(l.departments?.domesticDiningDrinking) || 0);
      dyeing += Number(l.departments?.processDyeing) || 0;
      washing += Number(l.departments?.processWashing) || 0;
      printing += Number(l.departments?.processPrinting) || 0;
    });
    return { boiler, cooling, sanitation, dyeing, washing, printing };
  }, [filteredLogs]);

  // Dynamic Circularity Summary (Section 5)
  const circularitySummary = useMemo(() => {
    let ro = 0, rain = 0, lowLiquorSavings = 0, count = 0;
    filteredLogs.forEach((l: any) => {
      ro += Number(l.circularity?.roRecycledVolume) || 0;
      rain += Number(l.circularity?.rainwaterHarvested) || 0;
      if (l.circularity?.lowLiquorSavings) {
        lowLiquorSavings += Number(l.circularity.lowLiquorSavings);
        count++;
      }
    });
    const avgSaving = count > 0 ? (lowLiquorSavings / count).toFixed(1) : "0";
    return { ro, rain, avgSaving };
  }, [filteredLogs]);

  // Dynamic Regulatory & Compliance Summary (Section 6)
  const complianceSummary = useMemo(() => {
    if (filteredLogs.length === 0) return { coverage: 0, higgScore: 0 };
    const latestLog = filteredLogs[0];
    const coverage = latestLog.regulatory?.digitalSubmeteringCoverage ?? 0;
    const higgScore = latestLog.regulatory?.higgFemScore ?? 0;
    return { coverage, higgScore };
  }, [filteredLogs]);

  // Monthly Consumption Bar Chart Data
  const monthlyChartData = useMemo(() => {
    return filteredLogs.map((log) => {
      const s = log.sources;
      const tw = log.totalWithdrawal || 0;
      return {
        name: log.month ? log.month.substring(0, 3) : "Mo",
        Groundwater: Number(s?.groundwater) || 0,
        Municipal: Number(s?.warpoDwasa) || 0,
        Rainwater: Number(s?.rainWater) || 0,
        Recycled: Number(s?.recycleWater) || 0,
        Total: tw
      };
    });
  }, [filteredLogs]);

  // Goods Ratio Benchmark Calculator (Section 4)
  const goodsRatioBenchmark = useMemo(() => {
    switch (selectedGoodsType) {
      case "fabric_washing":
        return { excellent: 41, good: 56, title: "Fabric Washing", current: kpis.waterIntensity };
      case "denim":
        return { excellent: 65, good: 93, title: "Denim", current: kpis.waterIntensity };
      case "garment":
        return { excellent: 46, good: 63, title: "Garment", current: kpis.waterIntensity };
    }
  }, [selectedGoodsType, kpis.waterIntensity]);

  const goodsRatioRating = useMemo(() => {
    const cur = goodsRatioBenchmark.current;
    if (cur <= goodsRatioBenchmark.excellent) return { label: "Excellent Efficiency", color: "emerald", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" };
    if (cur <= goodsRatioBenchmark.good) return { label: "Good Benchmark", color: "blue", bg: "bg-blue-500/10 text-blue-600 border-blue-500/30" };
    return { label: "High Consumption (Optimize)", color: "amber", bg: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
  }, [goodsRatioBenchmark]);

  // Handle Form Submit
  const handleSaveWaterLog = async (e: React.FormEvent) => {
    e.preventDefault();

    const gw = Number(formGroundwater) || 0;
    const warpo = Number(formWarpoDwasa) || 0;
    const rain = Number(formRainWater) || 0;
    const recycle = Number(formRecycleWater) || 0;
    const surface = Number(formSurfaceWater) || 0;
    const totalWith = gw + warpo + rain + recycle + surface;

    const dyeing = Number(formProcessDyeing) || 0;
    const washing = Number(formProcessWashing) || 0;
    const printing = Number(formProcessPrinting) || 0;
    const boiler = Number(formBoilerSteam) || 0;
    const cooling = Number(formCooling) || 0;
    const toiletCanteen = Number(formToiletCanteen) || 0;
    const diningDrinking = Number(formDiningDrinking) || 0;

    const totalProd = dyeing + washing + printing + boiler + cooling;
    const totalDomestic = toiletCanteen + diningDrinking;

    const prodKg = Number(formProductionKg) || 0;
    const calculatedIntensity = prodKg > 0 ? Number(((totalWith * 1000) / prodKg).toFixed(2)) : 0;
    const calculatedGwRatio = totalWith > 0 ? Number(((gw / totalWith) * 100).toFixed(2)) : 0;
    const calculatedAltRatio = totalWith > 0 ? Number((((rain + recycle) / totalWith) * 100).toFixed(2)) : 0;

    const payload = {
      month: formMonth,
      year: Number(formYear),
      totalWithdrawal: totalWith,
      totalProduction: totalProd,
      domestic: totalDomestic,
      inletWater: Number(formInletWater) || 0,
      outletWater: Number(formOutletWater) || 0,
      processLossesY: processLossesY,
      productionKg: prodKg,
      goodsType: formGoodsType,
      liquorRatio: formLiquorRatio,
      waterIntensity: calculatedIntensity,
      groundwaterRatio: calculatedGwRatio,
      alternativeRatio: calculatedAltRatio,
      sources: {
        groundwater: gw,
        warpoDwasa: warpo,
        rainWater: rain,
        recycleWater: recycle,
        surfaceWater: surface,
      },
      departments: {
        processDyeing: dyeing,
        processWashing: washing,
        processPrinting: printing,
        utilityBoilerSteam: boiler,
        utilityCooling: cooling,
        domesticToiletCanteen: toiletCanteen,
        domesticDiningDrinking: diningDrinking,
      },
      circularity: {
        roRecycledVolume: Number(formRoRecycled) || 0,
        rainwaterHarvested: Number(formRainHarvested) || 0,
        lowLiquorSavings: Number(formLowLiquorSavings) || 0,
        lowLiquorReductionPercent: Number(formLowLiquorSavings) ? 18 : 0,
      },
      regulatory: {
        groundwaterLicenseStatus: "Active" as const,
        digitalSubmeteringCoverage: Number(formSubmeteringCoverage) || 0,
        higgFemScore: Number(formHiggScore) || 0,
        isDataLoggedVerified: true,
      },
      flowmeters: [
        { meterName: "Flowmeter 01 - Deep Tubewell", previous: 0, present: gw, difference: gw },
        { meterName: "Flowmeter 02 - Process Inlet", previous: 0, present: totalProd, difference: totalProd },
        { meterName: "Flowmeter 03 - RO Recovery Line", previous: 0, present: recycle, difference: recycle },
      ],
      withdrawals: [{ previous: 0, present: totalWith, difference: totalWith }],
      boilers: [{ previous: 0, present: boiler, difference: boiler }]
    };

    const res = await createWaterLog(payload);
    if (!res.error) {
      toast.success(`Water log for ${formMonth} ${formYear} recorded successfully!`);
      setIsLogModalOpen(false);
    } else {
      const err = (res.error as any)?.data?.message || "Failed to log water consumption";
      toast.error(err);
    }
  };

  const handleDelete = async (id: string, month: string) => {
    if (confirm(`Are you sure you want to delete the record for ${month}?`)) {
      const res = await deleteWaterLog(id);
      if (!res.error) {
        toast.success(`Record for ${month} deleted`);
      } else {
        toast.error("Failed to delete record");
      }
    }
  };

  // Export Excel Handler
  const handleExportExcel = () => {
    const valX = kpis.totalWithdrawal;
    const valBoiler = filteredLogs.reduce((sum, l) => sum + (l.departments?.utilityBoilerSteam || l.totalProduction || 0), 0);
    const valY = processLossesY;
    const valZ = Math.max(0, valX - valBoiler - valY);
    const waterBalanceValue = valZ + valBoiler;
    const marginOfError = valX > 0 ? (waterBalanceValue / valX) * 100 : 0;
    const percentClosureResult = 100 - marginOfError;

    exportWaterBalanceToExcel({
      waterLogs: filteredLogs.length > 0 ? filteredLogs : waterLogs,
      valX,
      valY,
      valBoiler,
      valZ,
      waterBalanceValue,
      marginOfError,
      percentClosureResult
    });
    toast.success("Water Sustainability Excel Report Generated!");
  };

  // Print PDF Trigger
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-14 overflow-x-hidden w-full max-w-[100vw]">
      {/* 1. Header & Quick Actions Bar */}
      <div className="bg-gradient-to-r from-teal-950/20 via-background to-emerald-950/20 p-6 md:p-8 rounded-3xl border border-teal-500/20 backdrop-blur-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Bureau Veritas & Higg FEM Standards
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-500 dark:from-teal-300 dark:via-emerald-300 dark:to-cyan-200 bg-clip-text text-transparent">
              Enterprise Water Management Portal
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium flex items-center gap-2">
              <span>Compliance & Sustainability Tracker</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
              <span className="text-teal-600 dark:text-teal-400 font-semibold">{selectedPlant}</span>
            </p>
          </div>

          {/* Quick Filter Controls & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Year Filter */}
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value === "All" ? "All" : Number(e.target.value))}
                className="bg-transparent text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All">All Years</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All">All Months (YTD)</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Facilities Type Selector */}
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 text-teal-600" />
              <span className="text-muted-foreground whitespace-nowrap">Facilities Type:</span>
              <select
                value={selectedPlant}
                onChange={(e) => setSelectedPlant(e.target.value)}
                className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
                style={{ colorScheme: "dark" }}
              >
                <option value="All Facilities" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Facilities</option>
                <option value="Cut to Pack" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Cut to Pack</option>
                <option value="Washing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Washing</option>
                <option value="Dyeing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Dyeing</option>
                <option value="Printing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Printing</option>
              </select>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handlePrintPdf}
              className="bg-background/90 hover:bg-muted text-foreground border border-border/80 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center h-10 active:scale-95"
              title="Print or Export PDF Report"
            >
              <Printer className="w-4 h-4 mr-1.5 text-teal-600" /> PDF Report
            </button>

            <button
              onClick={handleExportExcel}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 hover:shadow-teal-600/40 flex items-center h-10 active:scale-95"
            >
              <Download className="w-4 h-4 mr-1.5" /> Excel Report
            </button>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/40 flex items-center h-10 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Log Water Data
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Overview vs Record Portal */}
        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border/40">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            <Activity className="w-4 h-4" /> 1. Sustainability & KPI Dashboard
          </button>

          <button
            onClick={() => setActiveTab("portal")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "portal"
                ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                : "bg-muted/40 hover:bg-muted/70 text-muted-foreground"
            }`}
          >
            <Table2 className="w-4 h-4" /> 2. Water Consumption Record — Portal
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPI Dashboard - 4 Column Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* KPI 1: Total Withdrawal */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-3xl p-6 border border-blue-500/20 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-xs font-bold text-blue-800/80 dark:text-blue-300/80 uppercase tracking-wider">
                Total Withdrawal
              </span>
              <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-blue-700 to-cyan-500 dark:from-blue-300 dark:to-cyan-200 bg-clip-text text-transparent">
                {kpis.totalWithdrawal.toLocaleString()}{" "}
                <span className="text-sm font-semibold text-muted-foreground">m³</span>
              </h3>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-bold">
                <span className="text-emerald-600 font-black">🠗 5%</span> vs last month
              </div>
            </div>
            <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* KPI 2: Water Intensity Metric */}
        <div className="relative overflow-hidden bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-transparent rounded-3xl p-6 border border-teal-500/20 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-xs font-bold text-teal-800/80 dark:text-teal-300/80 uppercase tracking-wider">
                Water Intensity Metric
              </span>
              <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-teal-700 to-emerald-500 dark:from-teal-300 dark:to-emerald-200 bg-clip-text text-transparent">
                {kpis.waterIntensity}{" "}
                <span className="text-sm font-semibold text-muted-foreground">L / Kg</span>
              </h3>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold">
                <Gauge className="w-3.5 h-3.5" /> Performance: Excellent
              </div>
            </div>
            <div className="p-3.5 bg-teal-500/10 rounded-2xl text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* KPI 3: Groundwater Abstraction Ratio (%) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl p-6 border border-amber-500/20 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-xs font-bold text-amber-800/80 dark:text-amber-300/80 uppercase tracking-wider">
                Groundwater Abstraction
              </span>
              <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-amber-700 to-orange-500 dark:from-amber-300 dark:to-orange-200 bg-clip-text text-transparent">
                {kpis.gwRatio} <span className="text-sm font-semibold text-muted-foreground">%</span>
              </h3>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Regulatory Limit &le; 65%
              </div>
            </div>
            <div className="p-3.5 bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 group-hover:scale-110 transition-transform">
              <Waves className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* KPI 4: Alternative Water Contribution */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-3xl p-6 border border-emerald-500/20 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300/80 uppercase tracking-wider">
                Alternative Contribution
              </span>
              <h3 className="text-3xl font-black mt-2 bg-gradient-to-r from-emerald-700 to-teal-500 dark:from-emerald-300 dark:to-teal-200 bg-clip-text text-transparent">
                {kpis.altRatio} <span className="text-sm font-semibold text-muted-foreground">%</span>
              </h3>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                <RefreshCw className="w-3.5 h-3.5" /> Circular Economy Driver
              </div>
            </div>
            <div className="p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform">
              <CloudRain className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* 3. Water Sourcing & Withdrawal Analytics (Section 3) */}
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
                      <h3 className="text-base md:text-lg font-bold">3. Water Sourcing & Withdrawal</h3>
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
                    <span className="text-lg font-extrabold text-foreground">{kpis.totalWithdrawal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Source breakdown legend & metrics */}
              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border/40 text-xs font-semibold">
                {sourcingPieData.map((s, idx) => (
                  <div key={s.name} className="flex items-center justify-between p-2 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SOURCING_COLORS[idx] }}></div>
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

          {/* 4. Department-Wise Water Consumption & Process Audit (Section 4) */}
          <div className="bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-border/50 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold">4. Department-Wise Water Consumption</h3>
                  <p className="text-xs text-muted-foreground">Process Water Audit, Liquor Ratio (1:7), and Goods Ratio Benchmarks</p>
                </div>
              </div>

              {/* Process Water Dropdown Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-background border border-border/80 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
                  <span className="text-muted-foreground">Water Use Area:</span>
                  <select
                    value={selectedProcessType}
                    onChange={(e) => setSelectedProcessType(e.target.value as any)}
                    className="bg-transparent font-bold text-teal-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Dyeing">Dyeing Department</option>
                    <option value="Washing">Washing Department</option>
                    <option value="Printing">Printing Department</option>
                    <option value="Utility">Utility Department</option>
                    <option value="Garments">Garments Department</option>
                    

                  </select>
                </div>

                {/* <div className="flex items-center gap-2 bg-background border border-border/80 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
                  <span className="text-muted-foreground">Goods Type:</span>
                  <select
                    value={selectedGoodsType}
                    onChange={(e) => setSelectedGoodsType(e.target.value as any)}
                    className="bg-transparent font-bold text-teal-600 focus:outline-none cursor-pointer"
                  >
                    <option value="denim">Denim</option>
                    <option value="fabric_washing">Fabric Washing</option>
                    <option value="garment">Garment</option>
                  </select>
                </div> */}
              </div>
            </div>

            {/* Department Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Process Water & Liquor Ratio Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-teal-800/80 dark:text-teal-300/80 uppercase">Process Water Audit</span>
                    <h4 className="text-2xl font-black mt-1 text-foreground">{selectedProcessType} Process</h4>
                  </div>
                  <div className="p-2.5 bg-teal-500/10 text-teal-600 rounded-xl">
                    <Sliders className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-background/80 border border-border/60 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Liquor Ratio:</span>
                    <span className="font-extrabold text-teal-600">1:7 Standard</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Machine Status:</span>
                    <span className="font-bold text-emerald-600">Eco-Low Liquor Optimized</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Sub-meter Flow:</span>
                    <span className="font-bold text-foreground">Verified Daily</span>
                  </div>
                </div>
              </div>

              {/* Goods Ratio Benchmark Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-blue-800/80 dark:text-blue-300/80 uppercase">Goods Ratio Benchmark</span>
                    <h4 className="text-2xl font-black mt-1 text-foreground">{goodsRatioBenchmark.title}</h4>
                  </div>
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
                    <Gauge className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-muted-foreground">Benchmark Standard:</span>
                    <span className="text-blue-700 dark:text-blue-300 font-extrabold">
                      Exc: {goodsRatioBenchmark.excellent} L | Good: {goodsRatioBenchmark.good} L
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-xs font-bold text-center ${goodsRatioRating.bg}`}>
                    Current Intensity: {goodsRatioBenchmark.current} L/Kg — {goodsRatioRating.label}
                  </div>
                </div>
              </div>

              {/* Utilities & Domestic Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-emerald-800/80 dark:text-emerald-300/80 uppercase">Utilities & Domestic</span>
                    <h4 className="text-2xl font-black mt-1 text-foreground">Sanitation & Steam</h4>
                  </div>
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-background/80 border border-border/60 space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Boiler Steam Generation:</span>
                    <span className="font-bold text-foreground">{deptSummary.boiler.toLocaleString()} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cooling Purpose Use:</span>
                    <span className="font-bold text-foreground">{deptSummary.cooling.toLocaleString()} m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toilet & Canteen Sanitation:</span>
                    <span className="font-bold text-foreground">{deptSummary.sanitation.toLocaleString()} m³</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Circularity & Water Savings Initiatives (Section 5) */}
          <div className="bg-gradient-to-r from-emerald-950/20 via-background to-teal-950/20 rounded-3xl p-6 md:p-8 border border-emerald-500/20 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/40 pb-5">
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold">5. Circularity & Water Savings Initiatives</h3>
                <p className="text-xs text-muted-foreground">Closed-Loop Recycling, Rainwater Harvesting & Machine Optimization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* RO Water Recycling */}
              <div className="p-6 rounded-2xl bg-background/70 border border-emerald-500/30 shadow-sm relative overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">RO Water Recycling Plant</h4>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-600">{circularitySummary.ro.toLocaleString()}</span>
                  <span className="text-xs font-bold text-muted-foreground">m³ Reused</span>
                </div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-2 font-semibold">
                  ↪ Passes Back to Dyeing Process
                </p>
                <div className="mt-4 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 inline-block">
                  Recycled closed-loop supply
                </div>
              </div>

              {/* Rain Water Harvesting */}
              <div className="p-6 rounded-2xl bg-background/70 border border-cyan-500/30 shadow-sm relative overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-600 mb-4 group-hover:scale-110 transition-transform">
                  <CloudRain className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">Rain Water Harvesting System</h4>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-cyan-600">{circularitySummary.rain.toLocaleString()}</span>
                  <span className="text-xs font-bold text-muted-foreground">m³ Collected</span>
                </div>
                <p className="text-xs text-cyan-700/80 dark:text-cyan-300/80 mt-2 font-semibold">
                  ↪ Used for Toilet Flush & Gardening
                </p>
                <div className="mt-4 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 inline-block">
                  Preserves Deep Aquifer
                </div>
              </div>

              {/* Low Liquor Ratio Machine */}
              <div className="p-6 rounded-2xl bg-background/70 border border-blue-500/30 shadow-sm relative overflow-hidden group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">Low Liquor Ratio Dyeing Machine</h4>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600">Save {circularitySummary.avgSaving}</span>
                  <span className="text-xs font-bold text-muted-foreground">Liters / Kg</span>
                </div>
                <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-2 font-semibold">
                  ↪ Eco-optimization Achieved
                </p>
                <div className="mt-4 text-[11px] font-bold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 inline-block">
                  High-Efficiency Liquor Circulation
                </div>
              </div>
            </div>
          </div>

          {/* 6. Regulatory & Compliance Matrix & 7. Document Repository */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 6: Regulatory & Compliance Matrix */}
            <div className="bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-border/50 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">6. Regulatory & Compliance Matrix</h3>
                    <p className="text-xs text-muted-foreground">WARPO, DoE & Higg FEM Mandates</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                  Active Verified
                </span>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div className="p-3.5 rounded-xl bg-muted/30 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">Groundwater Extraction License</p>
                    <p className="text-[11px] text-muted-foreground">WARPO Water Permit Doc Authorized</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                    Valid till Dec 2026
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">Digital Sub-metering Coverage</p>
                    <p className="text-[11px] text-muted-foreground">Automated telemetry monitoring</p>
                  </div>
                  <span className="text-sm font-extrabold text-teal-600">{complianceSummary.coverage}% Coverage</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">WRI Aqueduct Risk Link</p>
                    <p className="text-[11px] text-muted-foreground">World Resources Institute Atlas</p>
                  </div>
                  <a
                    href="https://www.wri.org/applications/aqueduct/water-risk-atlas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline font-bold"
                  >
                    View Risk Atlas <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">Higg FEM Water Score</p>
                    <p className="text-[11px] text-muted-foreground">Annual Verification verified by BV</p>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 font-extrabold">
                    {complianceSummary.higgScore} / 100
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Water Abstraction Data Logged & Verified</span>
                </div>
              </div>
            </div>

            {/* Section 7: Document & Data Repository */}
            <div className="bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-border/50 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">7. Document & Data Repository</h3>
                    <p className="text-xs text-muted-foreground">Flowmeter Calibration & Water Quality Tests</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div className="p-3.5 rounded-xl bg-muted/30 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-foreground">Calibration Certificates — Flowmeters (PDF)</p>
                      <p className="text-[11px] text-muted-foreground">ISO/IEC 17025 Certified Flow Meters</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Calibration certificate ready for download")}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all text-xs"
                  >
                    View PDF
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <div>
                      <p className="font-bold text-foreground">Water Quality Test (PDF)</p>
                      <p className="text-[11px] text-muted-foreground">ETP Treated, Inlet & Outlet Parameters</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Water quality test report ready for download")}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all text-xs"
                  >
                    View PDF
                  </button>
                </div>

                {/* Flowmeter Data Quick Table */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-teal-600" /> Flowmeter Telemetry Data
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-border/60">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-muted/50 font-bold text-muted-foreground">
                        <tr>
                          <th className="py-2 px-3 text-left">Flowmeter Line</th>
                          <th className="py-2 px-2">Previous</th>
                          <th className="py-2 px-2">Present</th>
                          <th className="py-2 px-2 text-teal-600">Total (m³)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-medium">
                        <tr>
                          <td className="py-2 px-3 text-left font-semibold">FM-01: Deep Tubewell</td>
                          <td className="py-2 px-2">12,400</td>
                          <td className="py-2 px-2">14,200</td>
                          <td className="py-2 px-2 font-bold text-teal-600">1,800</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-left font-semibold">FM-02: Process Line</td>
                          <td className="py-2 px-2">8,900</td>
                          <td className="py-2 px-2">10,450</td>
                          <td className="py-2 px-2 font-bold text-teal-600">1,550</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-left font-semibold">FM-03: RO Recycle Line</td>
                          <td className="py-2 px-2">3,400</td>
                          <td className="py-2 px-2">4,500</td>
                          <td className="py-2 px-2 font-bold text-teal-600">1,100</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* 1. Water Consumption Record — Portal (Section 1) */
        <div className="bg-background rounded-3xl border border-border/70 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-50/40 dark:bg-teal-950/20">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Table2 className="w-5 h-5 text-teal-600" /> Water Consumption Record — Portal
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Detailed historical logs, department allocations, and audit verification records
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search month or goods..."
                className="bg-background border border-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50 w-44 sm:w-56"
              />
              <button
                onClick={() => setIsLogModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center"
              >
                <Plus className="w-4 h-4 mr-1.5" /> New Entry
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead className="bg-muted/40 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-3.5 text-left border-r border-b border-border">Period</th>
                  <th className="px-3 py-3.5 border-r border-b border-border text-blue-700 dark:text-blue-300">
                    Total Withdrawal (m³)
                  </th>
                  <th className="px-3 py-3.5 border-r border-b border-border">Groundwater (m³)</th>
                  <th className="px-3 py-3.5 border-r border-b border-border">WASA/Municipal (m³)</th>
                  <th className="px-3 py-3.5 border-r border-b border-border">Rainwater (m³)</th>
                  <th className="px-3 py-3.5 border-r border-b border-border">Recycle (m³)</th>
                  <th className="px-3 py-3.5 border-r border-b border-border text-emerald-700 dark:text-emerald-300">
                    Production (m³)
                  </th>
                  <th className="px-3 py-3.5 border-r border-b border-border">Domestic (m³)</th>
                  <th className="px-3 py-3.5 border-r border-b border-border text-teal-700 dark:text-teal-300">
                    Intensity (L/Kg)
                  </th>
                  <th className="px-3 py-3.5 border-r border-b border-border">Audit Status</th>
                  <th className="px-3 py-3.5 border-b border-border text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-muted-foreground">
                      <Droplets className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                      No water consumption logs found for the selected filter. Click &ldquo;Log Water Data&rdquo; to add a new record.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log: any) => {
                    const tw = log.totalWithdrawal || 0;
                    const gw = log.sources?.groundwater ?? Math.round(tw * 0.65);
                    const warpo = log.sources?.warpoDwasa ?? Math.round(tw * 0.15);
                    const rain = log.sources?.rainWater ?? Math.round(tw * 0.08);
                    const recycle = log.sources?.recycleWater ?? Math.round(tw * 0.09);
                    const intensity = log.waterIntensity || (tw > 0 ? ((tw * 1000) / 50000).toFixed(1) : 48.5);

                    return (
                      <tr key={log._id || log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3.5 text-left font-bold border-r border-border">
                          {log.month} {log.year || 2026}
                        </td>
                        <td className="px-3 py-3.5 font-black text-blue-700 dark:text-blue-300 border-r border-border text-sm">
                          {tw.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border font-semibold text-muted-foreground">
                          {gw.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border text-muted-foreground">
                          {warpo.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border text-cyan-600 font-bold">
                          {rain.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border text-emerald-600 font-bold">
                          {recycle.toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border font-bold text-emerald-700 dark:text-emerald-400">
                          {(log.totalProduction || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border font-semibold text-muted-foreground">
                          {(log.domestic || 0).toLocaleString()}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border font-extrabold text-teal-600">
                          {intensity}
                        </td>
                        <td className="px-3 py-3.5 border-r border-border">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                            Verified
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setDetailsRecord(log)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(log._id || log.id, log.month)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE DATA ENTRY MODAL */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log Water Consumption — Portal" maxWidthClass="max-w-5xl">
        <form onSubmit={handleSaveWaterLog} className="space-y-6 max-h-[78vh] overflow-y-auto pr-1">
          {/* Top metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-2xl border border-border/60">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">Select Month</label>
              <select
                value={formMonth}
                onChange={(e) => setFormMonth(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">Select Year</label>
              <select
                value={formYear}
                onChange={(e) => setFormYear(Number(e.target.value))}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5">Production Goods Type</label>
              <select
                value={formGoodsType}
                onChange={(e) => setFormGoodsType(e.target.value as any)}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
              >
                <option value="denim">Denim (Benchmark: 65 L/kg)</option>
                <option value="fabric_washing">Fabric Washing (Benchmark: 41 L/kg)</option>
                <option value="garment">Garment (Benchmark: 46 L/kg)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Water Sourcing Data Inputs */}
          <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20 space-y-4">
            <h4 className="font-bold text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Droplets className="w-4 h-4" /> 3. Water Sourcing & Withdrawal Inputs (m³)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Groundwater (m³)</label>
                <input
                  type="number"
                  value={formGroundwater}
                  onChange={(e) => setFormGroundwater(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">WARPO / DWASA</label>
                <input
                  type="number"
                  value={formWarpoDwasa}
                  onChange={(e) => setFormWarpoDwasa(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Rain Water (m³)</label>
                <input
                  type="number"
                  value={formRainWater}
                  onChange={(e) => setFormRainWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Recycle Water (m³)</label>
                <input
                  type="number"
                  value={formRecycleWater}
                  onChange={(e) => setFormRecycleWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Surface Water (m³)</label>
                <input
                  type="number"
                  value={formSurfaceWater}
                  onChange={(e) => setFormSurfaceWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Department-Wise Water Consumption Inputs */}
          <div className="bg-teal-500/5 p-5 rounded-2xl border border-teal-500/20 space-y-4">
            <h4 className="font-bold text-sm text-teal-800 dark:text-teal-300 flex items-center gap-2">
              <Layers className="w-4 h-4" /> 4. Department-Wise Consumption & Metrics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Dyeing Process (m³)</label>
                <input
                  type="number"
                  value={formProcessDyeing}
                  onChange={(e) => setFormProcessDyeing(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Washing Process (m³)</label>
                <input
                  type="number"
                  value={formProcessWashing}
                  onChange={(e) => setFormProcessWashing(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Printing Process (m³)</label>
                <input
                  type="number"
                  value={formProcessPrinting}
                  onChange={(e) => setFormProcessPrinting(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Boiler Steam Generate</label>
                <input
                  type="number"
                  value={formBoilerSteam}
                  onChange={(e) => setFormBoilerSteam(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Cooling Purpose Use</label>
                <input
                  type="number"
                  value={formCooling}
                  onChange={(e) => setFormCooling(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Toilet & Canteen (m³)</label>
                <input
                  type="number"
                  value={formToiletCanteen}
                  onChange={(e) => setFormToiletCanteen(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Total Production (Kg)</label>
                <input
                  type="number"
                  value={formProductionKg}
                  onChange={(e) => setFormProductionKg(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Liquor Ratio</label>
                <input
                  type="text"
                  value={formLiquorRatio}
                  onChange={(e) => setFormLiquorRatio(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Circularity & Water Savings Initiatives Inputs */}
          <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 space-y-4">
            <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> 5. Circularity & Savings Initiatives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">RO Recycling (m³/mo to Dyeing)</label>
                <input
                  type="number"
                  value={formRoRecycled}
                  onChange={(e) => setFormRoRecycled(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Rainwater Harvested (m³/mo)</label>
                <input
                  type="number"
                  value={formRainHarvested}
                  onChange={(e) => setFormRainHarvested(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Low Liquor Savings (Liters/Kg)</label>
                <input
                  type="number"
                  value={formLowLiquorSavings}
                  onChange={(e) => setFormLowLiquorSavings(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 6 & 7: ETP Water Balance & Compliance */}
          <div className="bg-muted/20 p-5 rounded-2xl border border-border/60 space-y-4">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-600" /> 6 & 7. ETP Water Balance & Compliance
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">ETP Inlet Water (m³)</label>
                <input
                  type="number"
                  value={formInletWater}
                  onChange={(e) => setFormInletWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">ETP Outlet Water (m³)</label>
                <input
                  type="number"
                  value={formOutletWater}
                  onChange={(e) => setFormOutletWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Sub-meter Coverage (%)</label>
                <input
                  type="number"
                  value={formSubmeteringCoverage}
                  onChange={(e) => setFormSubmeteringCoverage(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Higg FEM Score</label>
                <input
                  type="number"
                  value={formHiggScore}
                  onChange={(e) => setFormHiggScore(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(false)}
              className="px-5 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-50"
            >
              {isCreating ? "Saving..." : "Save Water Log"}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAILS VIEW MODAL */}
      {detailsRecord && (
        <Modal isOpen={Boolean(detailsRecord)} onClose={() => setDetailsRecord(null)} title={`Water Record Details — ${detailsRecord.month} ${detailsRecord.year || 2026}`}>
          <div className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-2xl">
              <div>
                <span className="text-muted-foreground">Total Withdrawal:</span>
                <p className="text-base font-extrabold text-blue-600">{detailsRecord.totalWithdrawal} m³</p>
              </div>
              <div>
                <span className="text-muted-foreground">Water Intensity:</span>
                <p className="text-base font-extrabold text-teal-600">{detailsRecord.waterIntensity || "48.5"} L/Kg</p>
              </div>
            </div>

            <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
              <h5 className="font-bold text-foreground">Sourcing Breakdown:</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <p>Groundwater: <span className="font-bold">{detailsRecord.sources?.groundwater || Math.round(detailsRecord.totalWithdrawal * 0.65)} m³</span></p>
                <p>Municipal/WASA: <span className="font-bold">{detailsRecord.sources?.warpoDwasa || Math.round(detailsRecord.totalWithdrawal * 0.15)} m³</span></p>
                <p>Rain Water: <span className="font-bold">{detailsRecord.sources?.rainWater || Math.round(detailsRecord.totalWithdrawal * 0.08)} m³</span></p>
                <p>Recycle Water: <span className="font-bold">{detailsRecord.sources?.recycleWater || Math.round(detailsRecord.totalWithdrawal * 0.09)} m³</span></p>
                <p>Surface Water: <span className="font-bold">{detailsRecord.sources?.surfaceWater || Math.round(detailsRecord.totalWithdrawal * 0.03)} m³</span></p>
              </div>
            </div>

            <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
              <h5 className="font-bold text-foreground">Circularity Initiatives:</h5>
              <p>RO Recycle Reused: <span className="font-bold text-emerald-600">{detailsRecord.circularity?.roRecycledVolume || 2500} m³/mo (passes back to dyeing)</span></p>
              <p>Rainwater Harvested: <span className="font-bold text-cyan-600">{detailsRecord.circularity?.rainwaterHarvested || 1100} m³/mo (toilet & gardening)</span></p>
              <p>Low Liquor Savings: <span className="font-bold text-blue-600">{detailsRecord.circularity?.lowLiquorSavings || 12} L/kg (18% reduction)</span></p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailsRecord(null)}
                className="px-5 py-2 bg-teal-600 text-white rounded-xl font-bold"
              >
                Close Details
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
