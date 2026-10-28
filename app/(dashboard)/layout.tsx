
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { UnsavedChangesProvider } from "@/components/navigation/UnsavedChangesProvider";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <UnsavedChangesProvider>
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
    </UnsavedChangesProvider>
  );
}
