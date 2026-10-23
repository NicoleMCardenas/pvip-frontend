
export type ServiceStatus = "active" | "inactive";

export type Service = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  category: string | null;
  duration_minutes: number;
  price: number | string;
  status: ServiceStatus;
  created_at: string;
  updated_at: string | null;
};

export type ServiceCreate = {
  name: string;
  description: string | null;
  category: string | null;
  duration_minutes: number;
  price: number;
};

export type ServiceUpdate = Partial<
  ServiceCreate & {
    status: ServiceStatus;
  }
>;
