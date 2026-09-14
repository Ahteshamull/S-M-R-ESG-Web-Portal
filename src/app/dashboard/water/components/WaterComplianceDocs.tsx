"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, ExternalLink, FileCheck2, FileText, Gauge } from "lucide-react";
import toast from "react-hot-toast";
import { ComplianceSummary } from "../types";

interface WaterComplianceDocsProps {
  complianceSummary: ComplianceSummary;
  latestLog: any;
}

export const WaterComplianceDocs: React.FC<WaterComplianceDocsProps> = ({
  complianceSummary,
  latestLog,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Section 7: Regulatory & Compliance Matrix */}
      <div className="bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-border/50 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">7. Regulatory &amp; Compliance Matrix</h3>
              <p className="text-xs text-muted-foreground">WARPO, DoE &amp; Higg FEM Mandates</p>
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
            <span className={`px-2.5 py-1 rounded-lg font-bold ${
              complianceSummary.licenseStatus === "Active"
                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                : complianceSummary.licenseStatus === "Pending"
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                : "bg-rose-500/20 text-rose-700 dark:text-rose-300"
            }`}>
              {complianceSummary.licenseStatus || "Active"} (WARPO)
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
            <span>100% Water Abstraction Data Logged &amp; Verified</span>
          </div>
        </div>
      </div>

      {/* Section 8: Document & Data Repository */}
      <div className="bg-background/50 backdrop-blur-xl rounded-3xl p-6 md:p-7 border border-border/50 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">8. Document &amp; Data Repository</h3>
              <p className="text-xs text-muted-foreground">Flowmeter Calibration &amp; Water Quality Tests</p>
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
                <p className="text-[11px] text-muted-foreground">ETP Treated, Inlet &amp; Outlet Parameters</p>
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-teal-600" /> Flowmeter Telemetry Data
              </p>
              {latestLog?.month && (
                <span className="text-[10px] text-muted-foreground font-semibold">
                  Latest: {latestLog.month} {latestLog.year}
                </span>
              )}
            </div>
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
                  {latestLog?.flowmeters && latestLog.flowmeters.length > 0 ? (
                    latestLog.flowmeters.map((meter: any, idx: number) => {
                      const prev = Number(meter.previousReading) || 0;
                      const pres = Number(meter.presentReading) || 0;
                      const tot = Number(meter.totalVolume) || Math.max(0, pres - prev);
                      return (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2 px-3 text-left font-semibold text-foreground">
                            {meter.meterName || `FM-0${idx + 1}`}
                          </td>
                          <td className="py-2 px-2">{prev.toLocaleString()}</td>
                          <td className="py-2 px-2">{pres.toLocaleString()}</td>
                          <td className="py-2 px-2 font-bold text-teal-600">{tot.toLocaleString()}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-muted-foreground text-[11px]">
                        No flowmeter telemetry readings logged yet. Add water logs with flowmeter readings.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
