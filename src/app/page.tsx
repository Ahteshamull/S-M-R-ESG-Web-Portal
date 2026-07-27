import Link from "next/link";
import { ArrowRight, BarChart3, Leaf, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/50 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/30 blur-[100px]" />
      </div>

      <div className="container px-4 md:px-6 flex flex-col items-center text-center max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 mb-4">
          <Leaf className="w-4 h-4 mr-2" />
          <span>ESG Excellence Starts Here</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl">
          Measure. Manage. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
            Improve. Sustain.
          </span>
        </h1>
        
        <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-2xl">
          An Integrated ESG Platform for Environmental, Social & Governance Performance. Simplify tracking, ensure compliance, and drive sustainable growth.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard"
            className="rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all flex items-center group"
          >
            Access Dashboard
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="text-sm font-semibold leading-6 text-foreground hover:text-emerald-600 transition-colors">
            Secure Login <span aria-hidden="true">→</span>
          </Link>
        </div>
        
        {/* Feature Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full pt-8 border-t border-border/50">
          <div className="glass-card rounded-2xl p-6 text-left flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Environmental</h3>
            <p className="text-sm text-muted-foreground">Track carbon emissions, energy, water, and waste with real-time analytics.</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 text-left flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Social</h3>
            <p className="text-sm text-muted-foreground">Manage worker safety, training, CSR initiatives and grievance tracking.</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 text-left flex flex-col">
            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Governance</h3>
            <p className="text-sm text-muted-foreground">Ensure compliance, manage audits, and track critical policies effortlessly.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
