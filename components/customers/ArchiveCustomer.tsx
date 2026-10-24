
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, X } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import type { Client } from "@/types";

type ArchiveCustomerProps = {
  client: Client;
};

export function ArchiveCustomer({
  client,
}: ArchiveCustomerProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const isArchivingRef = useRef(false);

  function closeDialog() {
    if (isArchivingRef.current) return;

    setIsOpen(false);
    setError("");
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const triggerElement = triggerRef.current;

    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (!isArchivingRef.current) {
          setIsOpen(false);
          setError("");
        }

        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLButtonElement>(
          "button:not([disabled])"
        )
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (
          document.activeElement === first ||
          !dialog.contains(document.activeElement)
        ) {
          event.preventDefault();
          last.focus();
        }
      } else if (
        document.activeElement === last ||
        !dialog.contains(document.activeElement)
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      triggerElement?.focus();
    };
  }, [isOpen]);

  async function handleArchive() {
    if (isArchivingRef.current) return;

    isArchivingRef.current = true;
    setIsArchiving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/customers/${encodeURIComponent(client.id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(t.customers.archiveError);
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.customers.archiveError
      );
    } finally {
      isArchivingRef.current = false;
      setIsArchiving(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        aria-label={`${t.customers.archiveCustomerAria}: ${client.name}`}
      >
        <Archive size={14} strokeWidth={1.8} />
        {t.customers.archiveCustomer}
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
            aria-labelledby={`archive-title-${client.id}`}
            aria-describedby={`archive-description-${client.id}`}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <Archive size={21} strokeWidth={1.8} />
              </div>

              <button
                type="button"
                onClick={closeDialog}
                disabled={isArchiving}
                aria-label={t.customers.closeConfirmation}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <h2
              id={`archive-title-${client.id}`}
              className="mt-5 text-xl font-semibold tracking-tight text-white"
            >
              {t.customers.archiveQuestion}
            </h2>

            <p
              id={`archive-description-${client.id}`}
              className="mt-3 text-sm leading-relaxed text-slate-400"
            >
              {t.customers.archiveDescriptionStart}{" "}
              <span className="font-semibold text-white">
                {client.name}
              </span>
              . {t.customers.archiveDescriptionEnd}
            </p>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-300"
              >
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={closeDialog}
                disabled={isArchiving}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {t.common.cancel}
              </button>

              <button
                type="button"
                onClick={handleArchive}
                disabled={isArchiving}
                className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isArchiving
                  ? t.customers.archiving
                  : t.customers.archiveCustomer}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
