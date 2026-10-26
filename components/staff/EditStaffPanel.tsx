
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pencil, X } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import {
  StaffForm,
  type StaffMember,
} from "./StaffForm";

type EditStaffPanelProps = {
  staffMember: StaffMember;
};

export function EditStaffPanel({
  staffMember,
}: EditStaffPanelProps) {
  const { t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [
    showDiscardConfirmation,
    setShowDiscardConfirmation,
  ] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const discardCancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const isDirtyRef = useRef(false);
  const confirmationRef = useRef(false);

  function updateDirty(dirty: boolean) {
    isDirtyRef.current = dirty;
  }

  function finishClosing() {
    isDirtyRef.current = false;
    confirmationRef.current = false;

    setShowDiscardConfirmation(false);
    setIsOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }

  const requestClose = useCallback(() => {
    if (isDirtyRef.current) {
      confirmationRef.current = true;
      setShowDiscardConfirmation(true);
      return;
    }

    finishClosing();
  }, []);

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
        } else {
          requestClose();
        }

        return;
      }

      if (event.key !== "Tab") return;

      const container = confirmationRef.current
        ? document.getElementById(
            `staff-discard-${staffMember.id}`
          )
        : panelRef.current;

      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
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
        if (
          active === first ||
          !container.contains(active)
        ) {
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

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, requestClose, staffMember.id]);

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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`${t.staff.editMemberAria}: ${staffMember.name}`}
        title={`${t.staff.editMemberAria}: ${staffMember.name}`}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-sky-500/40 hover:bg-slate-800 hover:text-white"
      >
        <Pencil
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        {t.staff.editAction}
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
            aria-labelledby={`edit-staff-${staffMember.id}`}
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  {t.staff.eyebrow}
                </p>

                <h2
                  id={`edit-staff-${staffMember.id}`}
                  className="mt-1 text-lg font-semibold text-white"
                >
                  {t.staff.editStaff}
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                aria-label={t.staff.closeForm}
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-7">
              <StaffForm
                staffMember={staffMember}
                onCancel={requestClose}
                onSuccess={finishClosing}
                onDirtyChange={updateDirty}
              />
            </div>
          </section>

          {showDiscardConfirmation && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
              <div
                id={`staff-discard-${staffMember.id}`}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={`staff-discard-title-${staffMember.id}`}
                aria-describedby={`staff-discard-description-${staffMember.id}`}
                className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              >
                <h3
                  id={`staff-discard-title-${staffMember.id}`}
                  className="text-lg font-semibold text-white"
                >
                  {t.staff.discardTitle}
                </h3>

                <p
                  id={`staff-discard-description-${staffMember.id}`}
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                >
                  {t.staff.discardEditDescription}
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    ref={discardCancelRef}
                    type="button"
                    onClick={cancelDiscard}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
                  >
                    {t.staff.keepEditing}
                  </button>

                  <button
                    type="button"
                    onClick={finishClosing}
                    className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                  >
                    {t.staff.discardChanges}
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
