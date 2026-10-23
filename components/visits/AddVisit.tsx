
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CalendarPlus, X } from "lucide-react";
import { VisitForm } from "./VisitForm";

type ClientOption = {
  id: string;
  name: string;
  status: string;
};

type ServiceOption = {
  id: string;
  name: string;
  price: number | string;
  status: string;
};

type StaffOption = {
  id: string;
  name: string;
  status: string;
};

type AddVisitProps = {
  clients: ClientOption[];
  services: ServiceOption[];
  staff: StaffOption[];
};

export function AddVisit({
  clients,
  services,
  staff,
}: AddVisitProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] =
    useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const discardCancelRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const isDirtyRef = useRef(false);
  const confirmationRef = useRef(false);

  function updateDirty(dirty: boolean) {
    isDirtyRef.current = dirty;
  }

  const finishClosing = useCallback(() => {
  isDirtyRef.current = false;
  confirmationRef.current = false;

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
        ? document.getElementById("visit-discard-dialog")
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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 sm:w-auto"
      >
        <CalendarPlus
          size={18}
          strokeWidth={2}
          aria-hidden="true"
        />
        Add visit
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
            aria-labelledby="add-visit-title"
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  Customer activity
                </p>

                <h2
                  id="add-visit-title"
                  className="mt-1 text-lg font-semibold text-white"
                >
                  New visit
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                aria-label="Close visit form"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div
              ref={formRef}
              className="flex-1 overflow-y-auto px-6 py-7"
            >
              <VisitForm
                clients={clients}
                services={services}
                staff={staff}
                onCancel={requestClose}
                onSuccess={finishClosing}
                onDirtyChange={updateDirty}
              />
            </div>
          </section>

          {showDiscardConfirmation && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
              <div
                id="visit-discard-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="visit-discard-title"
                aria-describedby="visit-discard-description"
                className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              >
                <h3
                  id="visit-discard-title"
                  className="text-lg font-semibold text-white"
                >
                  Discard changes?
                </h3>

                <p
                  id="visit-discard-description"
                  className="mt-2 text-sm leading-relaxed text-slate-400"
                >
                  You have unsaved visit information.
                  Closing this panel will discard your changes.
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
