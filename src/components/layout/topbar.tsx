"use client";

import { Search, UserCircle, Leaf, Menu } from "lucide-react";
import Link from "next/link";
import { useSidebarStore } from "@/store/useSidebarStore";
import { ThemeToggle } from "@/components/theme-toggle";

export function Topbar() {
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 glass">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="p-2 md:hidden text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="bg-emerald-500 p-1.5 rounded-lg hidden sm:block">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <Link href="/" className="font-bold text-lg tracking-tight">
          S-M-R <span className="text-emerald-600">ESG</span>
        </Link>
      </div>

      <div className="flex-1 max-w-xl mx-4 md:mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search KPIs, reports, factories..." 
            className="w-full bg-muted/50 border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted md:hidden">
          <Search className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />
        <button className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <UserCircle className="w-6 h-6" />
          </div>
          <span className="hidden sm:inline-block">Admin User</span>
        </button>
      </div>
    </header>
  );
}
