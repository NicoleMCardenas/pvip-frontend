
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { Client } from "@/types";
import { CustomerForm } from "./CustomerForm";
import { EditCustomer } from "./EditCustomer";

type EditCustomerPanelProps = {
  client: Client;
};

export function EditCustomerPanel({
  client,
}: EditCustomerPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  function closePanel() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
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

      const triggerButton =
        triggerRef.current?.querySelector("button");

      triggerButton?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <div ref={triggerRef}>
        <EditCustomer
          client={client}
          onEdit={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            aria-hidden="true"
            onClick={closePanel}
          />

          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`edit-customer-${client.id}`}
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                  Customer management
                </p>

                <h2
                  id={`edit-customer-${client.id}`}
                  className="mt-1 text-lg font-semibold text-white"
                >
                  Edit customer
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
                customer={client}
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
