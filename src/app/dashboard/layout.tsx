import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { ClientWrapper } from "@/components/client-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientWrapper>
      <div suppressHydrationWarning className="min-h-screen bg-background">
        <Topbar />
        <div suppressHydrationWarning className="flex w-full min-w-0 overflow-x-hidden">
          <Sidebar />
          <main className="flex-1 p-3 sm:p-4 md:p-6 bg-muted/30 ml-0 md:ml-64 min-h-[calc(100vh-64px)] min-w-0 w-full md:max-w-[calc(100vw-16rem)] overflow-x-hidden">
            <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ClientWrapper>
  );
}
