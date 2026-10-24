
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RotateCcw, X } from "lucide-react";
import type { Client, ClientStatus } from "@/types";
import { useLanguage } from "@/components/language/LanguageProvider";

type RestoreCustomerProps = {
  client: Client;
};

type RestoreErrorResponse = {
  detail?: string;
  outcome_unknown?: boolean;
};

type VerificationState =
  | "idle"
  | "unknown"
  | "checking"
  | "still_archived"
  | "restored";

const validStatuses: ClientStatus[] = [
  "new",
  "active",
  "at_risk",
];

export function RestoreCustomer({
  client,
}: RestoreCustomerProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const statusLabels: Record<ClientStatus, string> = {
    new: t.customers.new,
    active: t.customers.active,
    at_risk: t.customers.atRisk,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<ClientStatus | "">("");
  const [error, setError] = useState("");
  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const operationLockRef = useRef(false);
  const isBusyRef = useRef(false);

  const storageKey = `kairo:restore:unconfirmed:${client.id}`;

  const previousStatus = validStatuses.includes(
    client.previous_status as ClientStatus
  )
    ? (client.previous_status as ClientStatus)
    : null;

  const requiresStatusSelection = previousStatus === null;

  const isBusy =
    isRestoring || verificationState === "checking";

  const needsVerification =
    verificationState === "unknown" ||
    verificationState === "checking";

  // Keep keyboard handling synchronized without
  // recreating the dialog effect during requests.
  useEffect(() => {
    isBusyRef.current = isBusy;
  }, [isBusy]);

  function markOutcomeUnknown(message: string) {
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {
      // Continue protecting the current component state.
    }

    setVerificationState("unknown");
    setError(message);
  }

  function clearPendingVerification() {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // Storage may be unavailable.
    }
  }

  function openDialog() {
    setSelectedStatus("");
    setError("");

    let hasPendingVerification =
      verificationState === "unknown";

    try {
      hasPendingVerification =
        sessionStorage.getItem(storageKey) === "true" ||
        hasPendingVerification;
    } catch {
      // Use the component's current verification state.
    }

    if (hasPendingVerification) {
      setVerificationState("unknown");
      setError(
        t.customers.previousRestoreUnknown
      );
    } else if (verificationState !== "restored") {
      setVerificationState("idle");
    }

    setIsOpen(true);
  }

  function closeDialog() {
    if (isBusyRef.current || operationLockRef.current) {
      return;
    }

    setIsOpen(false);
    setError("");
    setSelectedStatus("");

    if (verificationState === "still_archived") {
      setVerificationState("idle");
    }
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    const triggerElement = triggerRef.current;

    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (
          !isBusyRef.current &&
          !operationLockRef.current
        ) {
          setIsOpen(false);
        }

        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), select:not([disabled]), a[href]'
        )
      );

      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialog.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      } else {
        triggerElement?.focus();
      }
    };
  }, [isOpen]);

  async function handleRestore() {
    if (
      operationLockRef.current ||
      isBusy ||
      verificationState === "unknown" ||
      verificationState === "restored"
    ) {
      return;
    }

    if (requiresStatusSelection && !selectedStatus) {
      setError(t.customers.statusRequired);
      return;
    }

    try {
      if (sessionStorage.getItem(storageKey) === "true") {
        setVerificationState("unknown");
        setError(
          t.customers.checkBeforeRetry
        );
        return;
      }
    } catch {
      // Use the component's verification state.
    }

    operationLockRef.current = true;
    isBusyRef.current = true;
    setIsRestoring(true);
    setError("");

    try {
      const response = await fetch(
        `/api/customers/${encodeURIComponent(client.id)}/restore`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fallback_status: requiresStatusSelection
              ? selectedStatus
              : null,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorData = data as RestoreErrorResponse | null;

        if (errorData?.outcome_unknown === true) {
          markOutcomeUnknown(
            t.customers.unknownRestoreResult
          );
          return;
        }

        setError(
          t.customers.restoreError
        );
        return;
      }

      if (
        data?.id !== client.id ||
        !validStatuses.includes(
          data?.status as ClientStatus
        )
      ) {
        markOutcomeUnknown(
          t.customers.unconfirmedResponse
        );
        return;
      }

      clearPendingVerification();
      setVerificationState("restored");
      setIsOpen(false);
      router.refresh();
    } catch {
      markOutcomeUnknown(
        t.customers.unconfirmedRestore
      );
    } finally {
      operationLockRef.current = false;
      isBusyRef.current = false;
      setIsRestoring(false);
    }
  }

  async function verifyCustomerStatus() {
    if (operationLockRef.current || isBusy) {
      return;
    }

    operationLockRef.current = true;
    isBusyRef.current = true;
    setVerificationState("checking");
    setError("");

    try {
      const response = await fetch(
        `/api/customers/${encodeURIComponent(client.id)}/status`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          t.customers.verifyError
        );
      }

      if (data?.id !== client.id) {
        throw new Error(
          t.customers.unexpectedCustomer
        );
      }

      if (data.status === "archived") {
        clearPendingVerification();
        setVerificationState("still_archived");
        setError("");
        return;
      }

      if (
        data.status === "new" ||
        data.status === "active" ||
        data.status === "at_risk"
      ) {
        clearPendingVerification();
        setVerificationState("restored");
        setError("");
        router.refresh();
        return;
      }

      throw new Error(
        t.customers.invalidStatus
      );
    } catch (err) {
      markOutcomeUnknown(
        err instanceof Error
          ? err.message
          : t.customers.verifyError
      );
    } finally {
      operationLockRef.current = false;
      isBusyRef.current = false;
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-medium text-sky-300 transition hover:border-sky-400 hover:bg-sky-500/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        aria-label={`${t.customers.restoreCustomerAria}: ${client.name}`}
      >
        <RotateCcw size={14} strokeWidth={1.8} />
        {t.customers.restoreCustomer}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-hidden="true"
            onClick={closeDialog}
          />

          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`restore-title-${client.id}`}
            aria-describedby={`restore-description-${client.id}`}
            tabIndex={-1}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
                <RotateCcw size={21} strokeWidth={1.8} />
              </div>

              <button
                type="button"
                onClick={closeDialog}
                disabled={isBusy}
                aria-label={t.customers.closeConfirmation}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id={`restore-title-${client.id}`}
              className="mt-5 text-xl font-semibold tracking-tight text-white"
            >
              {t.customers.restoreQuestion}
            </h2>

            <p
              id={`restore-description-${client.id}`}
              className="mt-3 text-sm leading-relaxed text-slate-400"
            >
              {t.customers.restoreDescriptionStart}{" "}
              <span className="font-semibold text-white">
                {client.name}
              </span>
              . {t.customers.restoreDescriptionEnd}
            </p>

            {previousStatus ? (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
                <p className="text-xs text-slate-400">
                  {t.customers.restoredStatus}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {statusLabels[previousStatus]}
                </p>
              </div>
            ) : (
              <div className="mt-5">
                <label
                  htmlFor={`restore-status-${client.id}`}
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  {t.customers.selectStatus}
                  <span className="ml-1 text-rose-400">
                    *
                  </span>
                </label>

                <select
                  id={`restore-status-${client.id}`}
                  value={selectedStatus}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (
                      value === "" ||
                      validStatuses.includes(
                        value as ClientStatus
                      )
                    ) {
                      setSelectedStatus(
                        value as ClientStatus | ""
                      );
                      setError("");
                    }
                  }}
                  disabled={isBusy || needsVerification}
                  required
                  className="min-h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none transition focus:border-sky-500 disabled:opacity-50"
                >
                  <option value="">{t.customers.chooseStatus}</option>
                  {validStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {t.customers.missingPreviousStatus}
                </p>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="mt-5 flex gap-3 rounded-xl border border-amber-900/60 bg-amber-950/30 p-4 text-sm text-amber-200"
              >
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0"
                />
                <p className="leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {verificationState === "still_archived" && (
              <p
                role="status"
                className="mt-5 rounded-xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm text-sky-200"
              >
                {t.customers.stillArchived}
              </p>
            )}

            {verificationState === "restored" && (
              <p
                role="status"
                className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-4 text-sm text-emerald-200"
              >
                {t.customers.alreadyRestored}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={closeDialog}
                disabled={isBusy}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {verificationState === "restored"
                  ? t.customers.closeConfirmation
                  : t.common.cancel}
              </button>

              {needsVerification ? (
                <button
                  type="button"
                  onClick={verifyCustomerStatus}
                  disabled={isBusy}
                  className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                >
                  {verificationState === "checking"
                    ? t.customers.checking
                    : t.customers.checkStatus}
                </button>
              ) : verificationState !== "restored" ? (
                <button
                  type="button"
                  onClick={handleRestore}
                  disabled={
                    isBusy ||
                    (requiresStatusSelection &&
                      !selectedStatus)
                  }
                  className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isRestoring
                    ? t.customers.restoring
                    : t.customers.restoreCustomer}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
