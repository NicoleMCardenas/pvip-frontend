
"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";

import { CustomerForm } from "./CustomerForm";

export function AddCustomer() {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function closePanel() {
    setIsOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closePanel();
    return;
  }

  if (event.key !== "Tab") return;

  const dialog = closeButtonRef.current?.closest(
    '[role="dialog"]'
  );

  if (!dialog) return;

  const focusableElements = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]'
    )
  );

  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !dialog.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last || !dialog.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}


    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 sm:w-auto"
      >
        <Plus size={18} strokeWidth={2} />
        Add customer
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-hidden="true"
            onClick={closePanel}
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-customer-title"
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  Customer management
                </p>

                <h2
                  id="add-customer-title"
                  className="mt-1 text-lg font-semibold text-white"
                >
                  New customer
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closePanel}
                aria-label="Close customer form"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-7">
              <CustomerForm
                onCancel={closePanel}
                onSuccess={closePanel}
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
