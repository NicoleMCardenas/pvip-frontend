
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";

type DashboardLinksProps = {
  destination: "customers" | "retention";
};

export function DashboardLinks({
  destination,
}: DashboardLinksProps) {
  const { t } = useLanguage();

  const links = {
    customers: {
      href: "/customers",
      label: t.dashboard.viewAllCustomers,
    },
    retention: {
      href: "/retention",
      label: t.dashboard.viewRetention,
    },
  };

  const link = links[destination];

  return (
    <div className="mt-4 flex justify-end">
      <Link
        href={link.href}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        {link.label}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}
