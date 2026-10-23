
export type DashboardMetrics = {
  total_surveys: number;
  completed_surveys: number;
  pending_surveys: number;
  average_satisfaction: number;
  nps_score: number;
  total_clients: number;
  at_risk_clients: number;
};

export type ClientStatus = "new" | "active" | "at_risk";

export type Client = {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: ClientStatus | "archived";
  previous_status: ClientStatus | null;
  lifetime_value: string;
  total_visits: number;
  last_visit: string | null;
  created_at: string;
  updated_at: string | null;
};

export type RecoveryClient = {
  client_id: string;
  client_name: string;
  client_email: string;
  risk_status: string;
  latest_nps: number | null;
  latest_satisfaction: number | null;
  recommended_action: string;
};

export type RetentionCaseStatus =
  | "pending"
  | "in_progress"
  | "resolved";

export type RetentionCasePriority =
  | "low"
  | "medium"
  | "high";

export type RetentionActivityType =
  | "call"
  | "email"
  | "message"
  | "other";

export type RetentionActivityOutcome =
  | "contacted"
  | "no_response"
  | "follow_up_needed"
  | "other";

export type RetentionCase = {
  id: string;
  business_id: string;
  client_id: string;
  reason: string;
  status: RetentionCaseStatus;
  priority: RetentionCasePriority;
  created_at: string;
  updated_at: string | null;
  resolved_at: string | null;
};

export type RetentionActivity = {
  id: string;
  case_id: string;
  activity_type: RetentionActivityType;
  outcome: RetentionActivityOutcome | null;
  notes: string | null;
  created_at: string;
};

export type RetentionCaseCreate = {
  client_id: string;
  reason: string;
  priority: RetentionCasePriority;
};

export type RetentionCaseUpdate = {
  status?: RetentionCaseStatus;
  priority?: RetentionCasePriority;
};

export type RetentionActivityCreate = {
  activity_type: RetentionActivityType;
  outcome?: RetentionActivityOutcome | null;
  notes?: string | null;
};

export type CustomerSegment =
  | "new"
  | "one_time"
  | "returning"
  | "inactive";

export type CustomerSegmentsResponse = {
  total_clients: number;
  inactivity_threshold_days: number;
  as_of: string;
  segments: Record<CustomerSegment, number>;
};

export type ExperienceTrend = {
  month: string;
  average_satisfaction: number | null;
  satisfaction_responses: number;
  nps_score: number | null;
  nps_responses: number;
};

export type ExperienceTrendsResponse = {
  period_months: number;
  timezone: string;
  as_of: string;
  trends: ExperienceTrend[];
};
export type RevenueRecoveryAttribution = {
  id: string;
  case_id: string;
  visit_id: string;
  created_at: string;
};

export type RevenueRecoveryCreate = {
  case_id: string;
  visit_id: string;
};

export type RecoveryOpportunity = {
  case_id: string;
  client_id: string;
  priority: RetentionCasePriority;
  status: RetentionCaseStatus;
  estimated_revenue_at_risk: string | null;
};

export type RevenueRecoveryMetricsResponse = {
  as_of: string;
  open_opportunities: number;
  resolved_cases: number;
  estimated_revenue_at_risk: string;
  estimated_cases: number;
  insufficient_data_cases: number;
  recovered_revenue: string;
  attributed_visits: number;
  opportunities: RecoveryOpportunity[];
};
