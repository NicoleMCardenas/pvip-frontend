
export type Visit = {
  id: string;
  business_id: string;
  client_id: string;
  service_id: string;
  staff_id: string;
  visit_date: string;
  amount: number | string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

export type VisitCreate = {
  client_id: string;
  service_id: string;
  staff_id: string;
  visit_date: string;
  amount: number;
  notes: string | null;
};

export type VisitUpdate = Partial<VisitCreate>;

export type VisitDisplay = Visit & {
  client_name: string;
  service_name: string;
  staff_name: string;
};
