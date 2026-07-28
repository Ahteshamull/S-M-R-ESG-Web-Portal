import Link from "next/link";
import { 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Users, 
  Droplets, 
  Zap, 
  Recycle, 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  Database, 
  Settings, 
  FileSearch 
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-emerald-200 dark:selection:bg-emerald-900 text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg shadow-sm shadow-emerald-500/20">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">S-M-R ESG</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition">
              Log in
            </Link>
            <Link href="/dashboard" className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition shadow-md shadow-emerald-500/20">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center py-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/30 dark:bg-emerald-900/20 rounded-full blur-[120px] -z-10"></div>
          
          <div className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400 mr-2 animate-pulse"></span>
            Next-Gen ESG Management
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Intelligent ESG Platform for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
              Sustainable Factories
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            A comprehensive, end-to-end portal to Measure, Manage, Improve, and Sustain your Environmental, Social, and Governance compliance seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5">
              Explore Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 bg-card text-foreground border border-border px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent transition shadow-sm hover:-translate-y-0.5">
              Secure Login
            </Link>
          </div>
        </section>

        {/* Project Flow Architecture Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How S-M-R ESG Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Our streamlined data flow architecture ensures accuracy from data entry to actionable insights.</p>
            </div>

            <div className="relative">
              {/* Connection line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-emerald-100 via-teal-200 to-blue-100 dark:from-emerald-900/50 dark:via-teal-900/50 dark:to-blue-900/50 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-200 dark:border-emerald-800/50">
                    <Database className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">1. Data Entry</h3>
                  <p className="text-muted-foreground text-sm">Input meter readings, log waste, or upload chemical SDS via intuitive dashboard modals.</p>
                </div>
                
                {/* Step 2 */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-teal-200 dark:border-teal-800/50">
                    <Settings className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">2. Processing</h3>
                  <p className="text-muted-foreground text-sm">Backend calculates CO2e emissions, verifies ZDHC levels, and processes data instantly.</p>
                </div>

                {/* Step 3 */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-200 dark:border-blue-800/50">
                    <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">3. Analytics</h3>
                  <p className="text-muted-foreground text-sm">Real-time KPI cards, aggregations, and charts visualize your exact ESG standing.</p>
                </div>

                {/* Step 4 */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-xl shadow-black/5 dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-200 dark:border-purple-800/50">
                    <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">4. Reporting</h3>
                  <p className="text-muted-foreground text-sm">Generate comprehensive Excel and PDF reports for compliance and stakeholders.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Breakdown Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Comprehensive ESG Modules</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">All 13 dashboard modules categorized to seamlessly cover every aspect of your factory's sustainability.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* E */}
              <div className="bg-card rounded-3xl p-8 shadow-sm border border-border hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all group">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-emerald-200 dark:border-emerald-800/50">
                  <Leaf className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Environmental</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Energy & Emissions</h4>
                      <p className="text-sm text-muted-foreground">Track electricity, gas, diesel, and calculate Scope 1, 2 & 3 Carbon.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Droplets className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Water Management</h4>
                      <p className="text-sm text-muted-foreground">Monitor consumption, recycling, and source data.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Recycle className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Waste & Chemicals</h4>
                      <p className="text-sm text-muted-foreground">Log waste and manage ZDHC MRSL chemical inventory.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* S */}
              <div className="bg-card rounded-3xl p-8 shadow-sm border border-border hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700/50 transition-all group">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-blue-200 dark:border-blue-800/50">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Social</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Worker Committees</h4>
                      <p className="text-sm text-muted-foreground">Manage worker representation and social impact.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Grievance Tracking</h4>
                      <p className="text-sm text-muted-foreground">Record and resolve worker complaints systematically.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Training & CSR</h4>
                      <p className="text-sm text-muted-foreground">Schedule safety trainings and track CSR events & budget.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* G */}
              <div className="bg-card rounded-3xl p-8 shadow-sm border border-border hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700/50 transition-all group">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-purple-200 dark:border-purple-800/50">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Governance</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Compliance & Audits</h4>
                      <p className="text-sm text-muted-foreground">Log audit findings and track CAP (Corrective Action Plans).</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileSearch className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Policies & Documents</h4>
                      <p className="text-sm text-muted-foreground">Centralized secure storage for policies and certificates.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Reporting & Admin</h4>
                      <p className="text-sm text-muted-foreground">Factory profile management and automated PDF/Excel reports.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 dark:bg-background text-slate-400 py-8 text-center border-t border-slate-800 dark:border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-bold text-slate-200 dark:text-foreground">S-M-R ESG</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} S-M-R ESG Portal. All rights reserved.</p>
          <p className="text-xs mt-2 opacity-60">Private & Confidential</p>
        </div>
      </footer>
    </div>
  );
}
