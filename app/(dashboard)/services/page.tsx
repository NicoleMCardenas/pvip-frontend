
import { apiFetch } from "@/lib/api";
import { AddService } from "@/components/services/AddService";
import { EditService } from "@/components/services/EditService";
import { ServiceStatusAction } from "@/components/services/ServiceStatusAction";
import type { Service } from "@/types/service";

export default async function ServicesPage() {
  const services = (await apiFetch("/services/")) as Service[];

  const activeServices = services.filter(
    (service) => service.status === "active"
  );

  const inactiveServices = services.filter(
    (service) => service.status === "inactive"
  );

  const averagePrice =
    services.length > 0
      ? services.reduce(
          (total, service) => total + Number(service.price),
          0
        ) / services.length
      : 0;

  const sortedServices = [...services].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "active" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(value));

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Business operations
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Services
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Manage your service catalog, monitor availability,
            and keep pricing and service information organized.
          </p>

          <div className="mt-6">
            <AddService />
          </div>
        </header>

        <section
          aria-label="Service overview"
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              Active services
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {activeServices.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Available for new visits
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              Inactive services
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {inactiveServices.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Preserved in historical records
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              Average listed price
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {formatCurrency(averagePrice)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Across all catalog services
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              Service catalog
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Review the services your business offers and
              their current availability.
            </p>
          </div>

          {sortedServices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-white">
                No services yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                Your service catalog is empty. Once services
                are added, they will appear here.
              </p>

              <div className="mt-6">
                <AddService />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-slate-800 bg-slate-900/70">
                  <tr className="text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-medium">
                      Service
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Category
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Duration
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Price
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {sortedServices.map((service) => (
                    <tr
                      key={service.id}
                      className="transition-colors hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-white">
                          {service.name}
                        </p>

                        {service.description && (
                          <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                            {service.description}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {service.category || "Uncategorized"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                        {service.duration_minutes} min
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-white">
                        {formatCurrency(service.price)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            service.status === "active"
                              ? "inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300"
                              : "inline-flex rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300"
                          }
                        >
                          {service.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <EditService service={service} />

                          <ServiceStatusAction service={service} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
