
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRoundCheck, UserRoundX, X } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";

type StaffStatusActionProps = {
  staffMember: {
    id: string;
    name: string;
    status: string;
  };
};

export function StaffStatusAction({
  staffMember,
}: StaffStatusActionProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef(false);

  const isActive = staffMember.status === "active";

  const closeDialog = useCallback(() => {
    if (loadingRef.current) return;

    setIsOpen(false);
    setError("");

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
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

      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (
        active === last ||
        !dialog.contains(active)
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
  }, [isOpen, closeDialog]);

  async function handleConfirm() {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/staff/${staffMember.id}`,
        isActive
          ? { method: "DELETE" }
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

        const message =
          typeof data?.detail === "string"
            ? data.detail
            : isActive
              ? t.staff.deactivateError
              : t.staff.reactivateError;

        throw new Error(message);
      }

      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.staff.unexpectedError
      );
    } finally {
      loadingRef.current = false;
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
        className={[
          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition",
          isActive
            ? "border-slate-700 text-slate-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
            : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10",
        ].join(" ")}
      >
        {isActive ? (
          <UserRoundX size={14} aria-hidden="true" />
        ) : (
          <UserRoundCheck size={14} aria-hidden="true" />
        )}

        {isActive ? t.staff.deactivate : t.staff.reactivate}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-sm">
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`staff-status-title-${staffMember.id}`}
            aria-describedby={`staff-status-description-${staffMember.id}`}
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id={`staff-status-title-${staffMember.id}`}
                className="text-lg font-semibold text-white"
              >
                {isActive
                  ? t.staff.deactivateTitle
                  : t.staff.reactivateTitle}
              </h2>

              <button
                type="button"
                onClick={closeDialog}
                disabled={loading}
                aria-label={t.staff.closeConfirmation}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <p
              id={`staff-status-description-${staffMember.id}`}
              className="mt-3 text-sm leading-relaxed text-slate-400"
            >
              <span className="font-medium text-white">
                {staffMember.name}
              </span>{" "}
              {isActive
                ? t.staff.deactivateDescription
                : t.staff.reactivateDescription}
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
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
              >
                {t.staff.cancel}
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={[
                  "rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
                  isActive
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
                ].join(" ")}
              >
                {loading
                  ? isActive
                    ? t.staff.deactivating
                    : t.staff.reactivating
                  : isActive
                    ? t.staff.deactivateMember
                    : t.staff.reactivateMember}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
