import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Clock3,
  RefreshCw,
  UserRound,
  UsersRound,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import ExperienceTrends from "@/components/intelligence/ExperienceTrends";
import ExperienceInsights from "@/components/intelligence/ExperienceInsights";

import type {
  CustomerSegment,
  CustomerSegmentsResponse,
  ExperienceTrendsResponse,
} from "@/types";

type SegmentConfig = {
  key: CustomerSegment;
  label: string;
  description: string;
  color: string;
  icon: typeof UsersRound;
};

const segmentConfig: SegmentConfig[] = [
  {
    key: "new",
    label: "New",
    description: "Customers with no completed visits.",
    color: "bg-sky-400",
    icon: UserRound,
  },
  {
    key: "one_time",
    label: "One-time",
    description: "Customers with one visit in the activity window.",
    color: "bg-violet-400",
    icon: Clock3,
  },
  {
    key: "returning",
    label: "Returning",
    description: "Customers with multiple visits and recent activity.",
    color: "bg-emerald-400",
    icon: RefreshCw,
  },
  {
    key: "inactive",
    label: "Inactive",
    description:
      "Customers whose last completed visit was at least 90 days ago.",
    color: "bg-amber-400",
    icon: UsersRound,
  },
];

function formatPercent(count: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${((count / total) * 100).toFixed(1)}%`;
}

function SegmentCard({
  config,
  count,
  total,
}: {
  config: SegmentConfig;
  count: number;
  total: number;
}) {
  const Icon = config.icon;
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70">
            <Icon
              size={19}
              strokeWidth={1.8}
              className="text-slate-200"
              aria-hidden="true"
            />
          </div>

          <h2 className="text-base font-semibold text-white">
            {config.label}
          </h2>
        </div>

        <span className="text-sm font-medium tabular-nums text-slate-400">
          {formatPercent(count, total)}
        </span>
      </div>

      <p className="mt-6 text-4xl font-semibold tracking-tight tabular-nums text-white">
        {count}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {count === 1 ? "customer" : "customers"}
      </p>

      <div
        className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-label={`${config.label} customer share`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className={`h-full rounded-full ${config.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-slate-400">
        {config.description}
      </p>
    </article>
  );
}

export default async function IntelligencePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  let segmentsData: CustomerSegmentsResponse;
  let trendsData: ExperienceTrendsResponse;

  try {
    await apiFetch("/auth/me");

    [segmentsData, trendsData] = (await Promise.all([
      apiFetch("/analytics/customer-segments"),
      apiFetch("/analytics/experience-trends"),
    ])) as [
      CustomerSegmentsResponse,
      ExperienceTrendsResponse,
    ];
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      redirect("/api/auth/clear-session");
    }

    throw error;
  }

  const total = segmentsData.total_clients;

  return (
    <main className="min-h-screen px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-sky-400">
              <ChartNoAxesCombined
                size={17}
                aria-hidden="true"
              />
              Customer Analytics
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Customer Intelligence
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Understand customer behavior, track experience
              trends, and identify opportunities to improve
              retention.
            </p>
          </div>

          <Link
            href="/customers"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-sky-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            View customers
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <section aria-labelledby="segmentation-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="segmentation-heading"
                className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
              >
                Customer Segmentation
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Based on completed visits and customer activity.
              </p>
            </div>

            <span className="text-sm text-slate-400">
              <span className="font-semibold tabular-nums text-white">
                {total}
              </span>{" "}
              {total === 1 ? "customer" : "customers"} analyzed
            </span>
          </div>

          {total === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-12 text-center">
              <UsersRound
                size={30}
                className="mx-auto text-slate-500"
                aria-hidden="true"
              />

              <h3 className="mt-4 text-lg font-semibold text-white">
                No customers to analyze yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                Customer segments will appear here once you
                start registering customers and their visits.
              </p>

              <Link
                href="/customers"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
              >
                Go to Customers
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {segmentConfig.map((config) => (
                <SegmentCard
                  key={config.key}
                  config={config}
                  count={segmentsData.segments[config.key]}
                  total={total}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-white">
            How segmentation works
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Segments are calculated from visit history, not
            manually assigned customer statuses. Customers
            with no completed visits are classified as New.
            Customers with recent visits are classified as
            One-time or Returning based on visit frequency.
            Customers whose last visit was at least{" "}
            <span className="font-medium text-slate-200">
              {segmentsData.inactivity_threshold_days} days ago
            </span>{" "}
            are classified as Inactive.
          </p>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Archived customers and future visits are excluded
            from the analysis. Risk classification is managed
            separately from these behavioral segments.
          </p>
        </section>

        <ExperienceTrends data={trendsData} />

        <ExperienceInsights data={trendsData} />
      </div>
    </main>
  );
}