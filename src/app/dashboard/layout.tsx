import type { ReactNode } from "react";
import { Sidebar, MobileNav } from "@/components/dashboard/Sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar — fixed left column */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <Sidebar />
        </div>

        {/* Main content — offset by sidebar width on desktop */}
        <main className="flex-1 overflow-y-auto lg:pl-64 pb-16 lg:pb-0">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
