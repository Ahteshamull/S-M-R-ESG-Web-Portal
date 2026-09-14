"use client";

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { exportWaterBalanceToExcel } from "@/lib/exportWaterExcel";
import {
  useGetWaterLogsQuery,
  useDeleteWaterLogMutation,
  useGetWaterDepartmentTelemetryQuery,
} from "@/lib/redux/slices/waterApi";

// Modular Components
import { WaterHeader } from "./components/WaterHeader";
import { WaterKpiCards } from "./components/WaterKpiCards";
import { WaterSourcingSection } from "./components/WaterSourcingSection";
import { WaterTelemetrySection } from "./components/WaterTelemetrySection";
import { WaterFabricBenchmarks } from "./components/WaterFabricBenchmarks";
import { WaterCircularitySection } from "./components/WaterCircularitySection";
import { WaterComplianceDocs } from "./components/WaterComplianceDocs";
import { WaterRecordTable } from "./components/WaterRecordTable";
import { WaterLogModal } from "./components/WaterLogModal";
import { WaterDetailsModal } from "./components/WaterDetailsModal";

import { WaterTabType } from "./types";

export default function WaterDashboardPage() {
  // Redux API Queries & Mutations
  const { data: waterLogs = [], refetch: refetchWaterLogs } = useGetWaterLogsQuery({});
  const [deleteWaterLog] = useDeleteWaterLogMutation();

  // Active View & Filter Controls
  const [activeTab, setActiveTab] = useState<WaterTabType>("summary");
  const [selectedYear, setSelectedYear] = useState<number | "All">(2026);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedPlant, setSelectedPlant] = useState<string>("Plot 104-106, DEPZ Extension");
  const [selectedGoodsType, setSelectedGoodsType] = useState<"denim" | "fabric_washing" | "garment">("denim");
  const [selectedFabricFocus, setSelectedFabricFocus] = useState<string>("All");
  const [selectedProcessType, setSelectedProcessType] = useState<string>("Dyeing");
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [detailsRecord, setDetailsRecord] = useState<any | null>(null);

  // Redux Telemetry Query
  const { data: departmentTelemetry, isLoading: isTelemetryLoading, refetch: refetchTelemetry } =
    useGetWaterDepartmentTelemetryQuery(
      {
        area: selectedProcessType,
        month: selectedMonth === "All" ? undefined : selectedMonth,
        year: selectedYear === "All" ? undefined : selectedYear,
      },
      {
        skip: selectedProcessType === "Garments (Cut to Pack)" || selectedProcessType === "Garments",
      }
    );

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    const list = waterLogs.filter((log: any) => {
      const matchYear = selectedYear === "All" || (log.year ? log.year === selectedYear : true);
      const matchMonth = selectedMonth === "All" || log.month?.toLowerCase() === selectedMonth.toLowerCase();
      const matchSearch =
        searchQuery.trim() === "" ||
        log.month?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.goodsType && log.goodsType.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchYear && matchMonth && matchSearch;
    });
    return [...list].reverse();
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
      count: filteredLogs.length,
    };
  }, [filteredLogs]);

  // Sourcing Distribution Data (Donut Chart)
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

  // Dynamic Departmental Breakdown Summary
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

  // Dynamic Circularity Summary
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

  const latestLog = useMemo(() => {
    return filteredLogs.length > 0 ? filteredLogs[0] : null;
  }, [filteredLogs]);

  // Dynamic Regulatory & Compliance Summary
  const complianceSummary = useMemo(() => {
    if (!latestLog) return { coverage: 0, higgScore: 0, licenseStatus: "Active Verified" };
    const coverage = latestLog.regulatory?.digitalSubmeteringCoverage ?? 0;
    const higgScore = latestLog.regulatory?.higgFemScore ?? 0;
    const licenseStatus = latestLog.regulatory?.groundwaterLicenseStatus ?? "Active";
    return { coverage, higgScore, licenseStatus };
  }, [latestLog]);

  // Monthly Consumption Bar Chart Data
  const monthlyChartData = useMemo(() => {
    return [...filteredLogs].reverse().map((log) => {
      const s = log.sources;
      const tw = log.totalWithdrawal || 0;
      return {
        name: log.month ? log.month.substring(0, 3) : "Mo",
        Groundwater: Number(s?.groundwater) || 0,
        Municipal: Number(s?.warpoDwasa) || 0,
        Rainwater: Number(s?.rainWater) || 0,
        Recycled: Number(s?.recycleWater) || 0,
        Total: tw,
      };
    });
  }, [filteredLogs]);

  // Fabric-Wise Specific Intensities & Benchmarks
  const fabricBenchmarks = useMemo(() => {
    const getIntensityFor = (type: "denim" | "fabric_washing" | "garment") => {
      const typeLogs = filteredLogs.filter(
        (l: any) => l.goodsType && l.goodsType.toLowerCase() === type.toLowerCase()
      );
      const totalW = typeLogs.reduce((sum: number, l: any) => sum + (Number(l.totalWithdrawal) || 0), 0);
      const totalKg = typeLogs.reduce((sum: number, l: any) => sum + (Number(l.productionKg) || 0), 0);
      if (totalKg > 0) return Number(((totalW * 1000) / totalKg).toFixed(1));
      if (selectedGoodsType === type && kpis.waterIntensity > 0) return kpis.waterIntensity;
      return 0;
    };

    const items = [
      {
        id: "denim" as const,
        title: "Denim Washing & Finishing",
        good: 23,
        excellent: 35,
        actual: getIntensityFor("denim"),
        unit: "L/kg",
      },
      {
        id: "fabric_washing" as const,
        title: "Fabric Washing (Open / Rope)",
        good: 36,
        excellent: 41,
        actual: getIntensityFor("fabric_washing"),
        unit: "L/kg",
      },
      {
        id: "garment" as const,
        title: "Garments (Cut to Pack / Wash)",
        good: 63,
        excellent: 46,
        actual: getIntensityFor("garment"),
        unit: "L/kg",
      },
    ];

    return items.map((item) => {
      const { good, excellent, actual } = item;
      const targetLimit = Math.max(good, excellent);
      const bestLimit = Math.min(good, excellent);
      const isBreached = actual > targetLimit && actual > 0;
      const isExcellent = actual > 0 && actual <= bestLimit;
      const isGood = actual > 0 && actual > bestLimit && actual <= targetLimit;
      const excess = isBreached ? Number((actual - targetLimit).toFixed(1)) : 0;

      let status = "No Logged Production";
      let badgeColor = "bg-muted/40 text-muted-foreground border-border";

      if (isBreached) {
        status = "⚠️ Standards Fall Alert (High Consumption)";
        badgeColor = "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40";
      } else if (isExcellent) {
        status = "⭐ Excellent Efficiency (Optimal Benchmark)";
        badgeColor = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40";
      } else if (isGood) {
        status = "✅ Good Standard Achieved";
        badgeColor = "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40";
      }

      return {
        ...item,
        isBreached,
        isExcellent,
        isGood,
        excess,
        status,
        badgeColor,
      };
    });
  }, [filteredLogs, selectedGoodsType, kpis.waterIntensity]);

  // Section 4 Industrial Telemetry Constants & Memos
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

  // Active Telemetry Bound Data
  const activeTelemetry = useMemo(() => {
    if (departmentTelemetry) return departmentTelemetry;

    const baseUsage = selectedAreaVolume > 0 ? selectedAreaVolume * 1000 : 150000;

    if (
      selectedProcessType === "Garments (Cut to Pack)" ||
      selectedProcessType === "Garments" ||
      selectedProcessType === "Cut to Pack"
    ) {
      return {
        department: "Garments (Cut to Pack)",
        title: "4. Garments & Cut to Pack Resource Management Portal",
        subtitle:
          "1. Production & Finishing (Steam Boiler) and 2. Domestic & Sanitation (Drinking, Washrooms, Canteen)",
        totalUsageLiters: baseUsage > 0 ? baseUsage : 40000,
        capacityPercent: 7,
        alertMessage:
          "NOTICE: Steam boiler lines and workers domestic sanitation & RO drinking lines are fully operational and verified.",
        breakdownTags: [
          { name: "Steam Boiler (Finishing)", percentage: 45, color: "#8b5cf6" },
          { name: "Workers' Drinking Water", percentage: 15, color: "#0ea5e9" },
          { name: "Washroom Sanitation", percentage: 25, color: "#10b981" },
          { name: "Canteen Services", percentage: 15, color: "#f59e0b" },
        ],
        trendData: dailyTrendData.map((d) => ({ ...d, value: Math.round(d.value * 0.07) })),
        comparisonTitle: "1. Production & Finishing vs. 2. Domestic & Sanitation (m³)",
        comparisonSubtitle: "Steam boiler consumption, workers' drinking water, washrooms, and canteen audits",
        comparisonData: [
          {
            name: "Steam Boiler (Finishing)",
            actual: deptSummary.garmentsSteam,
            target: deptSummary.garmentsSteam > 0 ? Math.round(deptSummary.garmentsSteam * 0.9) : 0,
            unit: "m³",
          },
          { name: "Workers' Drinking Water", actual: deptSummary.drinking, target: deptSummary.drinking, unit: "m³" },
          {
            name: "Washroom Sanitation",
            actual: deptSummary.washrooms,
            target: deptSummary.washrooms > 0 ? Math.round(deptSummary.washrooms * 0.9) : 0,
            unit: "m³",
          },
          { name: "Canteen Services", actual: deptSummary.canteen, target: deptSummary.canteen, unit: "m³" },
        ],
        effluentTitle: "Domestic & Sanitation Drainage Discharge",
        effluentBadge: "100% Safe Discharge",
        effluentData: [
          {
            name: "Boiler Blowdown",
            inflow: Math.round(deptSummary.garmentsSteam * 0.6),
            treated: Math.round(deptSummary.garmentsSteam * 0.6),
          },
          { name: "Drinking Water RO", inflow: deptSummary.drinking, treated: deptSummary.drinking },
          { name: "Washrooms Line", inflow: deptSummary.washrooms, treated: Math.round(deptSummary.washrooms * 0.95) },
          { name: "Canteen Wash", inflow: deptSummary.canteen, treated: deptSummary.canteen },
        ],
        sensorTitle: "Live Sub-Meters & IoT Telemetry: Garments (Cut to Pack)",
        sensorReadings: [
          {
            id: "GCP-01 (Steam Boiler)",
            flow: deptSummary.garmentsSteam > 0 ? Number((deptSummary.garmentsSteam / 30).toFixed(1)) : 0,
            temp: deptSummary.garmentsSteam > 0 ? 92.0 : 0,
            ph: 7.8,
            operator: "1. Production & Finishing",
            status: deptSummary.garmentsSteam > 0 ? "ACTIVE" : "IDLE",
            extraMetric: "Steam Boiler",
          },
          {
            id: "GCP-02 (Drinking Water RO)",
            flow: deptSummary.drinking > 0 ? Number((deptSummary.drinking / 30).toFixed(1)) : 0,
            temp: deptSummary.drinking > 0 ? 21.5 : 0,
            ph: 7.1,
            operator: "2. Drinking Water RO",
            status: deptSummary.drinking > 0 ? "OPTIMAL" : "IDLE",
            extraMetric: "TDS: 38 ppm",
          },
          {
            id: "GCP-03 (Washroom Flush)",
            flow: deptSummary.washrooms > 0 ? Number((deptSummary.washrooms / 30).toFixed(1)) : 0,
            temp: deptSummary.washrooms > 0 ? 23.0 : 0,
            ph: 7.3,
            operator: "2. Washroom Sanitation",
            status: deptSummary.washrooms > 0 ? "PASS" : "IDLE",
            extraMetric: "Washrooms",
          },
          {
            id: "GCP-04 (Canteen Services)",
            flow: deptSummary.canteen > 0 ? Number((deptSummary.canteen / 30).toFixed(1)) : 0,
            temp: deptSummary.canteen > 0 ? 22.5 : 0,
            ph: 7.0,
            operator: "2. Canteen Services",
            status: deptSummary.canteen > 0 ? "OPTIMAL" : "IDLE",
            extraMetric: "Canteen",
          },
        ],
        extraCards: [
          {
            title: "1. Production & Finishing",
            value: `${deptSummary.garmentsSteam} m³ Logged`,
            subtitle: "Garments ironing, finishing tunnels and packaging steam line",
            badge: "Production",
          },
          {
            title: "2. Domestic & Sanitation",
            value: `${deptSummary.drinking + deptSummary.washrooms} m³ Logged`,
            subtitle: "Safe RO drinking water for workers and hygiene sanitation lines",
            badge: "Sanitation",
          },
          {
            title: "Canteen Services",
            value: `${deptSummary.canteen} m³ Logged`,
            subtitle: "Daily hygienic cooking, kitchen and washing facilities water",
            badge: "Canteen",
          },
        ],
      };
    }

    return {
      department: selectedProcessType,
      title:
        selectedProcessType === "Washing"
          ? "4. Washing Department Water Consumption & Telemetry"
          : `4. ${selectedProcessType} Department Water Consumption & Telemetry`,
      subtitle:
        selectedProcessType === "Washing"
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
      comparisonTitle:
        selectedProcessType === "Washing" ? "" : `${selectedProcessType.toUpperCase()} PERFORMANCE BENCHMARKS`,
      comparisonSubtitle:
        selectedProcessType === "Washing" ? "" : "Standard benchmarks vs actual industrial performance",
      comparisonData:
        selectedProcessType === "Washing"
          ? []
          : fabricPerformanceList.map((f) => ({
              name: f.fabric,
              actual: f.actual,
              target: f.target,
              unit: "L/kg",
            })),
      effluentTitle: "WASTEWATER MANAGEMENT (WTP/ETP)",
      effluentBadge: "REUSE RATE: 35%",
      effluentData: etpComparisonData,
      sensorTitle: "LIVE SENSOR READINGS",
      sensorReadings: liveSensorReadings,
      extraCards: [],
    };
  }, [
    departmentTelemetry,
    selectedProcessType,
    selectedAreaVolume,
    capacityUsagePercent,
    dailyTrendData,
    fabricPerformanceList,
    etpComparisonData,
    liveSensorReadings,
    deptSummary,
  ]);

  const activeComparisonData = useMemo(() => {
    const list = activeTelemetry.comparisonData || [];
    return list.map((item: any) => ({
      name: item.name || item.fabric || "Metric",
      actual: item.actual,
      target: item.target,
      unit: item.unit || "L/kg",
    }));
  }, [activeTelemetry.comparisonData]);

  const hasComparisonChart = useMemo(() => {
    return Boolean(
      selectedProcessType !== "Washing" &&
        activeComparisonData &&
        activeComparisonData.length > 0 &&
        activeTelemetry?.comparisonTitle &&
        activeTelemetry.comparisonTitle.trim() !== ""
    );
  }, [selectedProcessType, activeComparisonData, activeTelemetry?.comparisonTitle]);

  // Handlers
  const handleDelete = async (id: string, month: string) => {
    if (confirm(`Are you sure you want to delete the record for ${month}?`)) {
      const res = await deleteWaterLog(id);
      if (!res.error) {
        toast.success(`Record for ${month} deleted`);
        await refetchWaterLogs?.();
        await refetchTelemetry?.();
      } else {
        toast.error("Failed to delete record");
      }
    }
  };

  const handleExportExcel = () => {
    const valX = kpis.totalWithdrawal;
    const valBoiler = filteredLogs.reduce(
      (sum, l) => sum + (l.departments?.utilityBoilerSteam || l.totalProduction || 0),
      0
    );
    const valY = 65.45;
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
      percentClosureResult,
    });
    toast.success("Water Sustainability Excel Report Generated!");
  };

  const handleModalSuccess = (savedYear: number, savedMonth: string) => {
    setIsLogModalOpen(false);
    // Instant real-time display without page reload
    setSelectedYear(savedYear);
    setSelectedMonth(savedMonth);
    refetchWaterLogs();
    refetchTelemetry();
  };

  return (
    <div className="space-y-8 pb-14 w-full min-w-0 flex-1">
      {/* 1. Header & Filters */}
      <WaterHeader
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedPlant={selectedPlant}
        setSelectedPlant={setSelectedPlant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrintPdf={() => window.print()}
        onExportExcel={handleExportExcel}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* 1. Executive Summary & Sourcing Tab */}
      {activeTab === "summary" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <WaterKpiCards kpis={kpis} />

          <WaterSourcingSection
            sourcingPieData={sourcingPieData}
            monthlyChartData={monthlyChartData}
            totalWithdrawal={kpis.totalWithdrawal}
          />

          <WaterCircularitySection circularitySummary={circularitySummary} />
        </div>
      )}

      {/* 2. Factory IoT & Telemetry Tab */}
      {activeTab === "telemetry" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <WaterTelemetrySection
            activeTelemetry={activeTelemetry}
            selectedProcessType={selectedProcessType}
            setSelectedProcessType={setSelectedProcessType}
            isTelemetryLoading={isTelemetryLoading}
            isAlertDismissed={isAlertDismissed}
            setIsAlertDismissed={setIsAlertDismissed}
            hasComparisonChart={hasComparisonChart}
            activeComparisonData={activeComparisonData}
            capacityUsagePercent={capacityUsagePercent}
            displayTotalLiters={displayTotalLiters}
          />
        </div>
      )}

      {/* 3. Fabric Benchmarks Tab */}
      {activeTab === "benchmarks" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <WaterFabricBenchmarks fabricBenchmarks={fabricBenchmarks} />
        </div>
      )}

      {/* 4. Compliance & Flowmeters Tab */}
      {activeTab === "compliance" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <WaterComplianceDocs
            complianceSummary={complianceSummary}
            latestLog={latestLog}
          />
        </div>
      )}

      {/* 5. Historical Records Portal Tab */}
      {activeTab === "portal" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <WaterRecordTable
            filteredLogs={filteredLogs}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            onSelectRecord={(record) => setDetailsRecord(record)}
            onDeleteRecord={handleDelete}
          />
        </div>
      )}

      {/* New Water Log Modal */}
      <WaterLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        initialYear={selectedYear === "All" ? 2026 : selectedYear}
        initialMonth={selectedMonth === "All" ? "January" : selectedMonth}
        onSuccess={handleModalSuccess}
      />

      {/* Details View Modal */}
      <WaterDetailsModal
        detailsRecord={detailsRecord}
        onClose={() => setDetailsRecord(null)}
      />
    </div>
  );
}
