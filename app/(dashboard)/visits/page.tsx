
import { apiFetch } from "@/lib/api";
import { VisitsPageContent } from "@/components/visits/VisitsPageContent";
import type { Visit } from "@/types/visit";

type Client = {
  id: string;
  name: string;
  status: string;
};

type Service = {
  id: string;
  name: string;
  price: number | string;
  status: string;
};

type StaffMember = {
  id: string;
  name: string;
  status: string;
};

export default async function VisitsPage() {
  const [visits, clients, services, staff] = await Promise.all([
    apiFetch("/visits/") as Promise<Visit[]>,
    apiFetch("/clients/") as Promise<Client[]>,
    apiFetch("/services/") as Promise<Service[]>,
    apiFetch("/staff/") as Promise<StaffMember[]>,
  ]);

  return (
    <VisitsPageContent
      visits={visits}
      clients={clients}
      services={services}
      staff={staff}
    />
  );
}
