import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { Client } from "@/types";
import { AddCustomer } from "@/components/customers/AddCustomer";
import { ClientsTable } from "@/components/dashboard/ClientsTable";
import { CustomerFilters } from "@/components/customers/CustomerFilters";

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

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Customer management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Customers
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Understand your customer portfolio, monitor
            relationships, and manage customer information
            from one place.
          </p>
           <div className="mt-6 flex flex-wrap items-center gap-3">
            <AddCustomer />

            <Link
              href="/customers/archived"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-sky-500/50 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              View archived customers
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <CustomerFilters />

        {clients.length > 0 ? (
          <ClientsTable clients={clients} showActions />
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-14 text-center">
            <h2 className="text-lg font-semibold text-white">
              No customers found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              No customers match your current search or filters.
              Try another name or select a different status.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
