
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Loader2,
  Settings2,
  X,
} from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";

import type {
  RetentionActivity,
  RetentionActivityCreate,
  RetentionActivityOutcome,
  RetentionActivityType,
  RetentionCase,
  RetentionCasePriority,
  RetentionCaseStatus,
  RetentionCaseUpdate,
} from "@/types";

type ManageRetentionCaseProps = {
  retentionCase: RetentionCase;
  customerName: string;
};

function formatDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ManageRetentionCase({
  retentionCase,
  customerName,
}: ManageRetentionCaseProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const copy = t.retention;
  const locale = language === "es" ? "es-MX" : "en-US";

  const activityLabels: Record<RetentionActivityType, string> = {
    call: copy.phoneCall,
    email: copy.email,
    message: copy.message,
    other: copy.other,
  };

  const outcomeLabels: Record<RetentionActivityOutcome, string> = {
    contacted: copy.contacted,
    no_response: copy.noResponse,
    follow_up_needed: copy.followUpNeeded,
    other: copy.other,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<RetentionCaseStatus>(
    retentionCase.status
  );
  const [priority, setPriority] =
    useState<RetentionCasePriority>(retentionCase.priority);

  const [activities, setActivities] = useState<RetentionActivity[]>(
    []
  );
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState("");

  const [activityType, setActivityType] =
    useState<RetentionActivityType>("call");
  const [outcome, setOutcome] =
    useState<RetentionActivityOutcome | "">("");
  const [notes, setNotes] = useState("");

  const [savingCase, setSavingCase] = useState(false);
  const [savingActivity, setSavingActivity] = useState(false);
  const [caseError, setCaseError] = useState("");
  const [activityError, setActivityError] = useState("");
  const [caseSuccess, setCaseSuccess] = useState("");
  const [activitySuccess, setActivitySuccess] = useState("");
  const [showResolveConfirmation, setShowResolveConfirmation] =
    useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] =
    useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const confirmationCancelRef = useRef<HTMLButtonElement>(null);

  const isResolved = retentionCase.status === "resolved";
  const busy = savingCase || savingActivity;

  const hasCaseChanges =
    status !== retentionCase.status ||
    priority !== retentionCase.priority;

  const hasActivityChanges =
    activityType !== "call" ||
    outcome !== "" ||
    notes.trim() !== "";

  const hasUnsavedChanges =
    !isResolved && (hasCaseChanges || hasActivityChanges);

  const dirtyRef = useRef(hasUnsavedChanges);
  const busyRef = useRef(busy);
  const confirmationOpenRef = useRef(false);
  const requestCloseRef = useRef<() => void>(() => {});

  useEffect(() => {
  dirtyRef.current = hasUnsavedChanges;
  busyRef.current = busy;
  }, [hasUnsavedChanges, busy]);

  const closePanel = useCallback(() => {
    confirmationOpenRef.current = false;
    setShowResolveConfirmation(false);
    setShowDiscardConfirmation(false);
    setIsOpen(false);
    setCaseError("");
    setActivityError("");
    setCaseSuccess("");
    setActivitySuccess("");

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const requestClose = useCallback(() => {
    if (busyRef.current) return;

    if (dirtyRef.current) {
      confirmationOpenRef.current = true;
      setShowDiscardConfirmation(true);
      return;
    }

    closePanel();
  }, [closePanel]);

  useEffect(() => {
  requestCloseRef.current = requestClose;
  }, [requestClose]);

  const loadActivities = useCallback(async () => {
    setActivitiesLoading(true);
    setActivitiesError("");

    try {
      const response = await fetch(
        `/api/retention/${encodeURIComponent(
          retentionCase.id
        )}/activities`,
        { cache: "no-store" }
      );

      const data: unknown = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const detail =
          data &&
          typeof data === "object" &&
          "detail" in data &&
          typeof data.detail === "string"
            ? data.detail
            : copy.unableToLoadActivities;

        throw new Error(detail);
      }

      if (!Array.isArray(data)) {
        throw new Error(copy.unexpectedActivityResponse);
      }

      setActivities(data as RetentionActivity[]);
    } catch (error) {
      setActivitiesError(
        error instanceof Error
          ? error.message
          : copy.unableToLoadActivities
      );
    } finally {
      setActivitiesLoading(false);
    }
  }, [retentionCase.id]);

  function openPanel() {
    setStatus(retentionCase.status);
    setPriority(retentionCase.priority);
    setActivityType("call");
    setOutcome("");
    setNotes("");
    setCaseError("");
    setActivityError("");
    setCaseSuccess("");
    setActivitySuccess("");
    setActivities([]);
    setIsOpen(true);
    void loadActivities();
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (confirmationOpenRef.current) {
          confirmationOpenRef.current = false;
          setShowDiscardConfirmation(false);
          setShowResolveConfirmation(false);
          closeRef.current?.focus();
        } else {
          requestCloseRef.current();
        }

        return;
      }

      if (event.key !== "Tab") return;

      const container = confirmationOpenRef.current
        ? confirmationRef.current
        : panelRef.current;

      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
        )
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (
        active === last ||
        !container.contains(active)
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (showResolveConfirmation || showDiscardConfirmation) {
      confirmationCancelRef.current?.focus();
    }
  }, [showResolveConfirmation, showDiscardConfirmation]);

  async function updateCase(
    payload: RetentionCaseUpdate,
    resolving = false
  ) {
    if (busy || isResolved) return;

    setSavingCase(true);
    setCaseError("");
    setCaseSuccess("");

    try {
      const response = await fetch(
        `/api/retention/${encodeURIComponent(retentionCase.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : copy.unableToUpdateCase
        );
      }

      confirmationOpenRef.current = false;
      setShowResolveConfirmation(false);

      if (resolving) {
        closePanel();
      } else {
        setCaseSuccess(copy.caseUpdated);
        setStatus(data.status);
        setPriority(data.priority);
      }

      router.refresh();
    } catch (error) {
      confirmationOpenRef.current = false;
      setShowResolveConfirmation(false);

      setCaseError(
        error instanceof Error
          ? error.message
          : copy.unableToUpdateCase
      );
    } finally {
      setSavingCase(false);
    }
  }

  async function saveActivity(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (busy || isResolved) return;

    setSavingActivity(true);
    setActivityError("");
    setActivitySuccess("");

    const payload: RetentionActivityCreate = {
      activity_type: activityType,
      outcome: outcome || null,
      notes: notes.trim() || null,
    };

    try {
      const response = await fetch(
        `/api/retention/${encodeURIComponent(
          retentionCase.id
        )}/activities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : copy.unableToRecordActivity
        );
      }

      setActivityType("call");
      setOutcome("");
      setNotes("");
      setActivitySuccess(copy.activityRecorded);

      await loadActivities();
      router.refresh();
    } catch (error) {
      setActivityError(
        error instanceof Error
          ? error.message
          : copy.unableToRecordActivity
      );
    } finally {
      setSavingActivity(false);
    }
  }

  function requestResolve() {
    if (busy || isResolved) return;

    if (hasCaseChanges || hasActivityChanges) {
      setCaseError(
        copy.saveBeforeResolving
      );
      return;
    }

    setCaseError("");
    confirmationOpenRef.current = true;
    setShowResolveConfirmation(true);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openPanel}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-sky-700 hover:bg-slate-800 hover:text-white"
      >
        <Settings2 size={16} aria-hidden="true" />
        {isResolved ? copy.viewHistory : copy.manageCase}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => {
              if (!confirmationOpenRef.current) requestClose();
            }}
          />

          <section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-retention-title"
            className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  {copy.title}
                </p>
                <h2
                  id="manage-retention-title"
                  className="mt-1 text-lg font-semibold text-white"
                >
                  {customerName}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {isResolved
                    ? copy.resolvedCaseHistory
                    : copy.manageRecoveryFollowUp}
                </p>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={requestClose}
                disabled={busy}
                aria-label={copy.closeCaseManagement}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7">
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Clock3 size={17} className="text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">
                    {copy.caseDetails}
                  </h3>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    {copy.reason}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-200">
                    {retentionCase.reason}
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {copy.created} {formatDate(retentionCase.created_at, locale)}
                  </p>
                  {retentionCase.resolved_at && (
                    <p className="mt-1 text-xs text-slate-500">
                      {copy.resolvedOn} {formatDate(retentionCase.resolved_at, locale)}
                    </p>
                  )}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Settings2 size={17} className="text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">
                    {copy.caseManagement}
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`case-status-${retentionCase.id}`}
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      {copy.status}
                    </label>
                    <select
                      id={`case-status-${retentionCase.id}`}
                      value={status}
                      disabled={busy || isResolved}
                      onChange={(event) => {
                        setStatus(
                          event.target.value as RetentionCaseStatus
                        );
                        setCaseSuccess("");
                        setCaseError("");
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-60"
                    >
                      <option value="pending">{copy.pending}</option>
                      <option value="in_progress">{copy.inProgress}</option>
                      {isResolved && (
                        <option value="resolved">{copy.resolved}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`case-priority-${retentionCase.id}`}
                      className="mb-2 block text-sm font-medium text-slate-200"
                    >
                      {copy.priority}
                    </label>
                    <select
                      id={`case-priority-${retentionCase.id}`}
                      value={priority}
                      disabled={busy || isResolved}
                      onChange={(event) => {
                        setPriority(
                          event.target.value as RetentionCasePriority
                        );
                        setCaseSuccess("");
                        setCaseError("");
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-60"
                    >
                      <option value="low">{copy.low}</option>
                      <option value="medium">{copy.medium}</option>
                      <option value="high">{copy.high}</option>
                    </select>
                  </div>
                </div>

                {!isResolved && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={busy || !hasCaseChanges}
                      onClick={() =>
                        void updateCase({ status, priority })
                      }
                      className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingCase ? copy.saving : copy.saveChanges}
                    </button>

                    <button
                      type="button"
                      disabled={busy}
                      onClick={requestResolve}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-800/60 bg-emerald-950/30 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-950/60 disabled:opacity-50"
                    >
                      <CheckCircle2 size={16} />
                      {copy.resolveCase}
                    </button>
                  </div>
                )}

                {caseError && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-rose-800/60 bg-rose-950/30 p-3 text-sm text-rose-300"
                  >
                    {caseError}
                  </p>
                )}

                {caseSuccess && (
                  <p
                    role="status"
                    className="mt-4 rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-3 text-sm text-emerald-300"
                  >
                    {caseSuccess}
                  </p>
                )}
              </section>

              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Activity size={17} className="text-sky-400" />
                  <h3 className="text-sm font-semibold text-white">
                    {copy.activityHistory}
                  </h3>
                </div>

                {activitiesLoading ? (
                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-xl border border-slate-800 p-4 text-sm text-slate-400"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    {copy.loadingActivities}
                  </div>
                ) : activitiesError ? (
                  <div className="rounded-xl border border-rose-800/60 bg-rose-950/30 p-4">
                    <p role="alert" className="text-sm text-rose-300">
                      {activitiesError}
                    </p>
                    <button
                      type="button"
                      onClick={() => void loadActivities()}
                      className="mt-3 text-sm font-semibold text-sky-400 hover:text-sky-300"
                    >
                      {copy.tryAgain}
                    </button>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                    <p className="text-sm font-medium text-slate-200">
                      {copy.noActivitiesRecorded}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {copy.noActivitiesDescription}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...activities]
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      )
                      .map((activity) => (
                        <article
                          key={activity.id}
                          className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white">
                              {activityLabels[activity.activity_type]}
                            </p>
                            <time className="text-xs text-slate-500">
                              {formatDate(activity.created_at, locale)}
                            </time>
                          </div>

                          {activity.outcome && (
                            <p className="mt-2 text-xs font-medium text-sky-300">
                              {outcomeLabels[activity.outcome]}
                            </p>
                          )}

                          {activity.notes && (
                            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">
                              {activity.notes}
                            </p>
                          )}
                        </article>
                      ))}
                  </div>
                )}
              </section>

              {!isResolved && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <Activity size={17} className="text-sky-400" />
                    <h3 className="text-sm font-semibold text-white">
                      {copy.addActivity}
                    </h3>
                  </div>

                  <form
                    onSubmit={saveActivity}
                    className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <div>
                      <label
                        htmlFor={`activity-type-${retentionCase.id}`}
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        {copy.contactType}
                      </label>
                      <select
                        id={`activity-type-${retentionCase.id}`}
                        value={activityType}
                        disabled={busy}
                        onChange={(event) => {
                          setActivityType(
                            event.target.value as RetentionActivityType
                          );
                          setActivitySuccess("");
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-50"
                      >
                        <option value="call">{copy.phoneCall}</option>
                        <option value="email">{copy.email}</option>
                        <option value="message">{copy.message}</option>
                        <option value="other">{copy.other}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`activity-outcome-${retentionCase.id}`}
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        {copy.outcome}
                      </label>
                      <select
                        id={`activity-outcome-${retentionCase.id}`}
                        value={outcome}
                        disabled={busy}
                        onChange={(event) => {
                          setOutcome(
                            event.target
                              .value as RetentionActivityOutcome | ""
                          );
                          setActivitySuccess("");
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-sky-500 disabled:opacity-50"
                      >
                        <option value="">{copy.notSpecified}</option>
                        <option value="contacted">{copy.contacted}</option>
                        <option value="no_response">{copy.noResponse}</option>
                        <option value="follow_up_needed">
                          {copy.followUpNeeded}
                        </option>
                        <option value="other">{copy.other}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`activity-notes-${retentionCase.id}`}
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        {copy.notes}
                      </label>
                      <textarea
                        id={`activity-notes-${retentionCase.id}`}
                        rows={4}
                        maxLength={2000}
                        value={notes}
                        disabled={busy}
                        onChange={(event) => {
                          setNotes(event.target.value);
                          setActivitySuccess("");
                        }}
                        placeholder={copy.notesPlaceholder}
                        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-500 disabled:opacity-50"
                      />
                    </div>

                    {activityError && (
                      <p
                        role="alert"
                        className="rounded-xl border border-rose-800/60 bg-rose-950/30 p-3 text-sm text-rose-300"
                      >
                        {activityError}
                      </p>
                    )}

                    {activitySuccess && (
                      <p
                        role="status"
                        className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-3 text-sm text-emerald-300"
                      >
                        {activitySuccess}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                    >
                      {savingActivity
                        ? copy.recording
                        : copy.recordActivity}
                    </button>
                  </form>
                </section>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-800 px-6 py-5">
              <button
                type="button"
                onClick={requestClose}
                disabled={busy}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {copy.close}
              </button>
            </div>
          </section>

          {(showResolveConfirmation || showDiscardConfirmation) && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
              <div
                ref={confirmationRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="retention-confirm-title"
                aria-describedby="retention-confirm-description"
                className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              >
                <h3
                  id="retention-confirm-title"
                  className="text-lg font-semibold text-white"
                >
                  {showResolveConfirmation
                    ? copy.resolveCaseQuestion
                    : copy.discardChangesQuestion}
                </h3>

                <p
                  id="retention-confirm-description"
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                >
                  {showResolveConfirmation
                    ? copy.resolveCaseDescription
                    : copy.manageDiscardDescription}
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    ref={confirmationCancelRef}
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      confirmationOpenRef.current = false;
                      setShowResolveConfirmation(false);
                      setShowDiscardConfirmation(false);
                      closeRef.current?.focus();
                    }}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {copy.keepEditing}
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (showResolveConfirmation) {
                        void updateCase(
                          { status: "resolved" },
                          true
                        );
                      } else {
                        closePanel();
                      }
                    }}
                    className={
                      showResolveConfirmation
                        ? "rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                        : "rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:opacity-50"
                    }
                  >
                    {savingCase
                      ? copy.saving
                      : showResolveConfirmation
                        ? copy.resolveCase
                        : copy.discardChanges}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
