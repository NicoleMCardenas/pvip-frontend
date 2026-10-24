
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, RotateCcw, X } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import type { Service } from "@/types/service";

type ServiceStatusActionProps = {
  service: Service;
};

export function ServiceStatusAction({
  service,
}: ServiceStatusActionProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const copy = t.services;

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isActive = service.status === "active";

  function closeDialog() {
    if (loading) return;

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

        if (!loading) {
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
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === first ||
          !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === last ||
          !dialog.contains(activeElement))
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
  }, [isOpen, loading]);

  async function handleConfirm() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/services/${encodeURIComponent(service.id)}`,
        isActive
          ? {
              method: "DELETE",
            }
          : {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "active",
              }),
            }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : isActive
              ? copy.deactivateError
              : copy.reactivateError
        );
      }

      setIsOpen(false);
      setError("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : copy.unexpectedError
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
        onClick={() => {
          setError("");
          setIsOpen(true);
        }}
        aria-label={`${
          isActive ? copy.deactivate : copy.reactivate
        } ${service.name}`}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
      >
        {isActive ? (
          <Archive size={14} aria-hidden="true" />
        ) : (
          <RotateCcw size={14} aria-hidden="true" />
        )}

        {isActive ? copy.deactivate : copy.reactivate}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-sm">
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`service-status-title-${service.id}`}
            aria-describedby={`service-status-description-${service.id}`}
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id={`service-status-title-${service.id}`}
                className="text-lg font-semibold text-white"
              >
                {isActive
                  ? copy.deactivateTitle
                  : copy.reactivateTitle}
              </h2>

              <button
                type="button"
                onClick={closeDialog}
                disabled={loading}
                aria-label={copy.closeConfirmation}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <p
              id={`service-status-description-${service.id}`}
              className="mt-3 text-sm leading-relaxed text-slate-400"
            >
              <span className="font-medium text-white">
                {service.name}
              </span>{" "}
              {isActive
                ? copy.deactivateDescription
                : copy.reactivateDescription}
            </p>

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
                disabled={loading}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {copy.cancel}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={
                  isActive
                    ? "rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                    : "rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                }
              >
                {loading
                  ? copy.processing
                  : isActive
                    ? copy.deactivateService
                    : copy.reactivateService}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
