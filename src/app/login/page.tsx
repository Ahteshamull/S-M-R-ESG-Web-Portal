"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);

    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Set a mock auth token in cookies (expires in 1 day)
    const expires = new Date();
    expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
    document.cookie = `esg_auth_token=mock-jwt-token-123;expires=${expires.toUTCString()};path=/`;

    // Redirect to dashboard
    router.push("/dashboard");
    router.refresh(); // Force refresh to apply middleware changes immediately
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100/50 dark:bg-emerald-900/20 blur-[100px]" />
        <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-teal-50/50 dark:bg-teal-900/10 blur-[120px]" />
      </div>

      <div className="glass-card w-full max-w-md p-8 rounded-3xl animate-in fade-in zoom-in-95 duration-500 shadow-xl border border-white/20 dark:border-white/5 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-emerald-500 dark:bg-emerald-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/40 border border-emerald-400 dark:border-emerald-500">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your ESG Portal</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@factory.com" 
                className="w-full bg-emerald-50/30 dark:bg-background border-emerald-200/50 dark:border-border text-foreground border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-500/30 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
              <a href="#" className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••" 
                className="w-full bg-emerald-50/30 dark:bg-background border-emerald-200/50 dark:border-border text-foreground border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:focus:ring-emerald-500/30 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !email || !password}
            className="w-full bg-emerald-600 dark:bg-emerald-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-emerald-500 dark:hover:bg-emerald-500 transition-all flex items-center justify-center group mt-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20 dark:shadow-emerald-900/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-muted-foreground border-t border-border pt-6">
          Protected by Enterprise MFA & Encryption
        </div>
      </div>
    </div>
  );
}
