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
          <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 bg-muted/20 ml-0 md:ml-64 min-h-[calc(100vh-64px)] min-w-0 w-full md:w-[calc(100vw-16rem)] overflow-x-hidden flex flex-col">
            <div className="w-full max-w-[1720px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500 min-w-0 flex-1 flex flex-col">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ClientWrapper>
  );
}
