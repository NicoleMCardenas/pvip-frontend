import { RestoreCustomer } from "@/components/customers/RestoreCustomer";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { Client } from "@/types";

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
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Customer management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Archived Customers
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Review archived customer records and restore
            relationships when needed. Customer history
            remains preserved.
          </p>

          <div className="mt-6">
            <Link
              href="/customers"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              <span aria-hidden="true">←</span>
              Back to Customers
            </Link>
          </div>
        </div>

        <form
          action="/customers/archived"
          method="GET"
          className="mb-6 flex flex-col gap-3 sm:flex-row"
          role="search"
        >
          <input
            type="search"
            name="search"
            aria-label="Search archived customers"
            placeholder="Search archived customers..."
            defaultValue={search}
            className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 sm:max-w-sm"
          />

          <button
            type="submit"
            className="min-h-11 rounded-xl bg-sky-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Search
          </button>

          {search && (
            <Link
              href="/customers/archived"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-700 px-4 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Clear
            </Link>
          )}
        </form>

        {clients.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
            <div className="border-b border-slate-800 px-5 py-4 sm:px-6">
              <p className="text-sm font-medium text-slate-200">
                Archived records
                <span className="ml-2 text-slate-500">
                  ({clients.length})
                </span>
              </p>
            </div>

            <div className="divide-y divide-slate-800">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-white">
                      {client.name}
                    </h2>

                    <p className="mt-1 break-all text-sm text-slate-400">
                      {client.email || "No email provided"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Previous status:{" "}
                      <span className="text-slate-300">
                        {client.previous_status
                          ? client.previous_status
                              .replace("_", " ")
                          : "Unknown"}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex w-fit rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-300">
                        Archived
                    </span>

                    <RestoreCustomer client={client} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-14 text-center">
            <h2 className="text-lg font-semibold text-white">
              {search
                ? "No archived customers found"
                : "No archived customers yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              {search
                ? "No archived customers match your search. Try another name."
                : "Archived customer records will appear here when you archive a customer."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
