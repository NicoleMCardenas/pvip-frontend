export type DashboardMetrics = {
  total_surveys: number;
  completed_surveys: number;
  pending_surveys: number;
  average_satisfaction: number;
  nps_score: number;
  total_clients: number;
  at_risk_clients: number;
};

export type Client = {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
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