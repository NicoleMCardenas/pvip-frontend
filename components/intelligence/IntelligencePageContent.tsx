
"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  Clock3,
  RefreshCw,
  UserRound,
  UsersRound,
} from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
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
  customerLabel,
  customerShareLabel,
}: {
  config: SegmentConfig;
  count: number;
  total: number;
  customerLabel: string;
  customerShareLabel: string;
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
        {customerLabel}
      </p>

      <div
        className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        aria-label={`${config.label} · ${customerShareLabel}`}
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

export default function IntelligencePageContent({
  segmentsData,
  trendsData,
}: {
  segmentsData: CustomerSegmentsResponse;
  trendsData: ExperienceTrendsResponse;
}) {
  const { t } = useLanguage();
  const copy = t.intelligence;

  const total = segmentsData.total_clients;

  const segmentConfig: SegmentConfig[] = [
    {
      key: "new",
      label: copy.segmentNew,
      description: copy.segmentNewDescription,
      color: "bg-sky-400",
      icon: UserRound,
    },
    {
      key: "one_time",
      label: copy.segmentOneTime,
      description: copy.segmentOneTimeDescription,
      color: "bg-violet-400",
      icon: Clock3,
    },
    {
      key: "returning",
      label: copy.segmentReturning,
      description: copy.segmentReturningDescription,
      color: "bg-emerald-400",
      icon: RefreshCw,
    },
    {
      key: "inactive",
      label: copy.segmentInactive,
      description: copy.segmentInactiveDescription,
      color: "bg-amber-400",
      icon: UsersRound,
    },
  ];

  const customerLabel = (count: number) =>
    count === 1 ? copy.customer : copy.customers;

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
              {copy.eyebrow}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {copy.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              {copy.description}
            </p>
          </div>

          <Link
            href="/customers"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:border-sky-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {copy.viewCustomers}
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
                {copy.segmentationTitle}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {copy.segmentationDescription}
              </p>
            </div>

            <span className="text-sm text-slate-400">
              <span className="font-semibold tabular-nums text-white">
                {total}
              </span>{" "}
              {customerLabel(total)} {copy.analyzed}
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
                {copy.noCustomersTitle}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                {copy.noCustomersDescription}
              </p>

              <Link
                href="/customers"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
              >
                {copy.goToCustomers}
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
                  customerLabel={customerLabel(
                    segmentsData.segments[config.key]
                  )}
                  customerShareLabel={copy.customerShare}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <h2 className="text-base font-semibold text-white">
            {copy.howSegmentationWorks}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {copy.segmentationExplanationStart}{" "}
            <span className="font-medium text-slate-200">
              {segmentsData.inactivity_threshold_days}{" "}
              {copy.daysAgo}
            </span>{" "}
            {copy.segmentationExplanationEnd}
          </p>

          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {copy.segmentationNote}
          </p>
        </section>

        <ExperienceTrends data={trendsData} />

        <ExperienceInsights data={trendsData} />
      </div>
    </main>
  );
}
