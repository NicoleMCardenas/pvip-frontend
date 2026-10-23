
import { apiFetch } from "@/lib/api";
import type { Survey } from "@/types/survey";
import { AddSurvey } from "@/components/feedback/AddSurvey";
import { SurveyResponsePanel } from "@/components/feedback/SurveyResponsePanel";

type Client = {
  id: string;
  name: string;
};

type Visit = {
  id: string;
  client_id: string;
  visit_date: string;
};

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "America/Mexico_City",
  }).format(date);
}

function getNpsCategory(score: number) {
  if (score >= 9) return "Promoter";
  if (score >= 7) return "Passive";
  return "Detractor";
}

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

function LegacyValue() {
  return (
    <span
      title="Historical value outside the currently accepted range"
      className="inline-flex rounded-lg border border-amber-900/60 bg-amber-950/30 px-2.5 py-1 text-xs font-medium text-amber-300"
    >
      Invalid legacy value
    </span>
  );
}

export default async function FeedbackPage() {
  const [surveys, clients, archivedClients, visits] =
    await Promise.all([
      apiFetch("/surveys/") as Promise<Survey[]>,
      apiFetch("/clients/") as Promise<Client[]>,
      apiFetch("/clients/archived") as Promise<Client[]>,
      apiFetch("/visits/") as Promise<Visit[]>,
    ]);

  const archivedClientIds = new Set(
    archivedClients.map((client) => client.id)
  );

  const clientNames = new Map(
    [...archivedClients, ...clients].map((client) => [
      client.id,
      client.name,
    ])
  );

  const visitDates = new Map(
    visits.map((visit) => [visit.id, visit.visit_date])
  );

  const completedSurveys = surveys.filter(
    (survey) => survey.status === "completed"
  );

  const pendingSurveys = surveys.filter(
    (survey) => survey.status === "pending"
  );

  const satisfactionScores = completedSurveys
    .map((survey) => survey.satisfaction_score)
    .filter(isValidSatisfaction);

  const averageSatisfaction =
    satisfactionScores.length > 0
      ? satisfactionScores.reduce(
          (total, score) => total + score,
          0
        ) / satisfactionScores.length
      : null;

  const npsScores = completedSurveys
    .map((survey) => survey.nps_score)
    .filter(isValidNps);

  const promoters = npsScores.filter(
    (score) => score >= 9
  ).length;

  const detractors = npsScores.filter(
    (score) => score <= 6
  ).length;

  const nps =
    npsScores.length > 0
      ? Math.round(
          ((promoters - detractors) / npsScores.length) *
            100
        )
      : null;

  const responseRate =
    surveys.length > 0
      ? Math.round(
          (completedSurveys.length / surveys.length) *
            100
        )
      : null;

  const sortedSurveys = [...surveys].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Customer intelligence
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Feedback
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Understand customer satisfaction, monitor loyalty,
            and identify opportunities to improve the
            post-service experience.
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
          aria-label="Feedback overview"
          className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              Average satisfaction
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
              Based on {satisfactionScores.length} ratings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              Net Promoter Score
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {nps === null
                ? "—"
                : nps > 0
                  ? `+${nps}`
                  : nps}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Based on {npsScores.length} responses
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              Response rate
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {responseRate === null
                ? "—"
                : `${responseRate}%`}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Completed surveys / total surveys
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              Pending feedback
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {pendingSurveys.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Surveys awaiting a response
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              Survey history
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Review feedback associated with customer visits.
            </p>
          </div>

          {sortedSurveys.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60 text-2xl">
                ◇
              </div>

              <h3 className="text-lg font-semibold text-white">
                No feedback collected yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400">
                Surveys linked to customer visits will appear
                here, along with satisfaction and loyalty
                insights.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Customer
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Visit
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Satisfaction
                    </th>
                    <th className="px-6 py-4 font-medium">
                      NPS
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Rebook intent
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {sortedSurveys.map((survey) => {
                    const customerName = clientNames.get(
                      survey.client_id
                    );

                    const isArchived = archivedClientIds.has(
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
                                "Customer unavailable"}
                            </span>

                            {isArchived && (
                              <span className="inline-flex rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                                Archived
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-400">
                          {formatDate(
                            visitDates.get(survey.visit_id) ??
                              null
                          )}
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {survey.satisfaction_score === null ? (
                            "—"
                          ) : isValidSatisfaction(
                              survey.satisfaction_score
                            ) ? (
                            `${survey.satisfaction_score} / 5`
                          ) : (
                            <LegacyValue />
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {survey.nps_score === null ? (
                            <span className="text-slate-500">
                              —
                            </span>
                          ) : isValidNps(
                              survey.nps_score
                            ) ? (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-slate-200">
                                {survey.nps_score} / 10
                              </span>

                              <span className="text-xs text-slate-500">
                                {getNpsCategory(
                                  survey.nps_score
                                )}
                              </span>
                            </div>
                          ) : (
                            <LegacyValue />
                          )}
                        </td>

                        <td className="px-6 py-5 text-slate-400">
                          {survey.rebook_intent === null ? (
                            "—"
                          ) : isValidRebookIntent(
                              survey.rebook_intent
                            ) ? (
                            <span className="capitalize">
                              {survey.rebook_intent}
                            </span>
                          ) : (
                            <LegacyValue />
                          )}
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
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {survey.status === "pending" ? (
                            <SurveyResponsePanel
                              survey={survey}
                              customerName={
                                customerName ??
                                "Customer unavailable"
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
