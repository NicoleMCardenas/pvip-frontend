
"use client";

import { useMemo } from "react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { AddVisit } from "./AddVisit";
import { EditVisitPanel } from "./EditVisitPanel";
import { DeleteVisitAction } from "./DeleteVisitAction";
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

type VisitsPageContentProps = {
  visits: Visit[];
  clients: Client[];
  services: Service[];
  staff: StaffMember[];
};

export function VisitsPageContent({
  visits,
  clients,
  services,
  staff,
}: VisitsPageContentProps) {
  const { language, t } = useLanguage();
  const copy = t.visits;

  const clientNames = useMemo(
    () => new Map(clients.map((client) => [client.id, client.name])),
    [clients]
  );

  const serviceNames = useMemo(
    () => new Map(services.map((service) => [service.id, service.name])),
    [services]
  );

  const staffNames = useMemo(
    () => new Map(staff.map((member) => [member.id, member.name])),
    [staff]
  );

  const sortedVisits = useMemo(
    () =>
      [...visits].sort(
        (a, b) =>
          new Date(b.visit_date).getTime() -
          new Date(a.visit_date).getTime()
      ),
    [visits]
  );

  const locale = language === "es" ? "es-MX" : "en-US";

  const formatAmount = (amount: number | string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "MXN",
    }).format(Number(amount));

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Mexico_City",
    }).format(new Date(date));

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            {copy.eyebrow}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {copy.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {copy.description}
          </p>

          <div className="mt-6">
            <AddVisit
              clients={clients}
              services={services}
              staff={staff}
            />
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              {copy.historyTitle}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {copy.historyDescription}
            </p>
          </div>

          {sortedVisits.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-white">
                {copy.noVisits}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                {copy.noVisitsDescription}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="border-b border-slate-800 bg-slate-900/70">
                  <tr className="text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-medium">
                      {copy.date}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.customer}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.service}
                    </th>
                    <th className="px-6 py-4 font-medium">
                      {copy.teamMember}
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      {copy.amount}
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      {copy.actions}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {sortedVisits.map((visit) => {
                    const customerName =
                      clientNames.get(visit.client_id) ??
                      copy.customerUnavailable;

                    const serviceName =
                      serviceNames.get(visit.service_id) ??
                      copy.serviceUnavailable;

                    return (
                      <tr
                        key={visit.id}
                        className="transition-colors hover:bg-slate-800/40"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                          {formatDate(visit.visit_date)}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {customerName}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-300">
                          {serviceName}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-300">
                          {staffNames.get(visit.staff_id) ??
                            copy.teamMemberUnavailable}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-white">
                          {formatAmount(visit.amount)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <EditVisitPanel
                              visit={visit}
                              clients={clients}
                              services={services}
                              staff={staff}
                            />

                            <DeleteVisitAction
                              visit={visit}
                              customerName={customerName}
                              serviceName={serviceName}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
