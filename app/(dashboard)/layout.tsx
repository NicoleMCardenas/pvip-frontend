
import type { ReactNode } from "react";

import Sidebar from "@/components/layout/Sidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <MobileNavigation />

      <div className="lg:flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="min-w-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
