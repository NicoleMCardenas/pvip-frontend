
"use client";

import { useLanguage } from "@/components/language/LanguageProvider";
import { AddSurvey } from "@/components/feedback/AddSurvey";
import { SurveyResponsePanel } from "@/components/feedback/SurveyResponsePanel";
import type { Survey } from "@/types/survey";

type Client = {
  id: string;
  name: string;
};

type Visit = {
  id: string;
  client_id: string;
  visit_date: string;
};

type FeedbackPageContentProps = {
  surveys: Survey[];
  clients: Client[];
  archivedClientIds: string[];
  clientNames: Record<string, string>;
  visitDates: Record<string, string>;
  sortedSurveys: Survey[];
  averageSatisfaction: number | null;
  satisfactionCount: number;
  nps: number | null;
  npsCount: number;
  responseRate: number | null;
  pendingCount: number;
  visits: Visit[];
};

function isValidSatisfaction(
  score: number | null
): score is number {
  return (
    typeof score === "number" &&
    Number.isInteger(score) &&
    score >= 1 &&
    score <= 5
  );
}

function isValidNps(
  score: number | null
): score is number {
  return (
    typeof score === "number" &&
    Number.isInteger(score) &&
    score >= 0 &&
    score <= 10
  );
}

function isValidRebookIntent(value: string | null) {
  return (
    value === "yes" ||
    value === "no" ||
    value === "unsure"
  );
}

export function FeedbackPageContent({
  surveys,
  clients,
  archivedClientIds,
  clientNames,
  visitDates,
  sortedSurveys,
  averageSatisfaction,
  satisfactionCount,
  nps,
  npsCount,
  responseRate,
  pendingCount,
  visits,
}: FeedbackPageContentProps) {
  const { language, t } = useLanguage();
  const copy = t.feedback;

  const archivedIds = new Set(archivedClientIds);

  const formatDate = (value: string | null) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat(
      language === "es" ? "es-MX" : "en-US",
      {
        dateStyle: "medium",
        timeZone: "America/Mexico_City",
      }
    ).format(date);
  };

  const getNpsCategory = (score: number) => {
    if (score >= 9) return copy.promoter;
    if (score >= 7) return copy.passive;
    return copy.detractor;
  };

  const legacyValue = (
    <span
      title={copy.invalidLegacyValueDescription}
      className="inline-flex rounded-lg border border-amber-900/60 bg-amber-950/30 px-2.5 py-1 text-xs font-medium text-amber-300"
    >
      {copy.invalidLegacyValue}
    </span>
  );

  const replaceCount = (template: string, count: number) =>
    template.replace("{count}", String(count));

  const rebookLabels = {
    yes: copy.yes,
    no: copy.no,
    unsure: copy.unsure,
  };

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            {copy.eyebrow}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {copy.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {copy.description}
          </p>

          <div className="mt-6">
            <AddSurvey
              visits={visits}
              clients={clients}
              surveys={surveys}
            />
          </div>
        </header>

        <section
          aria-label={copy.overview}
          className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              {copy.averageSatisfaction}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {averageSatisfaction === null
                ? "—"
                : averageSatisfaction.toFixed(1)}

              {averageSatisfaction !== null && (
                <span className="ml-1 text-sm font-normal text-slate-500">
                  / 5
                </span>
              )}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {replaceCount(
                copy.basedOnRatings,
                satisfactionCount
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              {copy.netPromoterScore}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {nps === null
                ? "—"
                : nps > 0
                  ? `+${nps}`
                  : nps}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {replaceCount(copy.basedOnResponses, npsCount)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              {copy.responseRate}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {responseRate === null
                ? "—"
                : `${responseRate}%`}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {copy.responseRateDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              {copy.pendingFeedback}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {pendingCount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {copy.pendingFeedbackDescription}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              {copy.historyTitle}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {copy.historyDescription}
            </p>
          </div>

          {sortedSurveys.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60 text-2xl">
                ◇
              </div>

              <h3 className="text-lg font-semibold text-white">
                {copy.noFeedback}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                {copy.noFeedbackDescription}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      {copy.customer}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.visit}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.satisfaction}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.nps}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.rebookIntent}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.status}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.actions}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {sortedSurveys.map((survey) => {
                    const customerName =
                      clientNames[survey.client_id];

                    const isArchived = archivedIds.has(
                      survey.client_id
                    );

                    return (
                      <tr
                        key={survey.id}
                        className="transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-start gap-2">
                            <span className="font-medium text-slate-200">
                              {customerName ??
                                copy.customerUnavailable}
                            </span>

                            {isArchived && (
                              <span className="inline-flex rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                                {copy.archived}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-400">
                          {formatDate(
                            visitDates[survey.visit_id] ?? null
                          )}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {survey.satisfaction_score === null
                            ? "—"
                            : isValidSatisfaction(
                                survey.satisfaction_score
                              )
                              ? `${survey.satisfaction_score} / 5`
                              : legacyValue}
                        </td>

                        <td className="px-6 py-5">
                          {survey.nps_score === null ? (
                            <span className="text-slate-500">
                              —
                            </span>
                          ) : isValidNps(survey.nps_score) ? (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-slate-200">
                                {survey.nps_score} / 10
                              </span>

                              <span className="text-xs text-slate-500">
                                {getNpsCategory(survey.nps_score)}
                              </span>
                            </div>
                          ) : (
                            legacyValue
                          )}
                        </td>

                        <td className="px-6 py-5 text-slate-400">
                          {survey.rebook_intent === null
                            ? "—"
                            : isValidRebookIntent(
                                survey.rebook_intent
                              )
                              ? rebookLabels[survey.rebook_intent]
                              : legacyValue}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={
                              survey.status === "completed"
                                ? "inline-flex rounded-full border border-emerald-800/60 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300"
                                : "inline-flex rounded-full border border-amber-800/60 bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-300"
                            }
                          >
                            {survey.status === "completed"
                              ? copy.completed
                              : copy.pending}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {survey.status === "pending" ? (
                            <SurveyResponsePanel
                              survey={survey}
                              customerName={
                                customerName ??
                                copy.customerUnavailable
                              }
                            />
                          ) : (
                            <span className="text-xs text-slate-500">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
