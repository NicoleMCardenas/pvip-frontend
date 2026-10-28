
export type Business = {
  id: string;
  name: string;
  industry: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type AuthenticatedUser = {
  id: string;
  business_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export type BusinessUpdate = {
  name?: string;
  industry?: string;
  email?: string;
  phone?: string | null;
};
