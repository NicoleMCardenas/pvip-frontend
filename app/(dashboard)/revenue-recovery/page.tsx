import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CircleDollarSign,
  ClipboardList,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { RevenueAttributionManager } from "@/components/revenue-recovery/RevenueAttributionManager";
import type { Visit } from "@/types/visit";
import type {
  Client,
  RetentionCase,
  RevenueRecoveryAttribution,
} from "@/types";
import type { RevenueRecoveryMetricsResponse } from "@/types";

function formatCurrency(value: string | number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

const priorityStyles: Record<string, string> = {
  high: "border-rose-800/60 bg-rose-950/40 text-rose-300",
  medium: "border-amber-800/60 bg-amber-950/40 text-amber-300",
  low: "border-slate-700 bg-slate-800 text-slate-300",
};

export default async function RevenueRecoveryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  let metrics: RevenueRecoveryMetricsResponse;
  let cases: RetentionCase[];
  let visits: Visit[];
  let activeCustomers: Client[];
  let archivedCustomers: Client[];
  let attributions: RevenueRecoveryAttribution[];

  try {
    await apiFetch("/auth/me");

    [metrics, cases, visits, activeCustomers, archivedCustomers, attributions] =
      (await Promise.all([
        apiFetch("/revenue-recovery/metrics"),
        apiFetch("/retention/"),
        apiFetch("/visits/"),
        apiFetch("/clients/"),
        apiFetch("/clients/archived"),
        apiFetch("/revenue-recovery/"),
      ])) as [
        RevenueRecoveryMetricsResponse,
        RetentionCase[],
        Visit[],
        Client[],
        Client[],
        RevenueRecoveryAttribution[],
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

  const cards = [
    {
      label: "Revenue at Risk",
      value: formatCurrency(metrics.estimated_revenue_at_risk),
      description: "Estimated value of one potential visit per open case.",
      icon: CircleAlert,
      iconColor: "text-amber-400",
    },
    {
      label: "Recovered Revenue",
      value: formatCurrency(metrics.recovered_revenue),
      description: "Revenue from visits explicitly attributed to retention cases.",
      icon: Wallet,
      iconColor: "text-emerald-400",
    },
    {
      label: "Open Opportunities",
      value: metrics.open_opportunities.toLocaleString("en-US"),
      description: "Retention cases currently requiring follow-up.",
      icon: ClipboardList,
      iconColor: "text-sky-400",
    },
    {
      label: "Resolved Cases",
      value: metrics.resolved_cases.toLocaleString("en-US"),
      description: "Resolved retention cases, regardless of revenue attribution.",
      icon: BadgeCheck,
      iconColor: "text-violet-400",
    },
  ];

  return (
    <main className="min-h-screen px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-sky-400">
              <CircleDollarSign size={17} aria-hidden="true" />
              Business Intelligence
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Revenue Recovery
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Understand the financial impact of customer retention,
              identify revenue at risk, and track revenue associated
              with recovery efforts.
            </p>
          </div>

          <Link
            href="/retention"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-sky-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Manage retention
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </header>

        <section aria-labelledby="revenue-overview-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="revenue-overview-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Revenue Overview
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Financial indicators based on recorded business activity.
              </p>
            </div>

            <span className="text-xs text-slate-500">
              As of {formatDate(metrics.as_of)}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-slate-300">
                      {card.label}
                    </p>
                    <Icon
                      size={20}
                      className={card.iconColor}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-6 break-words text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
                    {card.value}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="recovery-opportunities-heading"
          className="mt-10"
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2
                id="recovery-opportunities-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                Recovery Opportunities
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Open retention cases with their estimated revenue exposure.
              </p>
            </div>

            <span className="text-sm text-slate-400">
              {metrics.open_opportunities} open
            </span>
          </div>

          {metrics.opportunities.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-6 py-12 text-center">
              <TrendingUp
                size={30}
                className="mx-auto text-slate-500"
                aria-hidden="true"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No open recovery opportunities
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                There are no active retention cases to evaluate.
                New opportunities will appear here when cases are opened.
              </p>

              <Link
                href="/retention"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
              >
                View retention cases
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {metrics.opportunities.map((opportunity) => (
                <article
                  key={opportunity.case_id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Retention case
                      </p>
                      <p className="mt-2 font-mono text-sm text-slate-300">
                        {opportunity.case_id.slice(0, 8)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                        priorityStyles[opportunity.priority] ??
                        priorityStyles.low
                      }`}
                    >
                      {opportunity.priority} priority
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <p className="text-sm text-slate-400">
                      Estimated revenue at risk
                    </p>

                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                      {opportunity.estimated_revenue_at_risk === null
                        ? "Insufficient data"
                        : formatCurrency(
                            opportunity.estimated_revenue_at_risk
                          )}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {opportunity.estimated_revenue_at_risk === null
                        ? "No historical visits available for estimation."
                        : "Estimated value of one potential future visit."}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
                    <span className="text-xs capitalize text-slate-400">
                      {opportunity.status.replaceAll("_", " ")}
                    </span>

                    <Link
                      href="/retention"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
                    >
                      Manage case
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <RevenueAttributionManager
          cases={cases}
          visits={visits}
          customers={[...activeCustomers, ...archivedCustomers]}
          attributions={attributions}
        />

        <section
          aria-labelledby="recovery-performance-heading"
          className="mt-10"
        >
          <div className="mb-5">
            <h2
              id="recovery-performance-heading"
              className="text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Recovery Performance
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Attribution coverage and confidence in revenue estimates.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "Attributed Visits",
                value: metrics.attributed_visits,
                description: "Visits linked to retention cases.",
              },
              {
                label: "Cases with Estimates",
                value: metrics.estimated_cases,
                description: "Open cases with sufficient visit history.",
              },
              {
                label: "Insufficient Data",
                value: metrics.insufficient_data_cases,
                description: "Open cases without historical visits.",
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold tabular-nums">
                  {item.value.toLocaleString("en-US")}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-slate-500">
            Revenue at Risk is an estimate, not a forecast or a
            guaranteed loss. Recovered Revenue represents recorded
            visits attributed to retention cases; attribution does not
            establish that the retention action caused the purchase.
          </p>
        </section>
      </div>
    </main>
  );
}
