"use client";

import Link from "next/link";
import { ArrowLeft, FlaskConical } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/chemicals" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">ZDHC MRSL Compliance</h1>
      </div>

      <div className="glass-card rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-border/60">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <FlaskConical className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Compliance Dashboard</h2>
        <p className="text-muted-foreground max-w-md">
          Track ZDHC MRSL conformance levels, manage certifications, and monitor compliance metrics across your entire chemical inventory.
        </p>
      </div>
    </div>
  );
}
