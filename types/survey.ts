
export type SurveyStatus = "pending" | "completed";

export type RebookIntent = "yes" | "no" | "unsure";

export type Survey = {
  id: string;
  business_id: string;
  visit_id: string;
  client_id: string;

  status: SurveyStatus;

  satisfaction_score: number | null;
  nps_score: number | null;

  rebook_intent: RebookIntent | null;
  comment: string | null;

  completed_at: string | null;
  created_at: string;
  updated_at: string | null;
};

export type SurveyCreate = {
  visit_id: string;
  client_id: string;
};

export type SurveyResponseUpdate = {
  satisfaction_score?: number | null;
  nps_score?: number | null;
  rebook_intent?: RebookIntent | null;
  comment?: string | null;
};
