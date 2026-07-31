"use client";

import Link from "next/link";
import { ArrowLeft, FileBarChart2 } from "lucide-react";

export default function InCheckReportPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/chemicals" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Monthly InCheck Report</h1>
      </div>

      <div className="glass-card rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-border/60">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <FileBarChart2 className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">InCheck Report Generator</h2>
        <p className="text-muted-foreground max-w-md">
          Generate, download, and review monthly InCheck reports based on your current chemical inventory data.
        </p>
      </div>
    </div>
  );
}
