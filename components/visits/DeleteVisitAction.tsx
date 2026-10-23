
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import type { Visit } from "@/types/visit";

type DeleteVisitActionProps = {
  visit: Visit;
  customerName: string;
  serviceName: string;
};

export function DeleteVisitAction({
  visit,
  customerName,
  serviceName,
}: DeleteVisitActionProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const formattedAmount = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(visit.amount));

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(visit.visit_date));

  function closeDialog() {
    if (isDeleting) return;

    setIsOpen(false);
    setError("");

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (!isDeleting) {
          setIsOpen(false);
          setError("");

          requestAnimationFrame(() => {
            triggerRef.current?.focus();
          });
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
      const active = document.activeElement;

      if (
        event.shiftKey &&
        (active === first || !dialog.contains(active))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !dialog.contains(active))
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
  }, [isOpen, isDeleting]);

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `/api/visits/${encodeURIComponent(visit.id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : "Unable to delete visit."
        );
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setIsDeleting(false);
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
        aria-label={`Delete visit for ${customerName}`}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
      >
        <Trash2 size={14} aria-hidden="true" />
        Delete
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-sm">
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`delete-visit-title-${visit.id}`}
            aria-describedby={`delete-visit-description-${visit.id}`}
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                <Trash2 size={20} />
              </div>

              <button
                type="button"
                onClick={closeDialog}
                disabled={isDeleting}
                aria-label="Close confirmation"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <h2
              id={`delete-visit-title-${visit.id}`}
              className="mt-5 text-xl font-semibold text-white"
            >
              Delete this visit?
            </h2>

            <p
              id={`delete-visit-description-${visit.id}`}
              className="mt-2 text-sm leading-relaxed text-slate-400"
            >
              This action will permanently remove the visit
              and update the customer&apos;s visit history
              and metrics.
            </p>

            <div className="mt-5 space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <div>
                <p className="text-xs text-slate-500">
                  Customer
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  {customerName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Service
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {serviceName}
                </p>
              </div>

              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    Date
                  </p>
                  <p className="mt-1 text-sm text-slate-200">
                    {formattedDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Amount
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {formattedAmount}
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-300"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                onClick={closeDialog}
                disabled={isDeleting}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting
                  ? "Deleting visit..."
                  : "Delete visit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
