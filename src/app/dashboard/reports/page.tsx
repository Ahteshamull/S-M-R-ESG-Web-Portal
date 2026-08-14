"use client";

import { FileBarChart, Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useGetEnergyLogsQuery } from "@/lib/redux/slices/energyApi";
import { useGetWaterLogsQuery } from "@/lib/redux/slices/waterApi";
import { useGetCarbonSummaryQuery } from "@/lib/redux/slices/carbonApi";
import { useGetComplianceOverviewQuery } from "@/lib/redux/slices/complianceApi";
import { useGetWasteInventoryQuery } from "@/lib/redux/slices/wasteApi";
import { useGetChemicalsQuery } from "@/lib/redux/slices/chemicalsApi";

export default function ReportsPage() {
  const { data: energyLogs = [], isLoading: loadingEnergy } = useGetEnergyLogsQuery();
  const { data: waterLogs = [], isLoading: loadingWater } = useGetWaterLogsQuery();
  const { data: carbonData, isLoading: loadingCarbon } = useGetCarbonSummaryQuery();
  const { data: complianceOverview, isLoading: loadingCompliance } = useGetComplianceOverviewQuery();
  const { data: wasteInventory = [], isLoading: loadingWaste } = useGetWasteInventoryQuery();
  const { data: chemicals = [], isLoading: loadingChemicals } = useGetChemicalsQuery();

  const isExporting = loadingEnergy || loadingWater || loadingCarbon || loadingCompliance || loadingWaste || loadingChemicals;

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
    const headers = ["Date", "Energy Source", "Consumption Value", "Unit", "Cost ($)", "Scope 1 (tCO2e)", "Scope 2 (tCO2e)"];
    const rows = energyLogs.map((log: any) => [
      log.date || log.createdAt,
      log.source,
      log.consumption,
      log.unit,
      log.cost || 0,
      log.scope1Emission || 0,
      log.scope2Emission || 0,
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
        log.source,
        log.consumption,
        "m3",
        `Cost: ${log.cost || 0}`,
      ]);
    });

    wasteInventory.forEach((log: any) => {
      rows.push([
        "Waste Entry",
        log.dateDisposed || log.createdAt,
        log.wasteType,
        log.quantity,
        log.unit,
        `Disposal Method: ${log.disposalMethod}`,
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
      chem.name,
      chem.manufacturer,
      chem.usageLocation,
      chem.zdhcLevel || "Level 1",
      chem.msdsUrl || "N/A",
      chem.safetyChecked ? "Yes" : "No",
    ]);
    downloadCSV("ZDHC_Chemical_Inventory_Report.csv", headers, rows);
  };

  const handleGenerateIntegratedReport = (format: "PDF" | "Excel") => {
    // Generates an integrated ESG high-level summary CSV
    const headers = ["ESG Metric Section", "Key Performance Indicator", "Reported Value", "Unit"];
    const carbonEmissions = carbonData?.totalEmissions || 0;
    const activeCommittees = complianceOverview?.committees?.filter((c: any) => c.status === "Active").length || 0;
    const openGrievances = complianceOverview?.caps?.filter((c: any) => c.status === "Pending" || c.status === "Open").length || 0;

    const rows = [
      ["Environmental", "Total Carbon Footprint", carbonEmissions, "tCO2e"],
      ["Environmental", "Energy Log Entries Count", energyLogs.length, "entries"],
      ["Environmental", "Water Consumption Entries Count", waterLogs.length, "entries"],
      ["Environmental", "Waste Quantity Logged", wasteInventory.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0), "kg/tons"],
      ["Social", "ZDHC Compliant Chemicals", chemicals.length, "products"],
      ["Governance & Compliance", "Active Committees", activeCommittees, "committees"],
      ["Governance & Compliance", "Open Grievances / Pending Audits", openGrievances, "items"],
    ];

    if (format === "Excel") {
      downloadCSV("Integrated_ESG_Summary_Data.csv", headers, rows);
    } else {
      // PDF report generation can trigger browser print format or download a text/pdf layout
      const printContent = `
        Integrated ESG Sustainability Summary Report
        ===========================================
        Generated on: ${new Date().toLocaleDateString()}
        
        ${rows.map(r => `${r[0]} - ${r[1]}: ${r[2]} ${r[3]}`).join("\n")}
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
      toast.success("Text Summary generated successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ESG Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and download comprehensive sustainability reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6 border border-border">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg mr-4">
              <FileBarChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Integrated ESG Report</h3>
              <p className="text-sm text-muted-foreground">Full overview of all metrics</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Period</label>
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <option>Current Year Data</option>
              <option>Lifetime Collected Data</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button 
              disabled={isExporting}
              onClick={() => handleGenerateIntegratedReport("PDF")} 
              className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:bg-emerald-600/50 transition-colors flex items-center justify-center"
            >
              {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} 
              Text Report
            </button>
            <button 
              disabled={isExporting}
              onClick={() => handleGenerateIntegratedReport("Excel")} 
              className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 mr-2" />} 
              Excel Data
            </button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-border">
          <h3 className="font-bold text-lg mb-4">Module Specific Reports</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">Energy & Carbon Emissions</p>
                <p className="text-xs text-muted-foreground">Scope 1, 2, 3 Data</p>
              </div>
              <button 
                disabled={isExporting}
                onClick={handleGenerateEnergyCarbon} 
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">Water & Waste Inventory</p>
                <p className="text-xs text-muted-foreground">Consumption and disposal</p>
              </div>
              <button 
                disabled={isExporting}
                onClick={handleGenerateWaterWaste} 
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">ZDHC Chemical Inventory</p>
                <p className="text-xs text-muted-foreground">MRSL Compliance list</p>
              </div>
              <button 
                disabled={isExporting}
                onClick={handleGenerateChemicals} 
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
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
