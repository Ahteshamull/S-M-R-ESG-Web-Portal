"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Building2, Zap, Droplets, Trash2, Cloud, 
  FlaskConical, Scale, FileText, GraduationCap, Users, Heart, 
  BarChart, Settings, LogOut
} from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useEffect } from "react";

const navGroups = [
  {
    title: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { href: "/dashboard/factory", icon: Building2, label: "Factory Profile" },
    ]
  },
  {
    title: "Environment Management System",
    items: [
      { href: "/dashboard/energy", icon: Zap, label: "Energy" },
      { href: "/dashboard/water", icon: Droplets, label: "Water" },
      { href: "/dashboard/waste", icon: Trash2, label: "Waste" },
      { href: "/dashboard/carbon", icon: Cloud, label: "Carbon" },
      { href: "/dashboard/chemicals", icon: FlaskConical, label: "Chemical Mgmt" },
    ]
  },
  {
    title: "Compliance & Docs",
    items: [
      { href: "/dashboard/compliance", icon: Scale, label: "Compliance" },
      { href: "/dashboard/documents", icon: FileText, label: "Documents" },
    ]
  },
  {
    title: "Social & CSR",
    items: [
      { href: "/dashboard/training", icon: GraduationCap, label: "Training" },
      { href: "/dashboard/worker-social", icon: Users, label: "Worker & Social" },
      { href: "/dashboard/csr", icon: Heart, label: "CSR" },
    ]
  }
];

const bottomItems = [
  { href: "/dashboard/reports", icon: BarChart, label: "Reports" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebarStore();

  // Close sidebar on route change for mobile
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`w-64 fixed left-0 top-16 z-50 border-r border-border bg-card flex flex-col h-[calc(100vh-64px)] overflow-y-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <nav className="flex-1 space-y-1 p-4">
          {navGroups.map((group, i) => (
            <div key={i} className="mb-4">
              <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </p>
              {group.items.map((item, j) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={j} 
                    href={item.href} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          {bottomItems.map((item, i) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={i} 
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}

          <button 
            onClick={() => {
              // Usually we would clear the cookie here, but for this mock we just redirect
              document.cookie = "esg_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors mt-2 border border-transparent dark:hover:border-red-900"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
