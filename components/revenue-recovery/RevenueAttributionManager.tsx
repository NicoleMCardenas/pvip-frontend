"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Link2,
  Trash2,
  X,
} from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";

import type {
  Client,
  RetentionCase,
  RevenueRecoveryAttribution,
} from "@/types";
import type { Visit } from "@/types/visit";

type Props = {
  cases: RetentionCase[];
  visits: Visit[];
  customers: Client[];
  attributions: RevenueRecoveryAttribution[];
};

function money(value: number | string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "MXN",
  }).format(Number(value));
}

function date(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(value));
}

function getError(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "detail" in data &&
    typeof data.detail === "string"
  ) {
    return data.detail;
  }

  return fallback;
}

export function RevenueAttributionManager({
  cases,
  visits,
  customers,
  attributions,
}: Props) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const copy = t.revenueRecovery;
  const locale = language === "es" ? "es-MX" : "en-US";
  const formatMoney = (value: number | string) => money(value, locale);
  const formatDate = (value: string) => date(value, locale);
  const statusLabel = (status: string) =>
    status === "pending" ? copy.pending :
    status === "in_progress" ? copy.inProgress :
    status === "resolved" ? copy.resolved : status;
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [selectedVisitId, setSelectedVisitId] = useState("");
  const [pendingAction, setPendingAction] = useState<
    { type: "create" } | { type: "delete"; id: string } | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [eligibilityCheckedAt, setEligibilityCheckedAt] = useState<number | null>(
  null
  );
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.name])
  );

  const caseMap = new Map(cases.map((item) => [item.id, item]));
  const visitMap = new Map(visits.map((visit) => [visit.id, visit]));

  const attributedVisitIds = new Set(
    attributions.map((item) => item.visit_id)
  );

  const sortedCases = [...cases].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  const selectedCase = caseMap.get(selectedCaseId);
  const selectedVisit = visitMap.get(selectedVisitId);

  const eligibleVisits = selectedCase
    ? visits
        .filter((visit) => {
          const visitTime = new Date(visit.visit_date).getTime();
          const createdTime = new Date(selectedCase.created_at).getTime();
          const resolvedTime = selectedCase.resolved_at
            ? new Date(selectedCase.resolved_at).getTime()
            : null;

          return (
            visit.client_id === selectedCase.client_id &&
            Number(visit.amount) > 0 &&
            visitTime >= createdTime &&
            eligibilityCheckedAt !== null &&
            visitTime <= eligibilityCheckedAt &&
            (resolvedTime === null || visitTime <= resolvedTime) &&
            !attributedVisitIds.has(visit.id)
          );
        })
        .sort(
          (a, b) =>
            new Date(b.visit_date).getTime() -
            new Date(a.visit_date).getTime()
        )
    : [];

  const selectedAttribution =
    pendingAction?.type === "delete"
      ? attributions.find((item) => item.id === pendingAction.id)
      : null;

  useEffect(() => {
    if (!pendingAction) return;

    cancelRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) {
        setPendingAction(null);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [pendingAction, loading]);

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function confirmAction() {
    if (!pendingAction || loading) return;

    const action = pendingAction;
    setLoading(true);
    clearMessages();

    try {
      const isCreate = action.type === "create";

      const response = await fetch(
        isCreate
          ? "/api/revenue-recovery"
          : `/api/revenue-recovery/${encodeURIComponent(action.id)}`,
        {
          method: isCreate ? "POST" : "DELETE",
          ...(isCreate
            ? {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  case_id: selectedCaseId,
                  visit_id: selectedVisitId,
                }),
              }
            : {}),
        }
      );

      const data =
        response.status === 204
          ? null
          : await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getError(
            data,
            isCreate
              ? copy.unableToAttribute
              : copy.unableToRemove
          )
        );
      }

      setPendingAction(null);
      setSuccess(
        isCreate
          ? copy.attributionRecorded
          : copy.attributionRemoved
      );

      if (isCreate) {
        setSelectedVisitId("");
      }

      router.refresh();
    } catch (err) {
      setPendingAction(null);
      setError(
        err instanceof Error
          ? err.message
          : copy.unexpectedError
      );
    } finally {
      setLoading(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  return (
    <section
      aria-labelledby="attribution-heading"
      className="mt-10"
    >
      <div className="mb-5">
        <div className="flex items-center gap-2 text-sm font-medium text-sky-400">
          <Link2 size={17} aria-hidden="true" />
          {copy.revenueAttribution}
        </div>

        <h2
          id="attribution-heading"
          className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl"
        >
          {copy.trackRecoveredRevenue}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          {copy.attributionDescription}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <h3 className="text-base font-semibold text-white">
            {copy.newAttribution}
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            {copy.newAttributionDescription}
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="revenue-case"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                {copy.retentionCase}
              </label>

              <select
                id="revenue-case"
                value={selectedCaseId}
                disabled={loading || cases.length === 0}
                onChange={(event) => {
                  setSelectedCaseId(event.target.value);
                  setSelectedVisitId("");
                  setEligibilityCheckedAt(Date.now());
                  clearMessages();
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-50"
              >
                <option value="">{copy.selectRetentionCase}</option>

                {sortedCases.map((item) => (
                  <option key={item.id} value={item.id}>
                    {customerNames.get(item.client_id) ??
                      copy.customerUnavailable}{" "}
                    · {statusLabel(item.status)} ·{" "}
                    {formatDate(item.created_at)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="revenue-visit"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                {copy.eligibleVisit}
              </label>

              <select
                id="revenue-visit"
                value={selectedVisitId}
                disabled={
                  loading ||
                  !selectedCaseId ||
                  eligibleVisits.length === 0
                }
                onChange={(event) => {
                  setSelectedVisitId(event.target.value);
                  clearMessages();
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-50"
              >
                <option value="">{copy.selectVisit}</option>

                {eligibleVisits.map((visit) => (
                  <option key={visit.id} value={visit.id}>
                    {formatDate(visit.visit_date)} · {formatMoney(visit.amount)}
                  </option>
                ))}
              </select>

              {selectedCaseId && eligibleVisits.length === 0 && (
                <p className="mt-3 text-sm leading-relaxed text-amber-300">
                  {copy.noEligibleVisits}
                </p>
              )}
            </div>

            {selectedVisit && (
              <div className="rounded-xl border border-sky-900/50 bg-sky-950/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-sky-400">
                  {copy.attributionPreview}
                </p>

                <p className="mt-3 text-2xl font-semibold tabular-nums text-white">
                  {formatMoney(selectedVisit.amount)}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {customerNames.get(selectedVisit.client_id) ??
                    copy.customerUnavailable}{" "}
                  · {formatDate(selectedVisit.visit_date)}
                </p>
              </div>
            )}

            <button
              ref={triggerRef}
              type="button"
              disabled={!selectedCaseId || !selectedVisitId || loading}
              onClick={() => {
                clearMessages();
                setPendingAction({ type: "create" });
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Link2 size={17} aria-hidden="true" />
              {copy.attributeRevenue}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-white">
              {copy.recordedAttributions}
            </h3>

            <span className="text-sm tabular-nums text-slate-400">
              {attributions.length}
            </span>
          </div>

          {attributions.length === 0 ? (
            <div className="py-12 text-center">
              <CircleAlert
                size={27}
                className="mx-auto text-slate-500"
                aria-hidden="true"
              />
              <p className="mt-4 font-medium text-white">
                {copy.noAttributedRevenue}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                {copy.noAttributedRevenueDescription}
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {attributions.map((attribution) => {
                const itemCase = caseMap.get(attribution.case_id);
                const visit = visitMap.get(attribution.visit_id);

                return (
                  <article
                    key={attribution.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-white">
                          {itemCase
                            ? customerNames.get(itemCase.client_id) ??
                              copy.customerUnavailable
                            : copy.retentionCaseUnavailable}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {visit
                            ? formatDate(visit.visit_date)
                            : copy.visitUnavailable}
                        </p>

                        <p className="mt-3 text-lg font-semibold tabular-nums text-emerald-300">
                          {visit
                            ? formatMoney(visit.amount)
                            : copy.amountUnavailable}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={loading}
                        aria-label={copy.removeRevenueAttribution}
                        onClick={() => {
                          clearMessages();
                          setPendingAction({
                            type: "delete",
                            id: attribution.id,
                          });
                        }}
                        className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:border-rose-800 hover:bg-rose-950/30 hover:text-rose-300 disabled:opacity-50"
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-rose-900 bg-rose-950/40 p-4 text-sm text-rose-300"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-900 bg-emerald-950/30 p-4 text-sm text-emerald-300"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          {success}
        </div>
      )}

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="revenue-confirm-title"
            aria-describedby="revenue-confirm-description"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3
                id="revenue-confirm-title"
                className="text-lg font-semibold text-white"
              >
                {pendingAction.type === "create"
                  ? copy.confirmRevenueAttribution
                  : copy.removeRevenueAttributionQuestion}
              </h3>

              <button
                type="button"
                disabled={loading}
                aria-label={copy.closeConfirmation}
                onClick={() => setPendingAction(null)}
                className="text-slate-400 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <p
              id="revenue-confirm-description"
              className="mt-4 text-sm leading-relaxed text-slate-400"
            >
              {pendingAction.type === "create"
                ? copy.confirmAttributionDescription.replace(
                    "{amount}",
                    selectedVisit ? formatMoney(selectedVisit.amount) : copy.thisVisit
                  )
                : copy.removeAttributionDescription.replace(
                    "{amount}",
                    selectedAttribution &&
                    visitMap.get(selectedAttribution.visit_id)
                      ? ` ${formatMoney(
                          visitMap.get(selectedAttribution.visit_id)!.amount
                        )}`
                      : ""
                  )}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                disabled={loading}
                onClick={() => setPendingAction(null)}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
              >
                {copy.cancel}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={confirmAction}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50 ${
                  pendingAction.type === "create"
                    ? "bg-sky-500 text-slate-950 hover:bg-sky-400"
                    : "bg-rose-500 text-white hover:bg-rose-400"
                }`}
              >
                {loading
                  ? copy.processing
                  : pendingAction.type === "create"
                    ? copy.confirmAttribution
                    : copy.removeAttribution}
                {!loading && <ArrowRight size={16} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
