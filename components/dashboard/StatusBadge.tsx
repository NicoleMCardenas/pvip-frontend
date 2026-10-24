
"use client";

import { useLanguage } from "@/components/language/LanguageProvider";

type StatusBadgeProps = {
  status: string;
};

function getStatusClassName(status: string) {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

    case "at_risk":
      return "bg-red-500/10 text-red-400 border border-red-500/20";

    case "new":
      return "bg-sky-500/10 text-sky-400 border border-sky-500/20";

    case "archived":
      return "bg-slate-700/50 text-slate-300 border border-slate-600/50";

    default:
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();

const labels: Record<string, string> = {
  active: t.customers.active,
  at_risk: t.customers.atRisk,
  new: t.customers.new,
  archived: t.customers.archived,
};

const label = labels[status] ?? t.customers.unknown;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(status)}`}
    >
      {label}
    </span>
  );
}
