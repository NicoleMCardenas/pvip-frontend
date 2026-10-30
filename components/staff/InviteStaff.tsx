
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MailPlus, X } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import type { StaffMember } from "./StaffForm";

type InviteStaffProps = {
  staffMember: StaffMember;
};

type InvitationResult = "accepted" | "uncertain" | null;

export function InviteStaff({
  staffMember,
}: InviteStaffProps) {
  const { t, language } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<InvitationResult>(null);
  const [error, setError] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const loadingRef = useRef(false);

  const isEligible =
    staffMember.status === "active" &&
    Boolean(staffMember.email?.trim());

  const closeDialog = useCallback(() => {
    if (loadingRef.current) return;

    setIsOpen(false);
    setError("");
    setResult(null);

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
    if (loadingRef.current || !isEligible || result) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/auth/staff-invitations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staff_id: staffMember.id,
            email: staffMember.email?.trim(),
            language,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setResult("accepted");
        return;
      }

      if (response.status === 503) {
        const isUncertainDelivery =
          typeof data?.detail === "string" &&
          data.detail.includes(
            "No fue posible confirmar el envío"
          );

        if (isUncertainDelivery) {
          setResult("uncertain");
        } else {
          setError(
            typeof data?.detail === "string"
              ? data.detail
              : t.staff.inviteError
          );
        }

        return;
      }

      if (response.status === 401) {
        setError(t.staff.inviteSessionExpired);
      } else if (response.status === 403) {
        setError(t.staff.inviteForbidden);
      } else if (response.status === 502) {
        setError(t.staff.inviteRejectedDescription);
      } else {
        setError(
          typeof data?.detail === "string"
            ? data.detail
            : t.staff.inviteError
        );
      }
    } catch {
      setResult("uncertain");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }

  if (!isEligible) {
    return null;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setError("");
          setResult(null);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-sky-500/20 px-3 py-2 text-xs font-medium text-sky-400 transition hover:bg-sky-500/10"
      >
        <MailPlus size={14} aria-hidden="true" />
        {t.staff.inviteMember}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-5 backdrop-blur-sm">
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`staff-invite-title-${staffMember.id}`}
            aria-describedby={`staff-invite-description-${staffMember.id}`}
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id={`staff-invite-title-${staffMember.id}`}
                className="text-lg font-semibold text-white"
              >
                {result === "accepted"
                  ? t.staff.inviteAcceptedTitle
                  : result === "uncertain"
                    ? t.staff.inviteUncertainTitle
                    : t.staff.inviteTitle}
              </h2>

              <button
                type="button"
                onClick={closeDialog}
                disabled={loading}
                aria-label={t.staff.inviteClose}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <p
              id={`staff-invite-description-${staffMember.id}`}
              className="mt-3 text-sm leading-relaxed text-slate-400"
            >
              {result === "accepted"
                ? t.staff.inviteAcceptedDescription
                : result === "uncertain"
                  ? t.staff.inviteUncertainDescription
                  : t.staff.inviteDescription}
            </p>

            {!result && (
              <div className="mt-5 space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div>
                  <p className="text-xs text-slate-400">
                    {t.staff.inviteRecipient}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {staffMember.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {t.staff.inviteEmail}
                  </p>
                  <p className="mt-1 break-all text-sm text-white">
                    {staffMember.email}
                  </p>
                </div>
              </div>
            )}

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
                {result
                  ? t.staff.inviteClose
                  : t.staff.inviteCancel}
              </button>

              {!result && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? t.staff.inviting
                    : t.staff.inviteConfirm}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
