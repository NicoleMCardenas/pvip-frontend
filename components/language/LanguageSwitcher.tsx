
"use client";

import { Globe2 } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import type { Language } from "@/lib/i18n";

type LanguageSwitcherProps = {
  compact?: boolean;
};

export default function LanguageSwitcher({
  compact = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const options: { value: Language; label: string }[] = [
    { value: "es", label: "ES" },
    { value: "en", label: "EN" },
  ];

  return (
    <div
      className={[
        "flex items-center gap-3",
        compact ? "" : "justify-between",
      ].join(" ")}
    >
      {!compact && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Globe2 size={16} aria-hidden="true" />
          <span>{t.language.label}</span>
        </div>
      )}

      <div
        role="group"
        aria-label={t.language.label}
        className="inline-flex rounded-lg border border-slate-700 bg-slate-900 p-1"
      >
        {options.map((option) => {
          const isActive = language === option.value;

          return (
            <button
              key={option.value}
              type="button"
              lang={option.value}
              aria-label={
                option.value === "es"
                  ? t.language.spanish
                  : t.language.english
              }
              aria-pressed={isActive}
              onClick={() => setLanguage(option.value)}
              className={[
                "min-w-10 rounded-md px-2.5 py-1.5 text-xs font-semibold",
                "transition-colors focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-blue-400",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
