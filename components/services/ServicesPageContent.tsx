
"use client";

import { useLanguage } from "@/components/language/LanguageProvider";
import { AddService } from "@/components/services/AddService";
import { EditService } from "@/components/services/EditService";
import { ServiceStatusAction } from "@/components/services/ServiceStatusAction";
import type { Service } from "@/types/service";

type ServicesPageContentProps = {
  services: Service[];
};

export function ServicesPageContent({
  services,
}: ServicesPageContentProps) {
  const { t } = useLanguage();
  const copy = t.services;

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
            {copy.eyebrow}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {copy.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            {copy.subtitle}
          </p>

          <div className="mt-6">
            <AddService />
          </div>
        </header>

        <section
          aria-label={copy.catalogLabel}
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              {copy.activeServices}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {activeServices.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {copy.activeServicesDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              {copy.inactiveServices}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {inactiveServices.length}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {copy.inactiveServicesDescription}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <p className="text-sm text-slate-400">
              {copy.averagePrice}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {formatCurrency(averagePrice)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {copy.averagePriceDescription}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              {copy.catalogTitle}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {copy.catalogDescription}
            </p>
          </div>

          {sortedServices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-white">
                {copy.noServices}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                {copy.noServicesDescription}
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
                      {copy.service}
                    </th>

                    <th className="px-6 py-4 font-medium">
                      {copy.category}
                    </th>

                    <th className="px-6 py-4 font-medium">
                      {copy.duration}
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      {copy.price}
                    </th>

                    <th className="px-6 py-4 font-medium">
                      {copy.status}
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      {copy.actions}
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
                        {service.category || copy.uncategorized}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-300">
                        {service.duration_minutes} {copy.minutes}
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
                            ? copy.active
                            : copy.inactive}
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
