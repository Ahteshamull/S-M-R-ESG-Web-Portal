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
        <div suppressHydrationWarning className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 bg-muted/30 ml-0 md:ml-64 min-h-[calc(100vh-64px)] w-full">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ClientWrapper>
  );
}
