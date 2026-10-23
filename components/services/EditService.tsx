
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Pencil, X } from "lucide-react";
import type { Service } from "@/types/service";
import { ServiceForm } from "./ServiceForm";

type EditServiceProps = {
  service: Service;
};

export function EditService({ service }: EditServiceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] =
    useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const discardCancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const isDirtyRef = useRef(false);
  const confirmationRef = useRef(false);

  function updateDirty(dirty: boolean) {
    isDirtyRef.current = dirty;
    setIsDirty(dirty);
  }

  const finishClosing = useCallback(() => {
    isDirtyRef.current = false;
    confirmationRef.current = false;

    setIsDirty(false);
    setShowDiscardConfirmation(false);
    setIsOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }, []);

  const requestClose = useCallback(() => {
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
        ? document.getElementById(
            `edit-service-discard-${service.id}`
          )
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, requestClose, service.id]);

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
        aria-label={`Edit ${service.name}`}
        title={`Edit ${service.name}`}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-sky-500/50 hover:bg-slate-800 hover:text-white"
      >
        <Pencil size={14} aria-hidden="true" />
        Edit
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
            aria-labelledby={`edit-service-title-${service.id}`}
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  Business operations
                </p>

                <h2
                  id={`edit-service-title-${service.id}`}
                  className="mt-1 truncate text-lg font-semibold text-white"
                >
                  Edit service
                </h2>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {service.name}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                aria-label="Close edit service form"
                className="ml-4 rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-7">
              <ServiceForm
                service={service}
                onCancel={requestClose}
                onSuccess={finishClosing}
                onDirtyChange={updateDirty}
              />
            </div>
          </section>

          {showDiscardConfirmation && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
              <div
                id={`edit-service-discard-${service.id}`}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={`edit-service-discard-title-${service.id}`}
                aria-describedby={`edit-service-discard-description-${service.id}`}
                className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              >
                <h3
                  id={`edit-service-discard-title-${service.id}`}
                  className="text-lg font-semibold text-white"
                >
                  Discard changes?
                </h3>

                <p
                  id={`edit-service-discard-description-${service.id}`}
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                >
                  You have unsaved changes to this service.
                  Closing the form will discard them.
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
