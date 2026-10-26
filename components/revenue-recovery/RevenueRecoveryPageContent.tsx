"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  CircleDollarSign,
  ClipboardList,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { RevenueAttributionManager } from "@/components/revenue-recovery/RevenueAttributionManager";
import type { Visit } from "@/types/visit";
import type { Client, RetentionCase, RevenueRecoveryAttribution, RevenueRecoveryMetricsResponse } from "@/types";

type Props = {
  metrics: RevenueRecoveryMetricsResponse;
  cases: RetentionCase[];
  visits: Visit[];
  activeCustomers: Client[];
  archivedCustomers: Client[];
  attributions: RevenueRecoveryAttribution[];
};

function formatCurrency(value: string | number, locale: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

const priorityStyles: Record<string, string> = {
  high: "border-rose-800/60 bg-rose-950/40 text-rose-300",
  medium: "border-amber-800/60 bg-amber-950/40 text-amber-300",
  low: "border-slate-700 bg-slate-800 text-slate-300",
};

export default function RevenueRecoveryPageContent({
  metrics, cases, visits, activeCustomers, archivedCustomers, attributions,
}: Props) {
  const { language, t } = useLanguage();
  const copy = t.revenueRecovery;
  const locale = language === "es" ? "es-MX" : "en-US";
  const priorityLabels: Record<string, string> = {
    high: copy.high,
    medium: copy.medium,
    low: copy.low,
  };
  const statusLabels: Record<string, string> = {
    pending: copy.pending,
    in_progress: copy.inProgress,
    resolved: copy.resolved,
  };
  const cards = [
    {
      label: copy.revenueAtRisk,
      value: formatCurrency(metrics.estimated_revenue_at_risk, locale),
      description: copy.revenueAtRiskDescription,
      icon: CircleAlert,
      iconColor: "text-amber-400",
    },
    {
      label: copy.recoveredRevenue,
      value: formatCurrency(metrics.recovered_revenue, locale),
      description: copy.recoveredRevenueDescription,
      icon: Wallet,
      iconColor: "text-emerald-400",
    },
    {
      label: copy.openOpportunities,
      value: metrics.open_opportunities.toLocaleString(locale),
      description: copy.openOpportunitiesDescription,
      icon: ClipboardList,
      iconColor: "text-sky-400",
    },
    {
      label: copy.resolvedCases,
      value: metrics.resolved_cases.toLocaleString(locale),
      description: copy.resolvedCasesDescription,
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
              {copy.eyebrow}
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {copy.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              {copy.description}
            </p>
          </div>

          <Link
            href="/retention"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-sky-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {copy.manageRetention}
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
                {copy.revenueOverview}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {copy.revenueOverviewDescription}
              </p>
            </div>

            <span className="text-xs text-slate-500">
              {copy.asOf} {formatDate(metrics.as_of, locale)}
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
                {copy.recoveryOpportunities}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {copy.recoveryOpportunitiesDescription}
              </p>
            </div>

            <span className="text-sm text-slate-400">
              {metrics.open_opportunities.toLocaleString(locale)} {copy.open}
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
                {copy.noOpenOpportunities}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                {copy.noOpenOpportunitiesDescription}
              </p>

              <Link
                href="/retention"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
              >
                {copy.viewRetentionCases}
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
                        {copy.retentionCase}
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
                      {priorityLabels[opportunity.priority] ?? opportunity.priority} {copy.priority}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-800 pt-5">
                    <p className="text-sm text-slate-400">
                      {copy.estimatedRevenueAtRisk}
                    </p>

                    <p className="mt-2 text-2xl font-semibold tabular-nums">
                      {opportunity.estimated_revenue_at_risk === null
                        ? copy.insufficientData
                        : formatCurrency(
                            opportunity.estimated_revenue_at_risk, locale
                          )}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      {opportunity.estimated_revenue_at_risk === null
                        ? copy.noHistoricalVisits
                        : copy.estimatedFutureVisit}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
                    <span className="text-xs capitalize text-slate-400">
                      {statusLabels[opportunity.status] ?? opportunity.status.replaceAll("_", " ")}
                    </span>

                    <Link
                      href="/retention"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
                    >
                      {copy.manageCase}
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
              {copy.recoveryPerformance}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {copy.recoveryPerformanceDescription}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: copy.attributedVisits,
                value: metrics.attributed_visits,
                description: copy.attributedVisitsDescription,
              },
              {
                label: copy.casesWithEstimates,
                value: metrics.estimated_cases,
                description: copy.casesWithEstimatesDescription,
              },
              {
                label: copy.insufficientDataCases,
                value: metrics.insufficient_data_cases,
                description: copy.insufficientDataCasesDescription,
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-4 text-3xl font-semibold tabular-nums">
                  {item.value.toLocaleString(locale)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-slate-500">
            {copy.financialDisclaimer}
          </p>
        </section>
      </div>
    </main>
  );
}
