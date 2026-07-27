"use client";

import { FileBarChart, Download, FileText, FileSpreadsheet } from "lucide-react";
import toast from "react-hot-toast";

export default function ReportsPage() {
  const handleGenerate = () => {
    toast.success("Report is generating. It will download shortly.");
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
            <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm">
              <option>Q3 2023 (Jul - Sep)</option>
              <option>Q2 2023 (Apr - Jun)</option>
              <option>Full Year 2022</option>
            </select>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleGenerate} className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" /> PDF Report
            </button>
            <button onClick={handleGenerate} className="flex-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel Data
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
              <button onClick={handleGenerate} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Download className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">Water & Waste Inventory</p>
                <p className="text-xs text-muted-foreground">Consumption and disposal</p>
              </div>
              <button onClick={handleGenerate} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Download className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">ZDHC Chemical Inventory</p>
                <p className="text-xs text-muted-foreground">MRSL Compliance list</p>
              </div>
              <button onClick={handleGenerate} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Download className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
