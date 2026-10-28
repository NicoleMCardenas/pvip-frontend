
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { useLanguage } from "@/components/language/LanguageProvider";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

export default function ForgotPasswordPage() {
  const { language, t } = useLanguage();
  const content = t.auth.forgotPassword;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || success) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : content.requestError
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : content.unexpectedError
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher compact />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            KAIRO
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Customer Intelligence Platform
          </p>
        </div>

        <h2 className="text-xl font-semibold text-white">
          {content.title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {content.description}
        </p>

        {success ? (
          <div
            role="status"
            className="mt-6 rounded-lg border border-emerald-800 bg-emerald-950/40 p-4 text-sm leading-6 text-emerald-300"
          >
            {content.success}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                {content.email}
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={content.emailPlaceholder}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? content.sending : content.submit}
            </button>
          </form>
        )}

        <div className="mt-7 border-t border-slate-800 pt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            {content.backToLogin}
          </Link>
        </div>
      </div>
    </main>
  );
}
