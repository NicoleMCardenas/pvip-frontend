
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  ShieldAlert,
  Users,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { CreateRetentionCase } from "@/components/retention/CreateRetentionCase";
import { ManageRetentionCase } from "@/components/retention/ManageRetentionCase";

import type {
  Client,
  RecoveryClient,
  RetentionCase,
  RetentionCasePriority,
  RetentionCaseStatus,
} from "@/types";

type RetentionPageProps = {
  searchParams: Promise<{
    customerId?: string | string[];
  }>;
};

function formatSatisfaction(value: number | null) {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 5
  ) {
    return "—";
  }

  return `${value} / 5`;
}

function formatNps(value: number | null) {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > 10
  ) {
    return "—";
  }

  return `${value} / 10`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatStatus(status: RetentionCaseStatus) {
  const labels: Record<RetentionCaseStatus, string> = {
    pending: "Pending",
    in_progress: "In progress",
    resolved: "Resolved",
  };

  return labels[status];
}

function formatPriority(priority: RetentionCasePriority) {
  const labels: Record<RetentionCasePriority, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  return labels[priority];
}

function getStatusStyles(status: RetentionCaseStatus) {
  switch (status) {
    case "pending":
      return "border-amber-800/60 bg-amber-950/40 text-amber-300";
    case "in_progress":
      return "border-sky-800/60 bg-sky-950/40 text-sky-300";
    case "resolved":
      return "border-emerald-800/60 bg-emerald-950/40 text-emerald-300";
  }
}

function getPriorityStyles(priority: RetentionCasePriority) {
  switch (priority) {
    case "high":
      return "text-rose-300";
    case "medium":
      return "text-amber-300";
    case "low":
      return "text-slate-300";
  }
}

function CaseCard({
  retentionCase,
  customerName,
}: {
  retentionCase: RetentionCase;
  customerName: string;
}) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Retention case
          </p>

          <h3 className="mt-2 break-words text-lg font-semibold text-white">
            {customerName}
          </h3>
        </div>

        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyles(
            retentionCase.status
          )}`}
        >
          {formatStatus(retentionCase.status)}
        </span>
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        Reason
      </p>

      <p className="mt-2 flex-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">
        {retentionCase.reason}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
        <div>
          <p className="text-xs text-slate-500">Priority</p>

          <p
            className={`mt-1 text-sm font-semibold ${getPriorityStyles(
              retentionCase.priority
            )}`}
          >
            {formatPriority(retentionCase.priority)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            {retentionCase.status === "resolved"
              ? "Resolved"
              : "Created"}
          </p>

          <p className="mt-1 text-sm font-medium text-slate-200">
            {formatDate(
              retentionCase.status === "resolved"
                ? retentionCase.resolved_at
                : retentionCase.created_at
            )}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-800 pt-4">
        <ManageRetentionCase
          retentionCase={retentionCase}
          customerName={customerName}
        />
      </div>
    </article>
  );
}

export default async function RetentionPage({
  searchParams,
}: RetentionPageProps) {
  const params = await searchParams;

  const selectedCustomerId =
    typeof params.customerId === "string"
      ? params.customerId
      : null;

  const [
    recoveryClients,
    retentionCases,
    activeClients,
    archivedClients,
  ] = (await Promise.all([
    apiFetch("/analytics/recovery-queue"),
    apiFetch("/retention/"),
    apiFetch("/clients/"),
    apiFetch("/clients/archived"),
  ])) as [
    RecoveryClient[],
    RetentionCase[],
    Client[],
    Client[],
  ];

  const allClients = [...activeClients, ...archivedClients];

  const customerNames = new Map(
    allClients.map((client) => [client.id, client.name])
  );

  const activeCases = retentionCases.filter(
    (retentionCase) =>
      retentionCase.status === "pending" ||
      retentionCase.status === "in_progress"
  );

  const customersForRetention = activeClients.map((client) => ({
    id: client.id,
    name: client.name,
  }));

  const customersWithOpenCases = new Set(
    activeCases.map((retentionCase) => retentionCase.client_id)
  );

  const eligibleCustomerIds = new Set(
    customersForRetention.map((customer) => customer.id)
  );

  const resolvedCases = retentionCases.filter(
    (retentionCase) => retentionCase.status === "resolved"
  );

  const validNpsScores = recoveryClients
    .map((client) => client.latest_nps)
    .filter(
      (score): score is number =>
        typeof score === "number" &&
        Number.isInteger(score) &&
        score >= 0 &&
        score <= 10
    );

  const detractorCount = validNpsScores.filter(
    (score) => score <= 6
  ).length;

  const selectedCustomer = selectedCustomerId
    ? allClients.find((client) => client.id === selectedCustomerId)
    : undefined;

  const selectedActiveCase = selectedCustomerId
    ? activeCases.find(
        (retentionCase) =>
          retentionCase.client_id === selectedCustomerId
      )
    : undefined;

  const selectedCustomerIsEligible =
    selectedCustomerId !== null &&
    eligibleCustomerIds.has(selectedCustomerId);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Customer intelligence
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Retention
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Identify customers who need attention, manage recovery
            cases, and track retention efforts over time.
          </p>
        </header>

        {selectedCustomerId && (
          <section
            aria-labelledby="selected-customer-heading"
            className="mb-8 rounded-2xl border border-sky-800/60 bg-sky-950/20 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  Selected from Dashboard
                </p>

                <h2
                  id="selected-customer-heading"
                  className="mt-2 break-words text-xl font-semibold text-white"
                >
                  {selectedCustomer?.name ?? "Customer unavailable"}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {!selectedCustomer
                    ? "This customer could not be found in the current business."
                    : selectedActiveCase
                      ? "This customer has an active retention case. Continue managing the existing follow-up."
                      : selectedCustomerIsEligible
                        ? "There is no active retention case for this customer. You can start a new follow-up."
                        : "This customer is not currently eligible for a new retention case."}
                </p>
              </div>

              <Link
                href="/retention"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                View all retention
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            {selectedCustomer && (
              <div className="mt-5 border-t border-sky-900/40 pt-5">
                {selectedActiveCase ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <ManageRetentionCase
                      retentionCase={selectedActiveCase}
                      customerName={selectedCustomer.name}
                    />

                    <span className="text-sm text-slate-400">
                      {formatStatus(selectedActiveCase.status)} ·{" "}
                      {formatPriority(selectedActiveCase.priority)} priority
                    </span>
                  </div>
                ) : selectedCustomerIsEligible ? (
                  <CreateRetentionCase
                    customers={customersForRetention}
                    cases={retentionCases}
                    initialCustomerId={selectedCustomer.id}
                  />
                ) : (
                  <p className="text-sm text-slate-400">
                    No retention action is available for this customer.
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        <section
          aria-label="Retention overview"
          className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {[
            {
              label: "Customers needing attention",
              value: recoveryClients.length,
              description: "Customers in the recovery queue",
              icon: Users,
              iconStyles:
                "border-amber-900/50 bg-amber-950/30 text-amber-400",
            },
            {
              label: "Detractor feedback",
              value: detractorCount,
              description: "Latest NPS between 0 and 6",
              icon: ShieldAlert,
              iconStyles:
                "border-rose-900/50 bg-rose-950/30 text-rose-400",
            },
            {
              label: "Active cases",
              value: activeCases.length,
              description: "Pending or in progress",
              icon: ClipboardList,
              iconStyles:
                "border-sky-900/50 bg-sky-950/30 text-sky-400",
            },
            {
              label: "Resolved cases",
              value: resolvedCases.length,
              description: "Completed recovery follow-ups",
              icon: CheckCircle2,
              iconStyles:
                "border-emerald-900/50 bg-emerald-950/30 text-emerald-400",
            },
          ].map((metric) => {
            const Icon = metric.icon;

            return (
              <article
                key={metric.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${metric.iconStyles}`}
                  >
                    <Icon size={19} aria-hidden="true" />
                  </div>

                  <p className="text-sm font-medium leading-snug text-slate-400">
                    {metric.label}
                  </p>
                </div>

                <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                  {metric.value}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {metric.description}
                </p>
              </article>
            );
          })}
        </section>

        <section
          aria-labelledby="active-cases-heading"
          className="mb-10"
        >
          <div className="mb-5">
            <h2
              id="active-cases-heading"
              className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              Active cases
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Recovery follow-ups that are pending or in progress.
            </p>
          </div>

          {activeCases.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-9">
              <ClipboardList
                size={24}
                className="mb-4 text-slate-500"
                aria-hidden="true"
              />

              <h3 className="text-base font-semibold text-white">
                No active cases
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                No recovery follow-ups are currently open.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {activeCases.map((retentionCase) => (
                <CaseCard
                  key={retentionCase.id}
                  retentionCase={retentionCase}
                  customerName={
                    customerNames.get(retentionCase.client_id) ??
                    "Customer unavailable"
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section
          aria-labelledby="opportunities-heading"
          className="mb-10"
        >
          <div className="mb-5">
            <h2
              id="opportunities-heading"
              className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              Recovery opportunities
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Customer signals that may require a recovery action.
            </p>
          </div>

          {recoveryClients.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-10">
              <CheckCircle2
                size={24}
                className="mb-4 text-emerald-400"
                aria-hidden="true"
              />

              <h3 className="text-base font-semibold text-white">
                No recovery opportunities right now
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                No customers currently meet the recovery queue
                criteria.
              </p>

              <Link
                href="/feedback"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
              >
                Review feedback
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {recoveryClients.map((client) => (
                <article
                  key={client.client_id}
                  className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-semibold text-white">
                        {client.client_name}
                      </h3>

                      {client.client_email && (
                        <p className="mt-1 break-all text-sm text-slate-400">
                          {client.client_email}
                        </p>
                      )}
                    </div>

                    <span className="inline-flex rounded-full border border-amber-800/60 bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-300">
                      Needs attention
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Latest NPS
                      </p>

                      <p className="mt-1 text-xl font-semibold tabular-nums text-white">
                        {formatNps(client.latest_nps)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Satisfaction
                      </p>

                      <p className="mt-1 text-xl font-semibold tabular-nums text-white">
                        {formatSatisfaction(
                          client.latest_satisfaction
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <HeartHandshake
                        size={17}
                        className="text-sky-400"
                        aria-hidden="true"
                      />
                      Recommended action
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {client.recommended_action}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
                    <Link
                      href="/customers"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition hover:text-sky-300"
                    >
                      View customers
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>

                    {customersWithOpenCases.has(client.client_id) ? (
                      <span className="inline-flex items-center gap-2 rounded-xl border border-sky-800/60 bg-sky-950/30 px-4 py-3 text-sm font-medium text-sky-300">
                        <ClipboardList
                          size={16}
                          aria-hidden="true"
                        />
                        Case already open
                      </span>
                    ) : eligibleCustomerIds.has(client.client_id) ? (
                      <CreateRetentionCase
                        customers={customersForRetention}
                        cases={retentionCases}
                        initialCustomerId={client.client_id}
                      />
                    ) : (
                      <span className="text-sm text-slate-500">
                        Customer unavailable
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="resolved-cases-heading">
          <div className="mb-5">
            <h2
              id="resolved-cases-heading"
              className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              Resolved cases
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Historical recovery cases retained for reference.
            </p>
          </div>

          {resolvedCases.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 px-6 py-9">
              <CheckCircle2
                size={24}
                className="mb-4 text-slate-500"
                aria-hidden="true"
              />

              <h3 className="text-base font-semibold text-white">
                No resolved cases yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Completed recovery follow-ups will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {resolvedCases.map((retentionCase) => (
                <CaseCard
                  key={retentionCase.id}
                  retentionCase={retentionCase}
                  customerName={
                    customerNames.get(retentionCase.client_id) ??
                    "Customer unavailable"
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
