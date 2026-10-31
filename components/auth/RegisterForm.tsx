
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/language/LanguageProvider";
import LanguageSwitcher from "@/components/language/LanguageSwitcher";

type RegisterData = {
  business_name: string;
  industry: string;
  business_email: string;
  business_phone: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialData: RegisterData = {
  business_name: "",
  industry: "",
  business_email: "",
  business_phone: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-medium text-slate-300";

type RegisterError =
  | "passwordTooShort"
  | "passwordsDoNotMatch"
  | "registrationError"
  | "unexpectedError"
  | "emailAlreadyRegistered"
  | "businessAlreadyRegistered";

export default function RegisterForm() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const r = t.auth.register;

  const [form, setForm] = useState<RegisterData>(initialData);
  const [error, setError] = useState<RegisterError | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof RegisterData, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function getErrorMessage(): string {
    switch (error) {
      case "passwordTooShort":
        return r.passwordTooShort;
      case "passwordsDoNotMatch":
        return r.passwordsDoNotMatch;
      case "emailAlreadyRegistered":
        return language === "es"
          ? "Este correo ya está registrado."
          : "This email address is already registered.";
      case "businessAlreadyRegistered":
        return language === "es"
          ? "Ya existe un negocio registrado con este correo."
          : "A business with this email address is already registered.";
      case "unexpectedError":
        return t.common.unexpectedError;
      case "registrationError":
        return r.registrationError;
      default:
        return "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError(null);

    if (form.password.length < 8) {
      setError("passwordTooShort");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("passwordsDoNotMatch");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: form.business_name.trim(),
          industry: form.industry.trim(),
          business_email: form.business_email.trim(),
          business_phone: form.business_phone.trim() || null,
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      if (!response.ok) {
        setError("registrationError");
        return;
      }

      sessionStorage.setItem(
  "kairo_registration_email",
  form.email.trim()
);
router.push("/login?registered=1");
    } catch {
      setError("unexpectedError");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/login"
              className="text-3xl font-bold tracking-tight text-white"
            >
              {t.common.appName}
            </Link>

            <LanguageSwitcher compact />
          </div>

          <p className="mt-2 text-sm text-slate-400">
            {t.navigation.brandSubtitle}
          </p>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-10">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
              {r.eyebrow}
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              {r.title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {r.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-9">
            <section>
              <div className="mb-5 border-b border-slate-800 pb-3">
                <h2 className="font-semibold text-white">
                  {r.businessSection}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {r.businessDescription}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="business_name" className={labelClass}>
                    {r.businessName}
                  </label>

                  <input
                    id="business_name"
                    name="business_name"
                    required
                    maxLength={120}
                    autoComplete="organization"
                    value={form.business_name}
                    onChange={(event) =>
                      updateField("business_name", event.target.value)
                    }
                    placeholder={r.businessNamePlaceholder}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="industry" className={labelClass}>
                    {r.industry}
                  </label>

                  <input
                    id="industry"
                    name="industry"
                    required
                    maxLength={100}
                    value={form.industry}
                    onChange={(event) =>
                      updateField("industry", event.target.value)
                    }
                    placeholder={r.industryPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="business_email" className={labelClass}>
                    {r.businessEmail}
                  </label>

                  <input
                    id="business_email"
                    name="business_email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.business_email}
                    onChange={(event) =>
                      updateField("business_email", event.target.value)
                    }
                    placeholder={r.businessEmailPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="business_phone" className={labelClass}>
                    {r.businessPhone}
                  </label>

                  <input
                    id="business_phone"
                    name="business_phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={30}
                    value={form.business_phone}
                    onChange={(event) =>
                      updateField("business_phone", event.target.value)
                    }
                    placeholder={r.businessPhonePlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-5 border-b border-slate-800 pb-3">
                <h2 className="font-semibold text-white">
                  {r.ownerSection}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {r.ownerDescription}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={labelClass}>
                    {r.fullName}
                  </label>

                  <input
                    id="name"
                    name="name"
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder={r.fullNamePlaceholder}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    {r.loginEmail}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder={r.loginEmailPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    {r.password}
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder={r.passwordPlaceholder}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    {r.confirmPassword}
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    placeholder={r.confirmPasswordPlaceholder}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-300"
              >
                {getErrorMessage()}
              </p>
            )}

            <div className="space-y-5 border-t border-slate-800 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? r.creatingAccount : r.createAccount}
              </button>

              <p className="text-center text-sm text-slate-400">
                {t.auth.alreadyHaveAccount}{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  {t.auth.signIn}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
