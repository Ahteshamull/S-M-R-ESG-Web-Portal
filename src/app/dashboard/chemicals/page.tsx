import Link from "next/link";
import { FlaskConical, FileCheck, PackageSearch, FileBarChart2, ChevronRight } from "lucide-react";

export default function ChemicalsDashboardHub() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/40 p-6 rounded-2xl border border-border/50 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Chemical Management</h1>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">ZDHC MRSL compliance, inventory, SDS, and InCheck reports.</p>
        </div>
      </div>

      {/* Hub Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Compliance */}
        <Link href="/dashboard/chemicals/compliance" className="group block relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div>
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">ZDHC MRSL Compliance</h3>
              <p className="text-sm text-muted-foreground mb-6">Manage and monitor MRSL compliance status and certificates.</p>
            </div>
            <div className="mt-auto flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Open Compliance <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* Inventory */}
        <Link href="/dashboard/chemicals/inventory" className="group block relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div>
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <PackageSearch className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Chemical Inventory</h3>
              <p className="text-sm text-muted-foreground mb-6">Manage chemical stock, usage areas, and inventory records.</p>
            </div>
            <div className="mt-auto flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Open Inventory <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* SDS */}
        <Link href="/dashboard/chemicals/sds" className="group block relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 cursor-pointer">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div>
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <FileCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Safety Data Sheets</h3>
              <p className="text-sm text-muted-foreground mb-6">Track, upload, and review chemical safety data sheets.</p>
            </div>
            <div className="mt-auto flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Open SDS <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>

        {/* InCheck */}
        <Link href="/dashboard/chemicals/incheckreport" className="group block relative overflow-hidden bg-background/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 hover:border-orange-500/30 transition-all duration-300 cursor-pointer">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div>
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                <FileBarChart2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">InCheck Report</h3>
              <p className="text-sm text-muted-foreground mb-6">Generate and view monthly InCheck reports and performance.</p>
            </div>
            <div className="mt-auto flex items-center text-orange-600 dark:text-orange-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Open Report <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
