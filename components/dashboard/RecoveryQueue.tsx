
"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

import type { RecoveryClient } from "@/types";

type RecoveryQueueProps = {
  clients: RecoveryClient[];
};

function formatSatisfaction(
  score: number | null | undefined,
) {
  if (
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < 1 ||
    score > 5
  ) {
    return "—";
  }

  return `${score} / 5`;
}

function formatNps(score: number | null | undefined) {
  if (
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > 10
  ) {
    return "—";
  }

  return `${score} / 10`;
}

export function RecoveryQueue({
  clients,
}: RecoveryQueueProps) {
  const { t } = useLanguage();

  return (
    <section
      className="mt-10"
      aria-labelledby="recovery-heading"
    >
      <div className="mb-5">
        <h2
          id="recovery-heading"
          className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
        >
          {t.recoveryQueue.title}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {t.recoveryQueue.description}
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-900/50 bg-emerald-950/40">
            <CheckCircle2
              size={23}
              strokeWidth={1.7}
              className="text-emerald-400"
              aria-hidden="true"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              {t.recoveryQueue.emptyTitle}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              {t.recoveryQueue.emptyDescription}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {clients.map((client) => (
            <article
              key={client.client_id}
              className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6"
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

                <StatusBadge status={client.risk_status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-slate-950/60 p-4">
                <div>
                  <p className="text-xs text-slate-400">
                    {t.recoveryQueue.latestNps}
                  </p>

                  <p className="mt-1 text-xl font-semibold tabular-nums text-white">
                    {formatNps(client.latest_nps)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t.recoveryQueue.latestSatisfaction}
                  </p>

                  <p className="mt-1 text-xl font-semibold tabular-nums text-white">
                    {formatSatisfaction(
                      client.latest_satisfaction,
                    )}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {t.recoveryQueue.scoreNote}
              </p>

              <div className="mt-5 flex-1 border-t border-slate-800 pt-5">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <HeartHandshake
                    size={17}
                    strokeWidth={1.8}
                    className="text-sky-400"
                    aria-hidden="true"
                  />
                  {t.recoveryQueue.recommendedAction}
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {client.recommended_action}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-800 pt-4">
                <Link
                  href={`/retention?customerId=${encodeURIComponent(
                    client.client_id,
                  )}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-800/60 bg-sky-950/30 px-4 py-3 text-sm font-semibold text-sky-300 transition-colors hover:border-sky-700 hover:bg-sky-950/60 hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
                >
                  {t.recoveryQueue.manageRetention}
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
