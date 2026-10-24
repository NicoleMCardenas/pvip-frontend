
import { apiFetch } from "@/lib/api";
import type { Client } from "@/types";
import { ArchivedCustomersPageContent } from "@/components/customers/ArchivedCustomersPageContent";

type ArchivedCustomersPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function ArchivedCustomersPage({
  searchParams,
}: ArchivedCustomersPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";

  const query = new URLSearchParams();

  if (search) {
    query.set("search", search);
  }

  const endpoint = query.toString()
    ? `/clients/archived?${query.toString()}`
    : "/clients/archived";

  const clients = (await apiFetch(endpoint)) as Client[];

  return (
    <ArchivedCustomersPageContent
      clients={clients}
      search={search}
    />
  );
}
