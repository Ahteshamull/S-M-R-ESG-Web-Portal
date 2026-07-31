"use client";

import { useEffect, useState } from "react";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-background flex items-center justify-center">
        <div suppressHydrationWarning className="animate-pulse flex flex-col items-center">
          <div suppressHydrationWarning className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p suppressHydrationWarning className="mt-4 text-emerald-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
