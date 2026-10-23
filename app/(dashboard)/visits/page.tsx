
import { apiFetch } from "@/lib/api";
import { AddVisit } from "@/components/visits/AddVisit";
import { EditVisitPanel } from "@/components/visits/EditVisitPanel";
import { DeleteVisitAction } from "@/components/visits/DeleteVisitAction";
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
  const [visits, clients, services, staff] =
    await Promise.all([
      apiFetch("/visits/") as Promise<Visit[]>,
      apiFetch("/clients/") as Promise<Client[]>,
      apiFetch("/services/") as Promise<Service[]>,
      apiFetch("/staff/") as Promise<StaffMember[]>,
    ]);

  const clientNames = new Map(
    clients.map((client) => [client.id, client.name])
  );

  const serviceNames = new Map(
    services.map((service) => [service.id, service.name])
  );

  const staffNames = new Map(
    staff.map((member) => [member.id, member.name])
  );

  const sortedVisits = [...visits].sort(
    (a, b) =>
      new Date(b.visit_date).getTime() -
      new Date(a.visit_date).getTime()
  );

  const formatAmount = (amount: number | string) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(amount));

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Mexico_City",
    }).format(new Date(date));

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Customer activity
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Visits
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Track customer visits, connect services with team
            members, and build a clearer picture of your
            business activity.
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
              Visit history
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Review completed customer visits and their
              associated services and team members.
            </p>
          </div>

          {sortedVisits.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-white">
                No visits recorded yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                Your visit history is empty. Once you record
                customer visits, they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="border-b border-slate-800 bg-slate-900/70">
                  <tr className="text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-medium">
                      Date
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Customer
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Service
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Team member
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {sortedVisits.map((visit) => {
                    const customerName =
                      clientNames.get(visit.client_id) ??
                      "Customer unavailable";

                    const serviceName =
                      serviceNames.get(visit.service_id) ??
                      "Service unavailable";

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
                            "Team member unavailable"}
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
