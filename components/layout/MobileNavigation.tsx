"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";

export default function MobileNavigation() {
  const pathname = usePathname();

  return <MobileNavigationContent key={pathname} />;
}

function MobileNavigationContent() {
  const [isOpen, setIsOpen] = useState(false);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        menuButtonRef.current?.focus();
      }

      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-5">
        <span className="text-xl font-bold tracking-tight text-white">
          KAIRO
        </span>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Abrir navegación"
          aria-expanded={isOpen}
          aria-controls="kairo-mobile-navigation"
          onClick={() => setIsOpen(true)}
          className="rounded-lg border border-slate-700 p-2 text-slate-200"
        >
          <Menu size={22} />
        </button>
      </header>

      {isOpen && (
        <div
          id="kairo-mobile-navigation"
          className="fixed inset-0 z-50"
        >
          <button
            type="button"
            aria-label="Cerrar navegación"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navegación principal"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-950"
          >
            <div className="absolute right-4 top-4 z-10">
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setIsOpen(false)}
                className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
              >
                <X size={20} />
              </button>
            </div>

            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}