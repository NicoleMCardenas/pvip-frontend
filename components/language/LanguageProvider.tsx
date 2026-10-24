"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  defaultLanguage,
  getDictionary,
  isLanguage,
  type Language,
  type Translations,
} from "@/lib/i18n";

const LANGUAGE_STORAGE_KEY = "kairo-language";
const LANGUAGE_CHANGE_EVENT = "kairo-language-change";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(
  null,
);

function subscribeToLanguageChanges(
  callback: () => void,
): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
  };
}

function getLanguageSnapshot(): Language {
  try {
    const savedLanguage = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    );

    return isLanguage(savedLanguage)
      ? savedLanguage
      : defaultLanguage;
  } catch {
    return defaultLanguage;
  }
}

function getServerLanguageSnapshot(): Language {
  return defaultLanguage;
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const language = useSyncExternalStore(
    subscribeToLanguageChanges,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    try {
      window.localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        nextLanguage,
      );
    } catch {
      // The app remains usable if storage is unavailable.
    }

    document.documentElement.lang = nextLanguage;

    window.dispatchEvent(
      new Event(LANGUAGE_CHANGE_EVENT),
    );
  }, []);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: getDictionary(language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used within LanguageProvider.",
    );
  }

  return context;
}