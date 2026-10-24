
"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { useLanguage } from "@/components/language/LanguageProvider";

export function DashboardHeader() {
  const { t } = useLanguage();

  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-white">
          {t.dashboard.dashboardHeading}
        </h1>

        <p className="text-slate-400">
          {t.dashboard.dashboardTagline}
        </p>
      </div>

      <LogoutButton />
    </header>
  );
}
