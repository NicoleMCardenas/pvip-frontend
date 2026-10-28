
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type UnsavedChangesContextValue = {
  hasUnsavedChanges: boolean;
  pendingDestination: string | null;
  setHasUnsavedChanges: (value: boolean) => void;
  requestNavigation: (destination: string) => void;
  cancelNavigation: () => void;
  confirmNavigation: () => void;
};

const UnsavedChangesContext =
  createContext<UnsavedChangesContextValue | null>(null);

export function UnsavedChangesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [hasUnsavedChanges, setHasUnsavedChanges] =
    useState(false);

  const [pendingDestination, setPendingDestination] =
    useState<string | null>(null);

  const requestNavigation = useCallback(
    (destination: string) => {
      if (!hasUnsavedChanges) {
        router.push(destination);
        return;
      }

      setPendingDestination(destination);
    },
    [hasUnsavedChanges, router]
  );

  const cancelNavigation = useCallback(() => {
    setPendingDestination(null);
  }, []);

  const confirmNavigation = useCallback(() => {
    if (!pendingDestination) return;

    const destination = pendingDestination;

    setPendingDestination(null);
    setHasUnsavedChanges(false);

    router.push(destination);
  }, [pendingDestination, router]);

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        pendingDestination,
        setHasUnsavedChanges,
        requestNavigation,
        cancelNavigation,
        confirmNavigation,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);

  if (!context) {
    throw new Error(
      "useUnsavedChanges must be used within UnsavedChangesProvider"
    );
  }

  return context;
}
