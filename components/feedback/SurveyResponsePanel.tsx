
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MessageSquarePlus, X } from "lucide-react";
import type { Survey } from "@/types/survey";
import { SurveyResponseForm } from "./SurveyResponseForm";

type SurveyResponsePanelProps = {
  survey: Survey;
  customerName: string;
};

export function SurveyResponsePanel({
  survey,
  customerName,
}: SurveyResponsePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] =
    useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const discardCancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const isDirtyRef = useRef(false);
  const isSavingRef = useRef(false);
  const confirmationRef = useRef(false);

  function updateDirty(dirty: boolean) {
    isDirtyRef.current = dirty;
  }

  function updateSaving(saving: boolean) {
    isSavingRef.current = saving;
    setIsSaving(saving);
  }

  const finishClosing = useCallback(() => {
    isDirtyRef.current = false;
    isSavingRef.current = false;
    confirmationRef.current = false;

    setIsSaving(false);
    setShowDiscardConfirmation(false);
    setIsOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const requestClose = useCallback(() => {
    if (isSavingRef.current) return;

    if (isDirtyRef.current) {
      confirmationRef.current = true;
      setShowDiscardConfirmation(true);
      return;
    }

    finishClosing();
  }, [finishClosing]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (isSavingRef.current) return;

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
        ? document.getElementById("survey-response-discard")
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

  if (survey.status !== "pending") {
    return null;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/20"
      >
        <MessageSquarePlus size={15} aria-hidden="true" />
        Record response
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
            aria-labelledby="survey-response-title"
            aria-busy={isSaving}
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  Customer intelligence
                </p>

                <h2
                  id="survey-response-title"
                  className="mt-1 text-lg font-semibold text-white"
                >
                  Survey response
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {customerName}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                disabled={isSaving}
                aria-label="Close survey response"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-7">
              <SurveyResponseForm
                survey={survey}
                onCancel={requestClose}
                onSuccess={finishClosing}
                onDirtyChange={updateDirty}
                onSavingChange={updateSaving}
              />
            </div>
          </section>

          {showDiscardConfirmation && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
              <div
                id="survey-response-discard"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="survey-response-discard-title"
                aria-describedby="survey-response-discard-description"
                className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              >
                <h3
                  id="survey-response-discard-title"
                  className="text-lg font-semibold text-white"
                >
                  Discard changes?
                </h3>

                <p
                  id="survey-response-discard-description"
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                >
                  You have unsaved survey responses.
                  Closing this form will discard your changes.
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
