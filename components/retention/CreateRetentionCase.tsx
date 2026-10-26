
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";

import type {
  RetentionCase,
  RetentionCasePriority,
} from "@/types";

type CustomerOption = {
  id: string;
  name: string;
};

type CreateRetentionCaseProps = {
  customers: CustomerOption[];
  cases: RetentionCase[];
  initialCustomerId?: string;
};

export function CreateRetentionCase({
  customers,
  cases,
  initialCustomerId,
}: CreateRetentionCaseProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const copy = t.retention;

  const [isOpen, setIsOpen] = useState(false);
  const [customerId, setCustomerId] = useState(
    initialCustomerId ?? ""
  );
  const [reason, setReason] = useState("");
  const [priority, setPriority] =
    useState<RetentionCasePriority>("medium");
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

  const openCustomerIds = new Set(
    cases
      .filter(
        (retentionCase) =>
          retentionCase.status === "pending" ||
          retentionCase.status === "in_progress"
      )
      .map((retentionCase) => retentionCase.client_id)
  );

  const eligibleCustomers = customers.filter(
    (customer) => !openCustomerIds.has(customer.id)
  );

  const selectedCustomer = eligibleCustomers.find(
    (customer) => customer.id === customerId
  );

  const isCustomerLocked = Boolean(initialCustomerId);

  function updateDirtyState(
    nextCustomerId: string,
    nextReason: string,
    nextPriority: RetentionCasePriority
  ) {
    isDirtyRef.current =
      nextCustomerId !== (initialCustomerId ?? "") ||
      nextReason.trim() !== "" ||
      nextPriority !== "medium";
  }

  const finishClosing = useCallback(() => {
    isDirtyRef.current = false;
    confirmationRef.current = false;

    setCustomerId(initialCustomerId ?? "");
    setReason("");
    setPriority("medium");
    setError("");
    setLoading(false);
    setShowDiscardConfirmation(false);
    setIsOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, [initialCustomerId]);

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
        ? document.getElementById("retention-discard")
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

    if (loading) return;

    if (!selectedCustomer) {
      setError(copy.selectAvailableCustomer);
      return;
    }

    const cleanReason = reason.trim();

    if (!cleanReason) {
      setError(copy.enterReason);
      return;
    }

    if (cleanReason.length > 2000) {
      setError(copy.reasonTooLong);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/retention", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: selectedCustomer.id,
          reason: cleanReason,
          priority,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : copy.unableToCreateCase
        );
      }

      finishClosing();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : copy.unableToCreateCase
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
        disabled={
          eligibleCustomers.length === 0 ||
          (isCustomerLocked && !selectedCustomer)
        }
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={18} aria-hidden="true" />
        {copy.createCase}
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
            aria-labelledby="create-retention-title"
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  {copy.title}
                </p>

                <h2
                  id="create-retention-title"
                  className="mt-1 text-lg font-semibold text-white"
                >
                  {copy.newRetentionCase}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                disabled={loading}
                aria-label={copy.closeRetentionForm}
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
                  {copy.createCaseDescription}
                </p>

                {eligibleCustomers.length === 0 ? (
                  <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                    <p className="font-medium text-slate-200">
                      {copy.noAvailableCustomers}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {copy.noAvailableCustomersDescription}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="retention-customer"
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        {copy.customer}
                      </label>

                      {isCustomerLocked ? (
                        <div className="rounded-xl border border-sky-900/50 bg-sky-950/20 px-4 py-3">
                          <p className="font-medium text-white">
                            {selectedCustomer?.name ??
                              copy.customerUnavailable}
                          </p>
                        </div>
                      ) : (
                        <select
                          id="retention-customer"
                          required
                          disabled={loading}
                          value={customerId}
                          onChange={(event) => {
                            const value = event.target.value;
                            setCustomerId(value);
                            updateDirtyState(
                              value,
                              reason,
                              priority
                            );
                            setError("");
                          }}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 disabled:opacity-50"
                        >
                          <option value="">
                            {copy.selectCustomer}
                          </option>

                          {eligibleCustomers.map((customer) => (
                            <option
                              key={customer.id}
                              value={customer.id}
                            >
                              {customer.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="retention-reason"
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        {copy.reason}
                      </label>

                      <textarea
                        id="retention-reason"
                        required
                        maxLength={2000}
                        rows={5}
                        disabled={loading}
                        value={reason}
                        onChange={(event) => {
                          const value = event.target.value;
                          setReason(value);
                          updateDirtyState(
                            customerId,
                            value,
                            priority
                          );
                          setError("");
                        }}
                        placeholder={copy.reasonPlaceholder}
                        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500 disabled:opacity-50"
                      />

                      <p className="mt-2 text-right text-xs text-slate-500">
                        {reason.length} / 2000
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="retention-priority"
                        className="mb-2 block text-sm font-medium text-slate-200"
                      >
                        {copy.priority}
                      </label>

                      <select
                        id="retention-priority"
                        disabled={loading}
                        value={priority}
                        onChange={(event) => {
                          const value =
                            event.target
                              .value as RetentionCasePriority;

                          setPriority(value);
                          updateDirtyState(
                            customerId,
                            reason,
                            value
                          );
                          setError("");
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 disabled:opacity-50"
                      >
                        <option value="low">{copy.low}</option>
                        <option value="medium">{copy.medium}</option>
                        <option value="high">{copy.high}</option>
                      </select>
                    </div>
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
                  {copy.cancel}
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !selectedCustomer ||
                    !reason.trim()
                  }
                  className="flex-1 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? copy.creating : copy.createCase}
                </button>
              </div>
            </form>
          </section>

          {showDiscardConfirmation && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
              <div
                id="retention-discard"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="retention-discard-title"
                aria-describedby="retention-discard-description"
                className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              >
                <h3
                  id="retention-discard-title"
                  className="text-lg font-semibold text-white"
                >
                  {copy.discardChangesQuestion}
                </h3>

                <p
                  id="retention-discard-description"
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                >
                  {copy.createDiscardDescription}
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    ref={discardCancelRef}
                    type="button"
                    onClick={cancelDiscard}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    {copy.keepEditing}
                  </button>

                  <button
                    type="button"
                    onClick={finishClosing}
                    className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                  >
                    {copy.discardChanges}
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
