
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/language/LanguageProvider";

export default function LogoutButton() {
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleLogout() {
    setLoading(true);
    setHasError(false);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("LOGOUT_FAILED");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setHasError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        aria-busy={loading}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
      >
        {loading ? t.auth.loggingOut : t.auth.logout}
      </button>

      {hasError && (
        <p role="alert" className="max-w-xs text-right text-xs text-rose-400">
          {t.auth.logoutError}
        </p>
      )}
    </div>
  );
}
