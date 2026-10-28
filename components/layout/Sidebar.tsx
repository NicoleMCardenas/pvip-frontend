
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

import { useLanguage } from "@/components/language/LanguageProvider";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";
import { useUnsavedChanges } from "@/components/navigation/UnsavedChangesProvider";
import type { Translations } from "@/lib/i18n";

type NavigationKey = keyof Translations["navigation"];

type NavigationItem = {
  labelKey: NavigationKey;
  href: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  {
    labelKey: "overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    labelKey: "intelligence",
    href: "/intelligence",
    icon: ChartNoAxesCombined,
  },
  {
    labelKey: "customers",
    href: "/customers",
    icon: Users,
  },
  {
    labelKey: "staff",
    href: "/staff",
    icon: UserRoundCog,
  },
  {
    labelKey: "services",
    href: "/services",
    icon: BriefcaseBusiness,
  },
  {
    labelKey: "visits",
    href: "/visits",
    icon: CalendarDays,
  },
  {
    labelKey: "feedback",
    href: "/feedback",
    icon: MessageSquareText,
  },
  {
    labelKey: "retention",
    href: "/retention",
    icon: HeartHandshake,
  },
  {
    labelKey: "revenueRecovery",
    href: "/revenue-recovery",
    icon: CircleDollarSign,
  },
  {
    labelKey: "settings",
    href: "/settings",
    icon: Settings2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const {
    hasUnsavedChanges,
    requestNavigation,
  } = useUnsavedChanges();

  function handleNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
    destination: string
  ) {
    if (
      !hasUnsavedChanges ||
      destination === pathname ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    requestNavigation(destination);
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6">
      <div className="mb-10 px-3">
        <Link
          href="/"
          onClick={(event) => handleNavigation(event, "/")}
          className="block"
        >
          <span className="text-2xl font-bold tracking-tight text-white">
            KAIRO
          </span>

          <span className="mt-1 block text-xs tracking-wide text-slate-400">
            {t.navigation.brandSubtitle}
          </span>
        </Link>
      </div>

      <nav
        aria-label={t.navigation.mainNavigation}
        className="min-h-0 flex-1 space-y-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#475569_#020617]"
      >
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
              onClick={(event) =>
                handleNavigation(event, item.href)
              }
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

              <span>{t.navigation[item.labelKey]}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-4 border-t border-slate-800 px-3 pt-5">
        <LanguageSwitcher />

        <div>
          <p className="text-xs font-medium text-slate-300">
            {t.navigation.platformLabel}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {t.navigation.platformDescription}
          </p>
        </div>
      </div>
    </aside>
  );
}
