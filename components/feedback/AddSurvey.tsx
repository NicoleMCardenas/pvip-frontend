
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import type { Survey } from "@/types/survey";

type VisitOption = {
  id: string;
  client_id: string;
  visit_date: string;
};

type ClientOption = {
  id: string;
  name: string;
};

type AddSurveyProps = {
  visits: VisitOption[];
  clients: ClientOption[];
  surveys: Survey[];
};

export function AddSurvey({
  visits,
  clients,
  surveys,
}: AddSurveyProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [visitId, setVisitId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDiscardConfirmation, setShowDiscardConfirmation] =
    useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const discardCancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const isDirtyRef = useRef(false);
  const confirmationRef = useRef(false);

  const clientNames = useMemo(
    () => new Map(clients.map((client) => [client.id, client.name])),
    [clients]
  );

  const eligibleVisits = useMemo(() => {
    const surveyedVisitIds = new Set(
      surveys.map((survey) => survey.visit_id)
    );

    return visits
      .filter((visit) => !surveyedVisitIds.has(visit.id))
      .sort(
        (a, b) =>
          new Date(b.visit_date).getTime() -
          new Date(a.visit_date).getTime()
      );
  }, [visits, surveys]);

  const selectedVisit = eligibleVisits.find(
    (visit) => visit.id === visitId
  );


  function formatVisitDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Mexico_City",
    }).format(new Date(date));
  }

  const finishClosing = useCallback(() => {
    isDirtyRef.current = false;
    confirmationRef.current = false;

    setVisitId("");
    setError("");
    setLoading(false);
    setShowDiscardConfirmation(false);
    setIsOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const requestClose = useCallback(() => {
    if (loading) return;

    if (isDirtyRef.current) {
      confirmationRef.current = true;
      setShowDiscardConfirmation(true);
      return;
    }

    finishClosing();
  }, [finishClosing, loading]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (confirmationRef.current) {
          confirmationRef.current = false;
          setShowDiscardConfirmation(false);
          closeButtonRef.current?.focus();
        } else {
          requestClose();
        }

        return;
      }

      if (event.key !== "Tab") return;

      const container = confirmationRef.current
        ? document.getElementById("add-survey-discard")
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, requestClose]);

  useEffect(() => {
    if (showDiscardConfirmation) {
      discardCancelRef.current?.focus();
    }
  }, [showDiscardConfirmation]);

  function cancelDiscard() {
    confirmationRef.current = false;
    setShowDiscardConfirmation(false);
    closeButtonRef.current?.focus();
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedVisit || loading) {
      setError("Select an available visit.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visit_id: selectedVisit.id,
          client_id: selectedVisit.client_id,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : "Unable to create survey."
        );
      }

      finishClosing();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create survey."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        <Plus size={18} aria-hidden="true" />
        Add survey
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-hidden="true"
            onClick={requestClose}
          />

          <section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-survey-title"
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  Customer intelligence
                </p>

                <h2
                  id="add-survey-title"
                  className="mt-1 text-lg font-semibold text-white"
                >
                  New survey
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                disabled={loading}
                aria-label="Close survey form"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-7">
                <p className="text-sm leading-relaxed text-slate-400">
                  Create a feedback request for an existing
                  customer visit. Each visit can have one survey.
                </p>

                {eligibleVisits.length === 0 ? (
                  <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                    <p className="font-medium text-slate-200">
                      No eligible visits
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      All existing visits already have surveys,
                      or no visits have been recorded yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="survey-visit"
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        Customer visit
                      </label>

                      <select
                        id="survey-visit"
                        required
                        disabled={loading}
                        value={visitId}
                        onChange={(event) => {
                          const value = event.target.value;
                          setVisitId(value);
                          isDirtyRef.current = value !== "";
                          setError("");
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 disabled:opacity-50"
                      >
                        <option value="">Select a visit</option>

                        {eligibleVisits.map((visit) => (
                          <option key={visit.id} value={visit.id}>
                            {clientNames.get(visit.client_id) ??
                              "Customer unavailable"}
                            {" — "}
                            {formatVisitDate(visit.visit_date)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedVisit && (
                      <div className="rounded-xl border border-sky-900/50 bg-sky-950/20 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                          Selected customer
                        </p>
                        <p className="mt-2 font-medium text-white">
                          {clientNames.get(selectedVisit.client_id) ??
                            "Customer unavailable"}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Visit: {formatVisitDate(selectedVisit.visit_date)}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-800/60 bg-rose-950/30 px-4 py-3 text-sm text-rose-300"
                  >
                    {error}
                  </div>
                )}
              </div>

              <div className="flex gap-3 border-t border-slate-800 px-6 py-5">
                <button
                  type="button"
                  onClick={requestClose}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !selectedVisit ||
                    eligibleVisits.length === 0
                  }
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create survey"}
                </button>
              </div>
            </form>
          </section>

          {showDiscardConfirmation && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
              <div
                id="add-survey-discard"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="add-survey-discard-title"
                aria-describedby="add-survey-discard-description"
                className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              >
                <h3
                  id="add-survey-discard-title"
                  className="text-lg font-semibold text-white"
                >
                  Discard changes?
                </h3>

                <p
                  id="add-survey-discard-description"
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                >
                  Your selected visit has not been saved.
                  Closing this form will discard your selection.
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    ref={discardCancelRef}
                    type="button"
                    onClick={cancelDiscard}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    Keep editing
                  </button>

                  <button
                    type="button"
                    onClick={finishClosing}
                    className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                  >
                    Discard changes
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
