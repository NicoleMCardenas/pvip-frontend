"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Users,
  UserRoundCog,
  BriefcaseBusiness,
  CalendarDays,
  MessageSquareText,
  HeartHandshake,
  CircleDollarSign,
  Settings2,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  {
    label: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Intelligence",
    href: "/intelligence",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Staff",
    href: "/staff",
    icon: UserRoundCog,
  },
  {
    label: "Services",
    href: "/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Visits",
    href: "/visits",
    icon: CalendarDays,
  },
  {
    label: "Feedback",
    href: "/feedback",
    icon: MessageSquareText,
  },
  {
    label: "Retention",
    href: "/retention",
    icon: HeartHandshake,
  },
  {
    label: "Revenue Recovery",
    href: "/revenue-recovery",
    icon: CircleDollarSign,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6">
      <div className="mb-10 px-3">
        <Link href="/" className="block">
          <span className="text-2xl font-bold tracking-tight text-white">
            KAIRO
          </span>

          <span className="mt-1 block text-xs tracking-wide text-slate-400">
            CUSTOMER INTELLIGENCE
          </span>
        </Link>
      </div>

      <nav aria-label="Main navigation" className="flex-1 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white",
              ].join(" ")}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 pt-5">
        <p className="text-xs font-medium text-slate-300">
          KAIRO Platform
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Customer experience & retention
        </p>
      </div>
    </aside>
  );
}
