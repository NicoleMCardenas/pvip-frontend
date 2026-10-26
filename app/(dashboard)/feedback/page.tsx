
import { FeedbackPageContent } from "@/components/feedback/FeedbackPageContent";
import { apiFetch } from "@/lib/api";
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
    <FeedbackPageContent
      surveys={surveys}
      clients={clients}
      archivedClientIds={Array.from(archivedClientIds)}
      clientNames={Object.fromEntries(clientNames)}
      visitDates={Object.fromEntries(visitDates)}
      sortedSurveys={sortedSurveys}
      averageSatisfaction={averageSatisfaction}
      satisfactionCount={satisfactionScores.length}
      nps={nps}
      npsCount={npsScores.length}
      responseRate={responseRate}
      pendingCount={pendingSurveys.length}
      visits={visits}
    />
  );
}
