
import { apiFetch } from "@/lib/api";
import { ServicesPageContent } from "@/components/services/ServicesPageContent";
import type { Service } from "@/types/service";

export default async function ServicesPage() {
  const services = (await apiFetch("/services/")) as Service[];

  return <ServicesPageContent services={services} />;
}
