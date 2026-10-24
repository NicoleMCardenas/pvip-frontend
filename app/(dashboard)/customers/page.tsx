
import { apiFetch } from "@/lib/api";
import type { Client } from "@/types";
import { CustomersPageContent } from "@/components/customers/CustomersPageContent";

type CustomersPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = params.status ?? "";

  const query = new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  if (["new", "active", "at_risk"].includes(status)) {
    query.set("status", status);
  }

  const endpoint = query.toString()
    ? `/clients/?${query.toString()}`
    : "/clients/";

  const clients = (await apiFetch(endpoint)) as Client[];

  return <CustomersPageContent clients={clients} />;
}
