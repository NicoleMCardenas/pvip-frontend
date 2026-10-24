
"use client";

import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EditCustomerPanel } from "@/components/customers/EditCustomerPanel";
import { ArchiveCustomer } from "@/components/customers/ArchiveCustomer";

import type { Client } from "@/types";

type ClientsTableProps = {
  clients: Client[];
  showActions?: boolean;
};

export function ClientsTable({
  clients,
  showActions = false,
}: ClientsTableProps) {
  const { language, t } = useLanguage();

  const locale = language === "es" ? "es-MX" : "en-US";

  function formatCurrency(value: string) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
    }).format(Number(value));
  }

  return (
    <section
      className="mt-10"
      aria-labelledby="clients-heading"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="clients-heading"
            className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            {t.customers.title}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {t.customers.portfolioSubtitle}
          </p>
        </div>

        <span className="text-xs font-medium text-slate-400">
          {clients.length}{" "}
          {clients.length === 1
            ? t.customers.customerSingular
            : t.customers.customerPlural}
        </span>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-10 text-center sm:py-12">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/60">
            <UsersRound
              size={22}
              strokeWidth={1.7}
              className="text-sky-400"
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-5 text-base font-semibold text-white">
            {t.customers.noCustomers}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
            {t.customers.noCustomersDescription}
          </p>

          <Link
            href="/customers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            {t.dashboard.addFirstCustomer}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:hidden">
            {clients.map((client) => (
              <article
                key={client.id}
                className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="min-w-0 break-words text-base font-semibold text-white">
                    {client.name}
                  </h3>

                  <StatusBadge status={client.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">
                      {t.customers.totalVisits}
                    </p>

                    <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                      {client.total_visits}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      {t.customers.lifetimeValue}
                    </p>

                    <p className="mt-1 break-words text-lg font-semibold tabular-nums text-white">
                      {formatCurrency(client.lifetime_value)}
                    </p>
                  </div>
                </div>

                {showActions && (
                  <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-800 pt-4">
                    <EditCustomerPanel client={client} />
                    <ArchiveCustomer client={client} />
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 bg-slate-900">
                <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  <th scope="col" className="px-6 py-4">
                    {t.customers.nameColumn}
                  </th>

                  <th scope="col" className="px-6 py-4">
                    {t.common.status}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-right"
                  >
                    {t.customers.visitsColumn}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-4 text-right"
                  >
                    {t.customers.lifetimeValue}
                  </th>

                  {showActions && (
                    <th
                      scope="col"
                      className="px-6 py-4 text-right"
                    >
                      {t.common.actions}
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="transition-colors hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-5 font-medium text-white">
                      {client.name}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={client.status} />
                    </td>

                    <td className="px-6 py-5 text-right tabular-nums text-slate-300">
                      {client.total_visits}
                    </td>

                    <td className="px-6 py-5 text-right font-medium tabular-nums text-white">
                      {formatCurrency(client.lifetime_value)}
                    </td>

                    {showActions && (
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <EditCustomerPanel client={client} />
                          <ArchiveCustomer client={client} />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
