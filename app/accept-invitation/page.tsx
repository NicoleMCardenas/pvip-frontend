
"use client";

import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useLanguage } from "@/components/language/LanguageProvider";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

function AcceptInvitationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const linkLanguage = searchParams.get("lang");

  const { setLanguage, t } = useLanguage();
  const content = t.auth.acceptInvitation;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (linkLanguage === "es" || linkLanguage === "en") {
      setLanguage(linkLanguage);
    }
  }, [linkLanguage, setLanguage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || success || !token) return;

    setError("");

    if (password.length < 8) {
      setError(content.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(content.passwordsDoNotMatch);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/staff-invitations/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(content.invalidOrExpired);
        }

        throw new Error(content.requestError);
      }

      setPassword("");
      setConfirmPassword("");
      setSuccess(true);

      window.history.replaceState(
        window.history.state,
        "",
        "/accept-invitation"
      );
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

        {success ? (
          <>
            <h2 className="text-xl font-semibold text-white">
              {content.successTitle}
            </h2>

            <p
              role="status"
              className="mt-4 text-sm leading-6 text-slate-300"
            >
              {content.successDescription}
            </p>

            <Link
              href="/login"
              className="mt-7 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              {content.signIn}
            </Link>
          </>
        ) : !token ? (
          <>
            <h2 className="text-xl font-semibold text-white">
              {content.invalidLinkTitle}
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {content.invalidLinkDescription}
            </p>

            <Link
              href="/login"
              className="mt-7 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              {content.backToLogin}
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white">
              {content.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {content.description}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  {content.newPassword}
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  {content.confirmPassword}
                </label>

                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
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
                {loading
                  ? content.activating
                  : content.activate}
              </button>
            </form>

            <div className="mt-7 border-t border-slate-800 pt-6 text-center">
              <Link
                href="/login"
                className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
              >
                {content.backToLogin}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
          <p className="text-sm text-slate-400">
            KAIRO · Customer Intelligence
          </p>
        </main>
      }
    >
      <AcceptInvitationForm />
    </Suspense>
  );
}

