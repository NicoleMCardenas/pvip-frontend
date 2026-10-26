
"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Info,
} from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";

import type {
  ExperienceTrend,
  ExperienceTrendsResponse,
} from "@/types";

type Metric = "satisfaction" | "nps";

type InsightConfig = {
  metric: Metric;
  title: string;
  description: string;
};

type InsightLabels = {
  insufficientMonths: string;
  higher: string;
  lower: string;
  unchanged: string;
  by: string;
  points: string;
  scorePoints: string;
  validResponse: string;
  validResponses: string;
  limitedSample: string;
  comparisonNote: string;
};

function getMetricValue(
  trend: ExperienceTrend,
  metric: Metric
): number | null {
  return metric === "satisfaction"
    ? trend.average_satisfaction
    : trend.nps_score;
}

function getResponseCount(
  trend: ExperienceTrend,
  metric: Metric
): number {
  return metric === "satisfaction"
    ? trend.satisfaction_responses
    : trend.nps_responses;
}

function formatMonth(
  month: string,
  locale: string
): string {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

function MovementCard({
  trends,
  config,
  locale,
  labels,
}: {
  trends: ExperienceTrend[];
  config: InsightConfig;
  locale: string;
  labels: InsightLabels;
}) {
  const validMonths = trends.filter(
    (trend) => getMetricValue(trend, config.metric) !== null
  );

  const current = validMonths[validMonths.length - 1];
  const previous = validMonths[validMonths.length - 2];

  if (!current || !previous) {
    return (
      <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
        <h3 className="text-base font-semibold text-white">
          {config.title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {config.description}
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-950/60 p-4">
          <Info
            size={18}
            className="mt-0.5 shrink-0 text-slate-400"
            aria-hidden="true"
          />

          <p className="text-sm leading-relaxed text-slate-400">
            {labels.insufficientMonths}
          </p>
        </div>
      </article>
    );
  }

  const currentValue = getMetricValue(current, config.metric)!;
  const previousValue = getMetricValue(previous, config.metric)!;

  const difference = Number(
    (currentValue - previousValue).toFixed(2)
  );

  const isPositive = difference > 0;
  const isNegative = difference < 0;

  const Icon = isPositive
    ? ArrowUpRight
    : isNegative
      ? ArrowDownRight
      : ArrowRight;

  const movementLabel = isPositive
    ? labels.higher
    : isNegative
      ? labels.lower
      : labels.unchanged;

  const currentResponses = getResponseCount(
    current,
    config.metric
  );

  const previousResponses = getResponseCount(
    previous,
    config.metric
  );

  const limitedSample =
    currentResponses < 5 || previousResponses < 5;

  const changeUnit =
    config.metric === "nps"
      ? labels.points
      : labels.scorePoints;

  const formattedDifference =
    difference > 0
      ? `+${difference.toFixed(2)}`
      : difference.toFixed(2);

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <div>
        <h3 className="text-base font-semibold text-white">
          {config.title}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {config.description}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
          <Icon
            size={22}
            className="text-slate-200"
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="text-2xl font-semibold tabular-nums text-white">
            {formattedDifference}
          </p>

          <p className="text-xs text-slate-400">
            {movementLabel} {labels.by}{" "}
            {Math.abs(difference).toFixed(2)}{" "}
            {changeUnit}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[previous, current].map((trend) => {
          const responseCount = getResponseCount(
            trend,
            config.metric
          );

          return (
            <div
              key={trend.month}
              className="rounded-xl bg-slate-950/60 p-3"
            >
              <p className="text-xs text-slate-500">
                {formatMonth(trend.month, locale)}
              </p>

              <p className="mt-2 text-lg font-semibold tabular-nums text-white">
                {getMetricValue(
                  trend,
                  config.metric
                )?.toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {responseCount}{" "}
                {responseCount === 1
                  ? labels.validResponse
                  : labels.validResponses.toLowerCase()}
              </p>
            </div>
          );
        })}
      </div>

      {limitedSample && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-900/40 bg-amber-950/20 p-3">
          <Info
            size={16}
            className="mt-0.5 shrink-0 text-amber-400"
            aria-hidden="true"
          />

          <p className="text-xs leading-relaxed text-amber-200/80">
            {labels.limitedSample}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {labels.comparisonNote}
      </p>
    </article>
  );
}

export default function ExperienceInsights({
  data,
}: {
  data: ExperienceTrendsResponse;
}) {
  const { language, t } = useLanguage();
  const copy = t.intelligence;
  const locale = language === "es" ? "es-MX" : "en-US";

  const insightConfig: InsightConfig[] = [
    {
      metric: "satisfaction",
      title: copy.satisfactionMovement,
      description: copy.satisfactionMovementDescription,
    },
    {
      metric: "nps",
      title: copy.npsMovement,
      description: copy.npsMovementDescription,
    },
  ];

  const labels: InsightLabels = {
    insufficientMonths: copy.insufficientMonths,
    higher: copy.higher,
    lower: copy.lower,
    unchanged: copy.unchanged,
    by: copy.by,
    points: copy.points,
    scorePoints: copy.scorePoints,
    validResponse: copy.validResponse,
    validResponses: copy.validResponses,
    limitedSample: copy.limitedSample,
    comparisonNote: copy.comparisonNote,
  };

  return (
    <section
      aria-labelledby="experience-insights-heading"
      className="mt-10"
    >
      <div className="mb-5">
        <h2
          id="experience-insights-heading"
          className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
        >
          {copy.insightsTitle}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {copy.insightsDescription}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {insightConfig.map((config) => (
          <MovementCard
            key={config.metric}
            trends={data.trends}
            config={config}
            locale={locale}
            labels={labels}
          />
        ))}
      </div>
    </section>
  );
}
