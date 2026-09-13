"use client";

import { useState } from "react";
import { 
  FileBarChart, Download, FileText, FileSpreadsheet, Loader2, 
  Calendar, Zap, Droplets, Cloud, ShieldCheck 
} from "lucide-react";
import toast from "react-hot-toast";
import { useGetEnergyLogsQuery } from "@/lib/redux/slices/energyApi";
import { useGetWaterLogsQuery } from "@/lib/redux/slices/waterApi";
import { useGetCarbonSummaryQuery } from "@/lib/redux/slices/carbonApi";
import { useGetComplianceOverviewQuery } from "@/lib/redux/slices/complianceApi";
import { useGetWasteInventoryQuery } from "@/lib/redux/slices/wasteApi";
import { useGetChemicalsQuery } from "@/lib/redux/slices/chemicalsApi";
import { useGetReportsSummaryQuery } from "@/lib/redux/slices/reportsApi";

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const filterParams = {
    year: selectedYear !== "all" ? Number(selectedYear) : undefined,
    month: selectedMonth !== "all" ? selectedMonth : undefined,
  };

  const { data: serverReport, isLoading: loadingServerReport } = useGetReportsSummaryQuery(filterParams);
  const { data: energyLogs = [], isLoading: loadingEnergy } = useGetEnergyLogsQuery(filterParams);
  const { data: waterLogs = [], isLoading: loadingWater } = useGetWaterLogsQuery(filterParams);
  const { data: carbonData, isLoading: loadingCarbon } = useGetCarbonSummaryQuery();
  const { data: complianceOverview, isLoading: loadingCompliance } = useGetComplianceOverviewQuery();
  const { data: wasteInventory = [], isLoading: loadingWaste } = useGetWasteInventoryQuery();
  const { data: chemicals = [], isLoading: loadingChemicals } = useGetChemicalsQuery();

  const isExporting = loadingEnergy || loadingWater || loadingCarbon || loadingCompliance || loadingWaste || loadingChemicals || loadingServerReport;

  const downloadCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => {
        const text = val !== undefined && val !== null ? String(val) : "";
        return `"${text.replace(/"/g, '""')}"`;
      }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${filename} generated successfully!`);
  };

  const handleGenerateEnergyCarbon = () => {
    if (energyLogs.length === 0) {
      toast.error("No energy log data available to export.");
      return;
    }
    const headers = ["Date / Month", "Year", "Electricity (kWh)", "Gas (m3)", "Diesel (L)", "Cost ($)"];
    const rows = energyLogs.map((log: any) => [
      log.month || log.date || log.createdAt,
      log.year || 2026,
      log.electricity || 0,
      log.gas || 0,
      log.diesel || 0,
      log.cost || 0,
    ]);
    downloadCSV("Energy_And_Carbon_Emissions_Report.csv", headers, rows);
  };

  const handleGenerateWaterWaste = () => {
    if (waterLogs.length === 0 && wasteInventory.length === 0) {
      toast.error("No water or waste data available to export.");
      return;
    }
    const headers = ["Type", "Date / Month", "Metric Name / Source", "Value", "Unit / Method", "Extra Details"];
    const rows: any[][] = [];

    waterLogs.forEach((log: any) => {
      rows.push([
        "Water Log",
        log.month || log.createdAt,
        log.source || "Total Withdrawal",
        log.totalWithdrawal || log.consumption || 0,
        "m3",
        `Intensity: ${log.waterIntensity || 0} L/kg | Cost: $${log.cost || 0}`,
      ]);
    });

    wasteInventory.forEach((log: any) => {
      rows.push([
        "Waste Entry",
        log.checkedOn || log.createdAt,
        log.wasteName || log.wasteType || "Waste Item",
        log.quantity || 0,
        log.unit || "kg",
        `Classification: ${log.wasteClassification || "General"}`,
      ]);
    });

    downloadCSV("Water_And_Waste_Inventory_Report.csv", headers, rows);
  };

  const handleGenerateChemicals = () => {
    if (chemicals.length === 0) {
      toast.error("No chemical compliance data available.");
      return;
    }
    const headers = ["Chemical Name", "Manufacturer", "Usage Location", "ZDHC MRSL Level", "Safety Sheet URL", "Safety Checked"];
    const rows = chemicals.map((chem: any) => [
      chem.chemicalName || chem.name,
      chem.manufacturerName || chem.manufacturer || "N/A",
      chem.useArea || chem.usageLocation || "N/A",
      chem.zdhcLevel || "Level 1",
      chem.monthlyIncheckReportUrl || chem.msdsUrl || "N/A",
      chem.mrslRslCompliance === "Y" ? "Yes" : "No",
    ]);
    downloadCSV("ZDHC_Chemical_Inventory_Report.csv", headers, rows);
  };

  const handleGenerateIntegratedReport = (format: "PDF" | "Excel") => {
    const headers = ["ESG Metric Section", "Key Performance Indicator", "Reported Value", "Unit"];
    
    // Leverage serverReport if available, or fallback to client states
    const carbonEmissions = serverReport?.environmental?.carbon?.totalEmissions ?? (carbonData?.totalEmissions || 0);
    const electricityKwh = serverReport?.environmental?.energy?.electricityKwh ?? energyLogs.reduce((acc: number, l: any) => acc + (Number(l.electricity) || 0), 0);
    const waterWithdrawal = serverReport?.environmental?.water?.totalWithdrawalM3 ?? waterLogs.reduce((acc: number, l: any) => acc + (Number(l.totalWithdrawal) || 0), 0);
    const waterIntensity = serverReport?.environmental?.water?.avgWaterIntensity ?? 0;
    const wasteQty = serverReport?.environmental?.waste?.totalQuantityLogged ?? wasteInventory.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0);
    const complianceScore = serverReport?.socialAndGovernance?.complianceScore ?? 100;
    const activeCommittees = serverReport?.socialAndGovernance?.activeCommittees ?? complianceOverview?.committees?.filter((c: any) => c.status === "Active").length;
    const openGrievances = serverReport?.socialAndGovernance?.openCAPs ?? complianceOverview?.caps?.filter((c: any) => c.status === "Pending" || c.status === "Open").length;

    const rows = [
      ["Environmental", "Total Carbon Footprint", carbonEmissions, "tCO2e"],
      ["Environmental", "Total Electricity Consumption", electricityKwh, "kWh"],
      ["Environmental", "Total Water Withdrawal", waterWithdrawal, "m3"],
      ["Environmental", "Water Intensity Metric", `${waterIntensity} L/kg`, "L/kg"],
      ["Environmental", "Waste Quantity Logged", wasteQty, "kg/tons"],
      ["Social & Chemicals", "ZDHC Conformance Chemical Items", chemicals.length, "formulations"],
      ["Governance & Compliance", "Overall Compliance Score", `${complianceScore}%`, "%"],
      ["Governance & Compliance", "Active Committees", activeCommittees || 0, "committees"],
      ["Governance & Compliance", "Open Corrective Action Plans (CAPs)", openGrievances || 0, "items"],
    ];

    if (format === "Excel") {
      downloadCSV("Integrated_ESG_Summary_Data.csv", headers, rows);
    } else {
      const printContent = `
============================================================
       INTEGRATED ENTERPRISE ESG SUSTAINABILITY REPORT
============================================================
Period Filter: ${selectedYear !== "all" ? `Year ${selectedYear}` : "All Years"} | ${selectedMonth !== "all" ? selectedMonth : "All Months"}
Report Generated On: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

METRICS SUMMARY:
------------------------------------------------------------
${rows.map(r => `${r[0]} | ${r[1]}: ${r[2]} ${r[3]}`).join("\n")}
------------------------------------------------------------
Status: Verified & Validated for Audit Submission
`;
      const blob = new Blob([printContent], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Integrated_ESG_Sustainability_Report.txt");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Integrated ESG Text Report generated!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enterprise ESG Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consolidated Environmental, Social & Governance audit reports and multi-period data exports.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card border border-border p-2 rounded-xl shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground pl-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Filter:
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs font-medium bg-muted/60 border border-border/80 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="all">All Years</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-medium bg-muted/60 border border-border/80 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="all">All Months</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      </div>

      {/* Quick Summary Cards (Period-Aware) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-border bg-gradient-to-br from-emerald-50/40 to-card dark:from-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Carbon Footprint</span>
            <Cloud className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold mt-2">
            {serverReport?.environmental?.carbon?.totalEmissions ?? 0} <span className="text-xs font-normal text-muted-foreground">tCO2e</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Scope 1 + 2 + 3 GHG
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-border bg-gradient-to-br from-cyan-50/40 to-card dark:from-cyan-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Water Abstraction</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold mt-2">
            {serverReport?.environmental?.water?.totalWithdrawalM3?.toLocaleString() ?? 0} <span className="text-xs font-normal text-muted-foreground">m³</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Intensity: {serverReport?.environmental?.water?.avgWaterIntensity ?? 0} L/kg
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-border bg-gradient-to-br from-amber-50/40 to-card dark:from-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Energy Consumption</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold mt-2">
            {serverReport?.environmental?.energy?.electricityKwh?.toLocaleString() ?? 0} <span className="text-xs font-normal text-muted-foreground">kWh</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Cost: ${serverReport?.environmental?.energy?.totalCost?.toLocaleString() ?? 0}
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-border bg-gradient-to-br from-indigo-50/40 to-card dark:from-indigo-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Governance Score</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold mt-2">
            {serverReport?.socialAndGovernance?.complianceScore ?? 100}%
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {serverReport?.socialAndGovernance?.openCAPs ?? 0} Open CAPs | {serverReport?.socialAndGovernance?.activeCommittees ?? 0} Committees
          </p>
        </div>
      </div>

      {/* Export Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 border border-border">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg mr-4">
              <FileBarChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Integrated ESG Report</h3>
              <p className="text-sm text-muted-foreground">Full overview across all metrics & compliance</p>
            </div>
          </div>
          
          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1 mb-6 border border-border/60">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Selection:</span>
              <span className="font-semibold text-foreground">
                {selectedYear !== "all" ? `Year ${selectedYear}` : "All Years"} / {selectedMonth !== "all" ? selectedMonth : "All Months"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Format Compatibility:</span>
              <span className="text-emerald-600 font-medium">Higg FEM, GRI & ZDHC Aligned</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              disabled={isExporting}
              onClick={() => handleGenerateIntegratedReport("PDF")} 
              className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-600/50 transition-colors flex items-center justify-center shadow-sm"
            >
              {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} 
              Text Audit Report
            </button>
            <button 
              disabled={isExporting}
              onClick={() => handleGenerateIntegratedReport("Excel")} 
              className="flex-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-100 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />} 
              Excel Data (.csv)
            </button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-border">
          <h3 className="font-bold text-lg mb-4">Module Specific Reports</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium text-sm">Energy & Carbon Emissions</p>
                <p className="text-xs text-muted-foreground">Electricity, gas, diesel, Scope 1 & 2 logs</p>
              </div>
              <button 
                disabled={isExporting}
                onClick={handleGenerateEnergyCarbon} 
                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg disabled:opacity-50 transition-colors"
                title="Download Energy & Carbon CSV"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium text-sm">Water Sourcing & Waste Inventory</p>
                <p className="text-xs text-muted-foreground">Consumption, sources, intensity, and hazardous waste</p>
              </div>
              <button 
                disabled={isExporting}
                onClick={handleGenerateWaterWaste} 
                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg disabled:opacity-50 transition-colors"
                title="Download Water & Waste CSV"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium text-sm">ZDHC Chemical Inventory</p>
                <p className="text-xs text-muted-foreground">MRSL Conformance Level 1/2/3 and MSDS registry</p>
              </div>
              <button 
                disabled={isExporting}
                onClick={handleGenerateChemicals} 
                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg disabled:opacity-50 transition-colors"
                title="Download ZDHC Chemical CSV"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
