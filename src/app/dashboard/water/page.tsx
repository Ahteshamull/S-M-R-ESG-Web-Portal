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
  AlertCircle,
  AlertTriangle
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
  useDeleteWaterLogMutation,
  useGetWaterDepartmentTelemetryQuery
} from "@/lib/redux/slices/waterApi";

const SOURCING_COLORS = ["#3b82f6", "#0ea5e9", "#06b6d4", "#10b981", "#8b5cf6"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = [2030, 2029, 2028, 2027, 2026, 2025, 2024];

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

  // Process Water & Industrial Dashboard selection (Section 4)
  const [selectedProcessType, setSelectedProcessType] = useState<string>("All Departments");

  // Redux Department Telemetry API
  const { data: departmentTelemetry, isLoading: isTelemetryLoading } = useGetWaterDepartmentTelemetryQuery({
    area: selectedProcessType,
    year: selectedYear !== "All" ? selectedYear : undefined,
    month: selectedMonth !== "All" ? selectedMonth : undefined,
  });
  const [selectedGoodsType, setSelectedGoodsType] = useState<"denim" | "fabric_washing" | "garment">("denim");
  const [selectedFabricFocus, setSelectedFabricFocus] = useState<string>("All");
  const [isAlertDismissed, setIsAlertDismissed] = useState<boolean>(false);

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState<any | null>(null);

  // Process Losses Parameter
  const [processLossesY, setProcessLossesY] = useState<number>(65.45);

  // Form State for Log Water Entry Modal (Number-Wise Portal)
  // Section 1: Period & Production Parameters
  const [formMonth, setFormMonth] = useState<string>("January");
  const [formYear, setFormYear] = useState<number>(2026);
  const [formGoodsType, setFormGoodsType] = useState<"denim" | "fabric_washing" | "garment">("denim");
  const [formProductionKg, setFormProductionKg] = useState<number | "">("");
  const [formLiquorRatio, setFormLiquorRatio] = useState<string>("1:7");

  // Section 3: Water Sourcing & Withdrawal Inputs (m³)
  const [formGroundwater, setFormGroundwater] = useState<number | "">("");
  const [formWarpoDwasa, setFormWarpoDwasa] = useState<number | "">("");
  const [formRainWater, setFormRainWater] = useState<number | "">("");
  const [formRecycleWater, setFormRecycleWater] = useState<number | "">("");
  const [formSurfaceWater, setFormSurfaceWater] = useState<number | "">("");

  // Section 4: Department-Wise Water Consumption Inputs (m³)
  const [formProcessDyeing, setFormProcessDyeing] = useState<number | "">("");
  const [formProcessWashing, setFormProcessWashing] = useState<number | "">("");
  const [formProcessPrinting, setFormProcessPrinting] = useState<number | "">("");
  const [formBoilerSteam, setFormBoilerSteam] = useState<number | "">("");
  const [formCooling, setFormCooling] = useState<number | "">("");
  const [formGarmentsSteamBoiler, setFormGarmentsSteamBoiler] = useState<number | "">("");
  const [formDomesticDrinking, setFormDomesticDrinking] = useState<number | "">("");
  const [formDomesticWashrooms, setFormDomesticWashrooms] = useState<number | "">("");
  const [formDomesticCanteen, setFormDomesticCanteen] = useState<number | "">("");

  // Section 5: Circularity & Savings Initiatives Inputs
  const [formRoRecycled, setFormRoRecycled] = useState<number | "">("");
  const [formRainHarvested, setFormRainHarvested] = useState<number | "">("");
  const [formLowLiquorSavings, setFormLowLiquorSavings] = useState<number | "">("");

  // Section 6: Regulatory Compliance Matrix Inputs
  const [formSubmeteringCoverage, setFormSubmeteringCoverage] = useState<number | "">("");
  const [formHiggScore, setFormHiggScore] = useState<number | "">("");
  const [formGroundwaterLicenseStatus, setFormGroundwaterLicenseStatus] = useState<"Active" | "Pending" | "Expired">("Active");

  // Section 7: ETP Water Mass Balance & Efficiency (m³)
  const [formInletWater, setFormInletWater] = useState<number | "">("");
  const [formOutletWater, setFormOutletWater] = useState<number | "">("");
  const [formProcessLossesY, setFormProcessLossesY] = useState<number | "">("");

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
    let boiler = 0, cooling = 0, dyeing = 0, washing = 0, printing = 0;
    let garmentsSteam = 0, drinking = 0, washrooms = 0, canteen = 0;
    filteredLogs.forEach((l: any) => {
      boiler += Number(l.departments?.utilityBoilerSteam) || 0;
      cooling += Number(l.departments?.utilityCooling) || 0;
      dyeing += Number(l.departments?.processDyeing) || 0;
      washing += Number(l.departments?.processWashing) || 0;
      printing += Number(l.departments?.processPrinting) || 0;
      garmentsSteam += Number(l.departments?.garmentsSteamBoiler) || 0;
      drinking += Number(l.departments?.domesticDrinking) || (Number(l.departments?.domesticDiningDrinking) || 0);
      washrooms += Number(l.departments?.domesticWashrooms) || (Number(l.departments?.domesticToiletCanteen) || 0);
      canteen += Number(l.departments?.domesticCanteen) || 0;
    });
    const sanitation = drinking + washrooms + canteen;
    const garmentsTotal = garmentsSteam + sanitation;
    return { boiler, cooling, sanitation, dyeing, washing, printing, garmentsSteam, drinking, washrooms, canteen, garmentsTotal };
  }, [filteredLogs]);

  // Selected Water Use Area Volume
  const selectedAreaVolume = useMemo(() => {
    switch (selectedProcessType) {
      case "Dyeing": return deptSummary.dyeing;
      case "Washing": return deptSummary.washing;
      case "Printing": return deptSummary.printing;
      case "Utility": return deptSummary.boiler + deptSummary.cooling;
      case "Garments (Cut to Pack)":
      case "Garments":
      case "Cut to Pack": return deptSummary.garmentsTotal;
      default: return kpis.totalWithdrawal;
    }
  }, [selectedProcessType, deptSummary, kpis.totalWithdrawal]);

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
        return { excellent: 35, good: 23, title: "Denim", current: kpis.waterIntensity };
      case "garment":
        return { excellent: 46, good: 63, title: "Garment", current: kpis.waterIntensity };
    }
  }, [selectedGoodsType, kpis.waterIntensity]);

  const goodsRatioRating = useMemo(() => {
    const cur = goodsRatioBenchmark.current;
    const { excellent, good } = goodsRatioBenchmark;
    const targetLimit = Math.max(excellent, good);
    const bestLimit = Math.min(excellent, good);
    const isBreached = cur > targetLimit && cur > 0;
    const excess = isBreached ? Number((cur - targetLimit).toFixed(1)) : 0;

    if (cur === 0) {
      return { 
        label: "No Logged Production", 
        color: "muted", 
        bg: "bg-muted/30 text-muted-foreground border-border", 
        isBreached: false, 
        excess: 0 
      };
    }
    if (cur <= bestLimit) {
      return { 
        label: "Excellent Efficiency (Optimal)", 
        color: "emerald", 
        bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", 
        isBreached: false, 
        excess: 0 
      };
    }
    if (cur <= targetLimit) {
      return { 
        label: "Good Benchmark Standard", 
        color: "blue", 
        bg: "bg-blue-500/10 text-blue-600 border-blue-500/30", 
        isBreached: false, 
        excess: 0 
      };
    }
    return { 
      label: "⚠️ Standards Fall Alert (High Consumption)", 
      color: "rose", 
      bg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40", 
      isBreached: true, 
      excess 
    };
  }, [goodsRatioBenchmark]);

  // Section 4: FiberWater Portal Industrial Telemetry Memos & Redux Sync
  const dailyTrendData = useMemo(() => [
    { day: "1", value: 950 },
    { day: "3", value: 820 },
    { day: "5", value: 750 },
    { day: "7", value: 1100 },
    { day: "9", value: 600 },
    { day: "10", value: 1050 },
    { day: "12", value: 850 },
    { day: "13", value: 700 },
    { day: "15", value: 980 },
    { day: "17", value: 680 },
    { day: "18", value: 880 },
    { day: "20", value: 1250 },
    { day: "22", value: 720 },
    { day: "24", value: 890 },
    { day: "25", value: 1020 },
    { day: "27", value: 790 },
    { day: "28", value: 1100 },
    { day: "29", value: 960 },
    { day: "30", value: 680 },
  ], []);

  const fabricPerformanceList = useMemo(() => {
    const list = [
      { fabric: "100% Cotton", actual: 95, target: 95 },
      { fabric: "100% Polyester", actual: 95, target: 95 },
      { fabric: "CVC Blend", actual: 95, target: 95 },
      { fabric: "Denim", actual: selectedGoodsType === "denim" && kpis.waterIntensity > 0 ? Math.round(kpis.waterIntensity) : 35, target: 35 },
      { fabric: "Fabric Washing", actual: selectedGoodsType === "fabric_washing" && kpis.waterIntensity > 0 ? Math.round(kpis.waterIntensity) : 41, target: 41 },
      { fabric: "Garments", actual: selectedGoodsType === "garment" && kpis.waterIntensity > 0 ? Math.round(kpis.waterIntensity) : 46, target: 46 },
      { fabric: "Viscose", actual: 82, target: 80 },
      { fabric: "Nylon", actual: 78, target: 75 },
    ];
    if (selectedFabricFocus === "All") return list;
    return list.filter((f) => f.fabric.toLowerCase().includes(selectedFabricFocus.toLowerCase()));
  }, [selectedFabricFocus, selectedGoodsType, kpis.waterIntensity]);

  const etpComparisonData = useMemo(() => [
    { name: "Cotton", inflow: 135, treated: 108 },
    { name: "Polyester", inflow: 102, treated: 82 },
    { name: "CVC Blend", inflow: 65, treated: 91 },
    { name: "Denim", inflow: 118, treated: 85 },
    { name: "Viscose", inflow: 78, treated: 78 },
    { name: "Nylon", inflow: 68, treated: 50 },
  ], []);

  const liveSensorReadings = useMemo(() => {
    switch (selectedProcessType) {
      case "Dyeing":
        return [
          { id: "D-01 (Jet 1)", flow: 22.5, temp: 85.0, ph: 6.8, operator: "Batch #101", isWarningTemp: false, isWarningPh: false, status: "OPTIMAL" },
          { id: "D-02 (Jet 2)", flow: 28.0, temp: 132.5, ph: 9.4, operator: "Batch #102", isWarningTemp: true, isWarningPh: true, status: "EXCESS" },
          { id: "D-03 (Jet 3)", flow: 19.0, temp: 65.0, ph: 7.2, operator: "Batch #103", isWarningTemp: false, isWarningPh: false, status: "OPTIMAL" },
          { id: "D-04 (Winch)", flow: 16.5, temp: 45.0, ph: 6.5, operator: "Batch #104", isWarningTemp: false, isWarningPh: false, status: "STANDBY" },
        ];
      case "Washing":
        return [
          { id: "W-01", flow: 25.0, temp: 31.0, ph: 7.8, operator: "B. Hossain", isWarningTemp: true, isWarningPh: false, status: "RUNNING" },
          { id: "W-02", flow: 14.0, temp: 28.5, ph: 7.0, operator: "R. Islam", isWarningTemp: false, isWarningPh: false, status: "OPTIMAL" },
          { id: "W-03", flow: 28.0, temp: 29.0, ph: 8.6, operator: "T. Ahmed", isWarningTemp: false, isWarningPh: true, status: "ELEVATED" },
          { id: "W-04", flow: 21.0, temp: 27.0, ph: 7.4, operator: "J. Uddin", isWarningTemp: false, isWarningPh: false, status: "OPTIMAL" },
        ];
      case "Printing":
        return [
          { id: "P-01 (Rotary)", flow: 12.0, temp: 26.0, ph: 7.1, operator: "Screen #1", isWarningTemp: false, isWarningPh: false, status: "ACTIVE" },
          { id: "P-02 (Flatbed)", flow: 15.5, temp: 33.5, ph: 6.2, operator: "Screen #2", isWarningTemp: true, isWarningPh: true, status: "MAINTENANCE" },
          { id: "P-03 (Kitchen)", flow: 9.0, temp: 27.0, ph: 7.3, operator: "Color Disp.", isWarningTemp: false, isWarningPh: false, status: "OPTIMAL" },
          { id: "P-04 (Blanket)", flow: 11.5, temp: 28.0, ph: 7.0, operator: "Auto Wash", isWarningTemp: false, isWarningPh: false, status: "RECIRC" },
        ];
      case "Utility":
        return [
          { id: "U-01 (Boiler 1)", flow: 45.0, temp: 95.0, ph: 8.2, operator: "Steam Feed", isWarningTemp: true, isWarningPh: false, status: "HIGH STEAM" },
          { id: "U-02 (Boiler 2)", flow: 38.0, temp: 88.5, ph: 7.9, operator: "Condensate", isWarningTemp: false, isWarningPh: false, status: "OPTIMAL" },
          { id: "U-03 (Cooling)", flow: 20.0, temp: 25.0, ph: 7.0, operator: "Loop A", isWarningTemp: false, isWarningPh: false, status: "ACTIVE" },
          { id: "U-04 (Softener)", flow: 18.0, temp: 26.0, ph: 6.9, operator: "Brine Regen", isWarningTemp: false, isWarningPh: false, status: "PASS" },
        ];
      default:
        return [
          { id: "M-01", flow: 20.0, temp: 27.5, ph: 6.3, operator: "Sensor 1", isWarningTemp: false, isWarningPh: false, status: "ACTIVE" },
          { id: "M-02", flow: 10.0, temp: 33.0, ph: 8.7, operator: "Sensor 2", isWarningTemp: true, isWarningPh: true, status: "MONITOR" },
          { id: "M-03", flow: 30.0, temp: 31.0, ph: 7.5, operator: "Sensor 3", isWarningTemp: false, isWarningPh: false, status: "OPTIMAL" },
          { id: "M-04", flow: 20.0, temp: 27.0, ph: 6.5, operator: "Sensor 4", isWarningTemp: false, isWarningPh: false, status: "NORMAL" },
        ];
    }
  }, [selectedProcessType]);

  const capacityUsagePercent = useMemo(() => {
    if (kpis.totalWithdrawal > 0 && selectedAreaVolume > 0) {
      return Math.round((selectedAreaVolume / kpis.totalWithdrawal) * 100);
    }
    if (selectedProcessType === "All Departments") {
      return kpis.totalWithdrawal > 0 ? 100 : 0;
    }
    return 0;
  }, [selectedProcessType, selectedAreaVolume, kpis.totalWithdrawal]);

  const displayTotalLiters = useMemo(() => {
    if (selectedProcessType === "All Departments") {
      return kpis.totalWithdrawal > 0 ? (kpis.totalWithdrawal * 1000).toLocaleString() : "0";
    }
    return selectedAreaVolume > 0 ? (selectedAreaVolume * 1000).toLocaleString() : "0";
  }, [selectedProcessType, selectedAreaVolume, kpis.totalWithdrawal]);

  // Active Telemetry Bound Data (from Backend or Fallback)
  const activeTelemetry = useMemo(() => {
    if (departmentTelemetry) return departmentTelemetry;

    const baseUsage = selectedAreaVolume > 0 ? selectedAreaVolume * 1000 : 150000;

    if (selectedProcessType === "Garments (Cut to Pack)" || selectedProcessType === "Garments" || selectedProcessType === "Cut to Pack") {
      return {
        department: "Garments (Cut to Pack)",
        title: "4. Garments & Cut to Pack Resource Management Portal",
        subtitle: "1. Production & Finishing (Steam Boiler) and 2. Domestic & Sanitation (Drinking, Washrooms, Canteen)",
        totalUsageLiters: baseUsage > 0 ? baseUsage : 40000,
        capacityPercent: 7,
        alertMessage: "NOTICE: Steam boiler lines and workers domestic sanitation & RO drinking lines are fully operational and verified.",
        breakdownTags: [
          { name: "Steam Boiler (Finishing)", percentage: 45, color: "#8b5cf6" },
          { name: "Workers' Drinking Water", percentage: 15, color: "#0ea5e9" },
          { name: "Washroom Sanitation", percentage: 25, color: "#10b981" },
          { name: "Canteen Services", percentage: 15, color: "#f59e0b" },
        ],
        trendData: dailyTrendData.map(d => ({ ...d, value: Math.round(d.value * 0.07) })),
        comparisonTitle: "1. Production & Finishing vs. 2. Domestic & Sanitation (m³)",
        comparisonSubtitle: "Steam boiler consumption, workers' drinking water, washrooms, and canteen audits",
        comparisonData: [
          { name: "Steam Boiler (Finishing)", actual: deptSummary.garmentsSteam, target: deptSummary.garmentsSteam > 0 ? Math.round(deptSummary.garmentsSteam * 0.9) : 0, unit: "m³" },
          { name: "Workers' Drinking Water", actual: deptSummary.drinking, target: deptSummary.drinking, unit: "m³" },
          { name: "Washroom Sanitation", actual: deptSummary.washrooms, target: deptSummary.washrooms > 0 ? Math.round(deptSummary.washrooms * 0.9) : 0, unit: "m³" },
          { name: "Canteen Services", actual: deptSummary.canteen, target: deptSummary.canteen, unit: "m³" },
        ],
        effluentTitle: "Domestic & Sanitation Drainage Discharge",
        effluentBadge: "100% Safe Discharge",
        effluentData: [
          { name: "Boiler Blowdown", inflow: Math.round(deptSummary.garmentsSteam * 0.6), treated: Math.round(deptSummary.garmentsSteam * 0.6) },
          { name: "Drinking Water RO", inflow: deptSummary.drinking, treated: deptSummary.drinking },
          { name: "Washrooms Line", inflow: deptSummary.washrooms, treated: Math.round(deptSummary.washrooms * 0.95) },
          { name: "Canteen Wash", inflow: deptSummary.canteen, treated: deptSummary.canteen },
        ],
        sensorTitle: "Live Sub-Meters & IoT Telemetry: Garments (Cut to Pack)",
        sensorReadings: [
          { id: "GCP-01 (Steam Boiler)", flow: deptSummary.garmentsSteam > 0 ? Number((deptSummary.garmentsSteam / 30).toFixed(1)) : 0, temp: deptSummary.garmentsSteam > 0 ? 92.0 : 0, ph: 7.8, operator: "1. Production & Finishing", status: deptSummary.garmentsSteam > 0 ? "ACTIVE" : "IDLE", extraMetric: "Steam Boiler" },
          { id: "GCP-02 (Drinking Water RO)", flow: deptSummary.drinking > 0 ? Number((deptSummary.drinking / 30).toFixed(1)) : 0, temp: deptSummary.drinking > 0 ? 21.5 : 0, ph: 7.1, operator: "2. Drinking Water RO", status: deptSummary.drinking > 0 ? "OPTIMAL" : "IDLE", extraMetric: "TDS: 38 ppm" },
          { id: "GCP-03 (Washroom Flush)", flow: deptSummary.washrooms > 0 ? Number((deptSummary.washrooms / 30).toFixed(1)) : 0, temp: deptSummary.washrooms > 0 ? 23.0 : 0, ph: 7.3, operator: "2. Washroom Sanitation", status: deptSummary.washrooms > 0 ? "PASS" : "IDLE", extraMetric: "Washrooms" },
          { id: "GCP-04 (Canteen Services)", flow: deptSummary.canteen > 0 ? Number((deptSummary.canteen / 30).toFixed(1)) : 0, temp: deptSummary.canteen > 0 ? 22.5 : 0, ph: 7.0, operator: "2. Canteen Services", status: deptSummary.canteen > 0 ? "OPTIMAL" : "IDLE", extraMetric: "Canteen" },
        ],
        extraCards: [
          { title: "1. Production & Finishing", value: `${deptSummary.garmentsSteam} m³ Logged`, subtitle: "Garments ironing, finishing tunnels and packaging steam line", badge: "Production" },
          { title: "2. Domestic & Sanitation", value: `${deptSummary.drinking + deptSummary.washrooms} m³ Logged`, subtitle: "Safe RO drinking water for workers and hygiene sanitation lines", badge: "Sanitation" },
          { title: "Canteen Services", value: `${deptSummary.canteen} m³ Logged`, subtitle: "Daily hygienic cooking, kitchen and washing facilities water", badge: "Canteen" },
        ]
      };
    }
    return {
      department: selectedProcessType,
      title: selectedProcessType === "Washing" 
        ? "4. Washing Department Water Consumption & Telemetry" 
        : `4. ${selectedProcessType} Department Water Consumption & Telemetry`,
      subtitle: selectedProcessType === "Washing"
        ? "FiberWater Industrial Portal: Flow Monitoring, Fabric Benchmarks & Live IoT Sensors"
        : `${selectedProcessType} Industrial Telemetry & IoT Sensor Diagnostics`,
      totalUsageLiters: baseUsage,
      capacityPercent: capacityUsagePercent,
      alertMessage: undefined,
      breakdownTags: [
        { name: "LINE 01", percentage: 40, color: "#3b82f6" },
        { name: "LINE 02", percentage: 35, color: "#10b981" },
        { name: "LINE 03", percentage: 25, color: "#f59e0b" },
      ],
      trendData: dailyTrendData,
      comparisonTitle: selectedProcessType === "Washing" ? "WASHING FABRIC CONSUMPTION BENCHMARKS (L/kg)" : `${selectedProcessType.toUpperCase()} PERFORMANCE BENCHMARKS`,
      comparisonSubtitle: "Standard benchmarks vs actual industrial performance",
      comparisonData: fabricPerformanceList.map(f => ({ name: f.fabric, actual: f.actual, target: f.target, unit: "L/kg" })),
      effluentTitle: "WASTEWATER MANAGEMENT (WTP/ETP)",
      effluentBadge: "REUSE RATE: 35%",
      effluentData: etpComparisonData,
      sensorTitle: "LIVE SENSOR READINGS",
      sensorReadings: liveSensorReadings,
      extraCards: []
    };
  }, [departmentTelemetry, selectedProcessType, selectedAreaVolume, capacityUsagePercent, dailyTrendData, fabricPerformanceList, etpComparisonData, liveSensorReadings]);

  // Active Comparison Data filtered by focus fabric if applicable
  const activeComparisonData = useMemo(() => {
    const list = activeTelemetry.comparisonData || [];
    const normalized = list.map((item: any) => ({
      name: item.name || item.fabric || "Metric",
      actual: item.actual,
      target: item.target,
      unit: item.unit || "L/kg",
    }));
    if (selectedProcessType === "Washing" && selectedFabricFocus !== "All") {
      const filtered = normalized.filter((item: any) =>
        item.name.toLowerCase().includes(selectedFabricFocus.toLowerCase())
      );
      return filtered.length > 0 ? filtered : normalized;
    }
    return normalized;
  }, [activeTelemetry.comparisonData, selectedProcessType, selectedFabricFocus]);

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
    const garmentsSteam = Number(formGarmentsSteamBoiler) || 0;
    const drinking = Number(formDomesticDrinking) || 0;
    const washrooms = Number(formDomesticWashrooms) || 0;
    const canteen = Number(formDomesticCanteen) || 0;

    const totalProd = dyeing + washing + printing + boiler + cooling + garmentsSteam;
    const totalDomestic = drinking + washrooms + canteen;

    const prodKg = Number(formProductionKg) || 0;
    const calculatedIntensity = prodKg > 0 ? Number(((totalWith * 1000) / prodKg).toFixed(2)) : 0;
    const calculatedGwRatio = totalWith > 0 ? Number(((gw / totalWith) * 100).toFixed(2)) : 0;
    const calculatedAltRatio = totalWith > 0 ? Number((((rain + recycle) / totalWith) * 100).toFixed(2)) : 0;
    const inletW = Number(formInletWater) || 0;
    const outletW = Number(formOutletWater) || 0;
    const calculatedLosses = formProcessLossesY !== "" ? Number(formProcessLossesY) : Math.max(0, Number((totalWith - inletW).toFixed(2)));

    const payload = {
      month: formMonth,
      year: Number(formYear),
      totalWithdrawal: totalWith,
      totalProduction: totalProd,
      domestic: totalDomestic,
      inletWater: inletW,
      outletWater: outletW,
      processLossesY: calculatedLosses,
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
        garmentsSteamBoiler: garmentsSteam,
        domesticDrinking: drinking,
        domesticWashrooms: washrooms,
        domesticCanteen: canteen,
        domesticToiletCanteen: washrooms + canteen,
        domesticDiningDrinking: drinking,
      },
      circularity: {
        roRecycledVolume: Number(formRoRecycled) || 0,
        rainwaterHarvested: Number(formRainHarvested) || 0,
        lowLiquorSavings: Number(formLowLiquorSavings) || 0,
        lowLiquorReductionPercent: Number(formLowLiquorSavings) ? 18 : 0,
      },
      regulatory: {
        groundwaterLicenseStatus: formGroundwaterLicenseStatus,
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
                className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
                style={{ colorScheme: "dark" }}
              >
                <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Years</option>
                {YEARS.map(y => (
                  <option key={y} value={y} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-2 rounded-xl border border-border/80 shadow-sm text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-foreground focus:outline-none cursor-pointer font-bold"
                style={{ colorScheme: "dark" }}
              >
                <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Months (YTD)</option>
                {MONTHS.map(m => (
                  <option key={m} value={m} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">
                    {m}
                  </option>
                ))}
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
                <option value="Washing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Washing</option>
                <option value="Dyeing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Dyeing</option>
                <option value="Printing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Printing</option>
                <option value="Utility" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Utility</option>
                <option value="Garments (Cut to Pack)" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Garments (Cut to Pack)</option>
              </select>
            </div>

            {/* Action */}
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

          {/* 4. Department-Wise Water Consumption & Industrial Monitoring (Section 4) */}
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
                {/* Department Selector */}
                <div className="flex items-center gap-2 bg-background border border-border/80 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
                  <span className="text-muted-foreground">Water Use Area:</span>
                  <select
                    value={selectedProcessType}
                    onChange={(e) => setSelectedProcessType(e.target.value)}
                    className="bg-transparent font-bold text-teal-600 focus:outline-none cursor-pointer"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="All Departments" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Departments (Consolidated)</option>
                    <option value="Dyeing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Dyeing Department</option>
                    <option value="Washing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Washing Department</option>
                    <option value="Printing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Printing Department</option>
                    <option value="Utility" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Utility Department</option>
                    <option value="Garments (Cut to Pack)" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Garments (Cut to Pack) Department</option>
                  </select>
                </div>

                {/* Fabric Benchmark Focus Dropdown (primarily active for Washing / All) */}
                {selectedProcessType === "Washing" || selectedProcessType === "All Departments" ? (
                  <div className="flex items-center gap-2 bg-background border border-border/80 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
                    <span className="text-muted-foreground">Focus Fabric:</span>
                    <select
                      value={selectedFabricFocus}
                      onChange={(e) => setSelectedFabricFocus(e.target.value)}
                      className="bg-transparent font-bold text-blue-600 dark:text-blue-400 focus:outline-none cursor-pointer"
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="All" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">All Fabrics (Comparison)</option>
                      <option value="Cotton" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">100% Cotton</option>
                      <option value="Polyester" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">100% Polyester</option>
                      <option value="CVC" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">CVC Blend</option>
                      <option value="Denim" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Denim</option>
                      <option value="Viscose" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Viscose</option>
                      <option value="Nylon" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Nylon</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-background border border-border/80 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold">
                    <span className="text-muted-foreground">Active Status:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Telemetry Online
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Alert Banner (Top Warning Strip) */}
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

            {/* 3-Column Modern FiberWater Industrial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
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
                        {/* Background Arc */}
                        <path
                          d="M 20 100 A 80 80 0 0 1 180 100"
                          fill="none"
                          stroke="currentColor"
                          className="text-muted/20"
                          strokeWidth="16"
                          strokeLinecap="round"
                        />
                        {/* Active Progress Arc */}
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
                        {/* Needle Indicator */}
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
                        activeTelemetry.breakdownTags.map((tag: any, idx: number) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/40 text-foreground ${
                              activeTelemetry.breakdownTags.length % 2 !== 0 && idx === activeTelemetry.breakdownTags.length - 1 ? "col-span-2 justify-center" : ""
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tag.color || "#0ea5e9" }} />
                            <span className="truncate">{tag.name} ({tag.percentage}%)</span>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            <span>DYEING (55%)</span>
                          </div>
                          <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <span>WASHING (20%)</span>
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
                      <BarChart data={activeTelemetry.trendData || dailyTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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

              {/* Column 2: COMPARISON & PERFORMANCE BENCHMARKS */}
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

                {/* Horizontal Dual Bar Chart (Actual vs Target) */}
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

                {/* Benchmark Certification Note / Department Diagnostics */}
                {selectedProcessType === "Washing" ? (
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Denim Benchmark:</span>
                      <span className="text-blue-600 dark:text-blue-400">Exc: 35 L/kg | Good: 23 L/kg</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Fabric Washing:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Exc: 41 L/kg | Good: 56 L/kg</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Garments Standard:</span>
                      <span className="text-purple-600 dark:text-purple-400">Exc: 46 L/kg | Good: 63 L/kg</span>
                    </div>
                  </div>
                ) : selectedProcessType === "Dyeing" ? (
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Liquor Ratio Target:</span>
                      <span className="text-blue-600 dark:text-blue-400">Standard 1:7 | Eco Jet: 1:5.5</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">pH Tolerance Range:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">4.5 - 9.4 (Reactive / Disperse)</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-purple-600 dark:text-purple-400">92% within water budget</span>
                    </div>
                  </div>
                ) : selectedProcessType === "Printing" ? (
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Screen Reclaim Recovery:</span>
                      <span className="text-blue-600 dark:text-blue-400">92% Reclaimed to ETP</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Nozzle Wash Pressure:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">4.2 bar (High Efficiency)</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Blanket Washer Feed:</span>
                      <span className="text-purple-600 dark:text-purple-400">Recirculated Loop Active</span>
                    </div>
                  </div>
                ) : selectedProcessType === "Utility" ? (
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Condensate Return Rate:</span>
                      <span className="text-blue-600 dark:text-blue-400">78% (Target: ≥ 75%)</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Blowdown Heat Recovery:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">85°C Preheated Feed</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Water Softener Hardness:</span>
                      <span className="text-purple-600 dark:text-purple-400">&lt; 5 ppm CaCO3</span>
                    </div>
                  </div>
                ) : (selectedProcessType === "Garments (Cut to Pack)" || selectedProcessType === "Garments" || selectedProcessType === "Cut to Pack") ? (
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-xl text-xs space-y-2">
                    <div className="space-y-1">
                      <div className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase">
                        1. Production & Finishing:
                      </div>
                      <div className="flex justify-between font-bold pl-2 border-l-2 border-purple-500/40">
                        <span className="text-muted-foreground">• Steam Boiler Consumption:</span>
                        <span className="text-purple-600 dark:text-purple-400">{deptSummary.garmentsSteam} m³ (Tunnel & Pressing)</span>
                      </div>
                    </div>
                    <div className="space-y-1 pt-1 border-t border-border/30">
                      <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                        2. Domestic & Sanitation:
                      </div>
                      <div className="flex justify-between font-bold pl-2 border-l-2 border-emerald-500/40">
                        <span className="text-muted-foreground">• Workers' Drinking Water:</span>
                        <span className="text-blue-600 dark:text-blue-400">{deptSummary.drinking} m³ (Pure RO Filtered)</span>
                      </div>
                      <div className="flex justify-between font-bold pl-2 border-l-2 border-emerald-500/40">
                        <span className="text-muted-foreground">• Washroom Sanitation:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{deptSummary.washrooms} m³ (Hygiene Flushing)</span>
                      </div>
                      <div className="flex justify-between font-bold pl-2 border-l-2 border-emerald-500/40">
                        <span className="text-muted-foreground">• Canteen Services:</span>
                        <span className="text-amber-600 dark:text-amber-400">{deptSummary.canteen} m³ (Cooking & Washing)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Higg FEM 4.0 Score:</span>
                      <span className="text-blue-600 dark:text-blue-400">88 / 100 Verified</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">ZDHC Gateway Level:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Level 3 Certified</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-muted-foreground">Water Circularity Index:</span>
                      <span className="text-purple-600 dark:text-purple-400">35% Closed Loop</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Column 3: EFFLUENT / PROCESS BALANCE & LIVE SENSOR READINGS */}
              <div className="space-y-6">
                {/* Wastewater Management / Process Mass Balance */}
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
                      <BarChart data={activeTelemetry.effluentData || etpComparisonData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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

                {/* Live Sensor Readings Table with Highlighted Warning Cells */}
                <div className="bg-background/80 rounded-2xl border border-border/70 p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <span>{activeTelemetry.sensorTitle}</span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
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
                        {activeTelemetry.sensorReadings.map((sensor: any) => (
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

            {/* Department Specific Extra KPI Highlights (from Backend) */}
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
                    const tw = Number(log.totalWithdrawal) || 0;
                    const gw = Number(log.sources?.groundwater) || 0;
                    const warpo = Number(log.sources?.warpoDwasa) || 0;
                    const rain = Number(log.sources?.rainWater) || 0;
                    const recycle = Number(log.sources?.recycleWater) || 0;
                    const intensity = log.waterIntensity ?? (log.productionKg > 0 ? ((tw * 1000) / log.productionKg).toFixed(1) : "0.0");

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

      {/* COMPREHENSIVE DATA ENTRY MODAL (NUMBER-WISE SECTIONS) */}
      <Modal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} title="Log Water Consumption — Portal" maxWidthClass="max-w-5xl">
        <form onSubmit={handleSaveWaterLog} className="space-y-6 max-h-[78vh] overflow-y-auto pr-2">
          {/* Section 1: Period & Production Parameters */}
          <div className="bg-muted/30 p-5 rounded-2xl border border-border/60 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                Period &amp; Production Parameters
              </h4>
              <span className="text-[11px] font-semibold text-muted-foreground">General Production Info</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Select Month</label>
                <select
                  value={formMonth}
                  onChange={(e) => setFormMonth(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  {MONTHS.map(m => <option key={m} value={m} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Select Year</label>
                <select
                  value={formYear}
                  onChange={(e) => setFormYear(Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  {YEARS.map(y => <option key={y} value={y} className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Goods Type</label>
                <select
                  value={formGoodsType}
                  onChange={(e) => setFormGoodsType(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="denim" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Denim (Target: &le; 35 L/kg)</option>
                  <option value="fabric_washing" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Fabric Washing (&le; 41 L/kg)</option>
                  <option value="garment" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Garment (&le; 46 L/kg)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Production (Kg)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 50000"
                  value={formProductionKg}
                  onChange={(e) => setFormProductionKg(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-foreground block mb-1">Liquor Ratio</label>
                <input
                  type="text"
                  placeholder="e.g. 1:7"
                  value={formLiquorRatio}
                  onChange={(e) => setFormLiquorRatio(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Water Sourcing & Withdrawal Inputs */}
          <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2.5">
              <h4 className="font-bold text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                Water Sourcing &amp; Withdrawal Inputs (m³)
              </h4>
              <div className="text-xs font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg">
                Total: {(Number(formGroundwater) || 0) + (Number(formWarpoDwasa) || 0) + (Number(formRainWater) || 0) + (Number(formRecycleWater) || 0) + (Number(formSurfaceWater) || 0)} m³
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Groundwater (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formGroundwater}
                  onChange={(e) => setFormGroundwater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">WARPO / DWASA (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formWarpoDwasa}
                  onChange={(e) => setFormWarpoDwasa(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Rain Water (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formRainWater}
                  onChange={(e) => setFormRainWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Recycle Water (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formRecycleWater}
                  onChange={(e) => setFormRecycleWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Surface Water (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formSurfaceWater}
                  onChange={(e) => setFormSurfaceWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Department-Wise Water Consumption Inputs */}
          <div className="bg-teal-500/5 p-5 rounded-2xl border border-teal-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-2.5">
              <h4 className="font-bold text-sm text-teal-800 dark:text-teal-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                Fasility-Wise Water Consumption (m³)
              </h4>
              <span className="text-[11px] font-semibold text-muted-foreground">Detailed In-Plant Sub-metering</span>
            </div>

            {/* Sub-processes: Processing & Utility */}
            <div className="space-y-3">
              <span className="text-xs font-black text-foreground uppercase tracking-wide block">
                4.1 Washing Plants
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Dyeing Process (m³)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formProcessDyeing}
                    onChange={(e) => setFormProcessDyeing(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Washing Process (m³)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formProcessWashing}
                    onChange={(e) => setFormProcessWashing(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Printing Process (m³)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formProcessPrinting}
                    onChange={(e) => setFormProcessPrinting(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Boiler Steam (m³)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formBoilerSteam}
                    onChange={(e) => setFormBoilerSteam(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground block mb-1">Cooling Purpose (m³)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formCooling}
                    onChange={(e) => setFormCooling(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Sub-processes: Garments (Cut to Pack) Breakdown */}
            <div className="space-y-3 pt-2 border-t border-teal-500/10">
              <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-wide block">
                4.2 Garments (Cut to Pack): Production, Finishing &amp; Domestic Sanitation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-purple-500/5 p-3.5 rounded-xl border border-purple-500/20">
                <div>
                  <label className="text-[11px] font-bold text-purple-800 dark:text-purple-300 block mb-1">
                    Finishing Steam Boiler (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formGarmentsSteamBoiler}
                    onChange={(e) => setFormGarmentsSteamBoiler(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block mb-1">
                    Workers' Drinking RO (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formDomesticDrinking}
                    onChange={(e) => setFormDomesticDrinking(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                    Washroom Sanitation (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formDomesticWashrooms}
                    onChange={(e) => setFormDomesticWashrooms(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block mb-1">
                    Canteen Services (m³)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formDomesticCanteen}
                    onChange={(e) => setFormDomesticCanteen(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Circularity & Water Savings Initiatives Inputs */}
          <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
              <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">5</span>
                Circularity &amp; Savings Initiatives
              </h4>
              <span className="text-[11px] font-semibold text-muted-foreground">Recycling &amp; Conservation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">RO Recycling (m³/mo to Dyeing)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formRoRecycled}
                  onChange={(e) => setFormRoRecycled(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Rainwater Harvested (m³/mo)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formRainHarvested}
                  onChange={(e) => setFormRainHarvested(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Low Liquor Savings (L/Kg saved)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formLowLiquorSavings}
                  onChange={(e) => setFormLowLiquorSavings(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 6 & 7: Regulatory Compliance & ETP Mass Balance */}
          <div className="bg-muted/20 p-5 rounded-2xl border border-border/60 space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-black">6 &amp; 7</span>
                Regulatory Compliance &amp; ETP Water Balance
              </h4>
              <span className="text-[11px] font-semibold text-muted-foreground">Governance &amp; Wastewater</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Sub-metering (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formSubmeteringCoverage}
                  onChange={(e) => setFormSubmeteringCoverage(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Higg FEM Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formHiggScore}
                  onChange={(e) => setFormHiggScore(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">GW License Status</label>
                <select
                  value={formGroundwaterLicenseStatus}
                  onChange={(e) => setFormGroundwaterLicenseStatus(e.target.value as any)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-teal-500/50"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="Active" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Active</option>
                  <option value="Pending" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Pending</option>
                  <option value="Expired" className="bg-slate-900 text-white dark:bg-slate-900 dark:text-white">Expired</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">ETP Inlet (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formInletWater}
                  onChange={(e) => setFormInletWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">ETP Outlet (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formOutletWater}
                  onChange={(e) => setFormOutletWater(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground block mb-1">Losses Y (m³)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Auto"
                  value={formProcessLossesY}
                  onChange={(e) => setFormProcessLossesY(e.target.value === "" ? "" : Number(e.target.value))}
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
                <p className="text-base font-extrabold text-blue-600">{Number(detailsRecord.totalWithdrawal) || 0} m³</p>
              </div>
              <div>
                <span className="text-muted-foreground">Water Intensity:</span>
                <p className="text-base font-extrabold text-teal-600">{detailsRecord.waterIntensity ?? 0} L/Kg</p>
              </div>
            </div>

            <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
              <h5 className="font-bold text-foreground">Sourcing Breakdown:</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <p>Groundwater: <span className="font-bold">{detailsRecord.sources?.groundwater ?? 0} m³</span></p>
                <p>Municipal/WASA: <span className="font-bold">{detailsRecord.sources?.warpoDwasa ?? 0} m³</span></p>
                <p>Rain Water: <span className="font-bold">{detailsRecord.sources?.rainWater ?? 0} m³</span></p>
                <p>Recycle Water: <span className="font-bold">{detailsRecord.sources?.recycleWater ?? 0} m³</span></p>
                <p>Surface Water: <span className="font-bold">{detailsRecord.sources?.surfaceWater ?? 0} m³</span></p>
              </div>
            </div>

            <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
              <h5 className="font-bold text-foreground">Department-Wise Consumption:</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <p>Dyeing: <span className="font-bold">{detailsRecord.departments?.processDyeing ?? 0} m³</span></p>
                <p>Washing: <span className="font-bold">{detailsRecord.departments?.processWashing ?? 0} m³</span></p>
                <p>Printing: <span className="font-bold">{detailsRecord.departments?.processPrinting ?? 0} m³</span></p>
                <p>Boiler Steam: <span className="font-bold">{detailsRecord.departments?.utilityBoilerSteam ?? 0} m³</span></p>
                <p>Cooling: <span className="font-bold">{detailsRecord.departments?.utilityCooling ?? 0} m³</span></p>
                <p>Finishing Boiler: <span className="font-bold text-purple-600">{detailsRecord.departments?.garmentsSteamBoiler ?? 0} m³</span></p>
                <p>Drinking RO: <span className="font-bold text-blue-600">{detailsRecord.departments?.domesticDrinking ?? 0} m³</span></p>
                <p>Washrooms: <span className="font-bold text-emerald-600">{detailsRecord.departments?.domesticWashrooms ?? 0} m³</span></p>
                <p>Canteen: <span className="font-bold text-amber-600">{detailsRecord.departments?.domesticCanteen ?? 0} m³</span></p>
              </div>
            </div>

            <div className="p-4 bg-background border border-border rounded-2xl space-y-2">
              <h5 className="font-bold text-foreground">Circularity Initiatives:</h5>
              <p>RO Recycle Reused: <span className="font-bold text-emerald-600">{detailsRecord.circularity?.roRecycledVolume ?? 0} m³/mo (passes back to dyeing)</span></p>
              <p>Rainwater Harvested: <span className="font-bold text-cyan-600">{detailsRecord.circularity?.rainwaterHarvested ?? 0} m³/mo (toilet &amp; gardening)</span></p>
              <p>Low Liquor Savings: <span className="font-bold text-blue-600">{detailsRecord.circularity?.lowLiquorSavings ?? 0} L/kg</span></p>
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
