
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Pencil,
  ShieldCheck,
} from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import { useUnsavedChanges } from "@/components/navigation/UnsavedChangesProvider";
import type {
  Business,
  AuthenticatedUser,
  BusinessUpdate,
} from "@/types/business";

type Props = {
  business: Business;
  user: AuthenticatedUser;
};

type FormValues = {
  name: string;
  industry: string;
  email: string;
  phone: string;
};

function toFormValues(business: Business): FormValues {
  return {
    name: business.name,
    industry: business.industry,
    email: business.email,
    phone: business.phone ?? "",
  };
}

function normalize(values: FormValues): FormValues {
  return {
    name: values.name.trim(),
    industry: values.industry.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
  };
}

export default function BusinessSettingsContent({
  business: initialBusiness,
  user,
}: Props) {
  const router = useRouter();
  const { t } = useLanguage();
  const s = t.settings;

  const {
    pendingDestination,
    setHasUnsavedChanges,
    cancelNavigation,
    confirmNavigation,
  } = useUnsavedChanges();

  const isOwner = user.role === "owner";

  const [business, setBusiness] = useState(initialBusiness);
  const [values, setValues] = useState<FormValues>(
    toFormValues(initialBusiness)
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] =
    useState(false);

  const discardCancelRef = useRef<HTMLButtonElement>(null);
  const discardDialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  const original = normalize(toFormValues(business));
  const current = normalize(values);

  const isDirty = (
    Object.keys(current) as Array<keyof FormValues>
  ).some((key) => current[key] !== original[key]);

  const hasPendingChanges = editing && isDirty;
  const isNavigationConfirmation = pendingDestination !== null;
  const isConfirmationOpen =
    showDiscardConfirmation || isNavigationConfirmation;

  // Share the form's dirty state with the dashboard navigation.
  useEffect(() => {
    setHasUnsavedChanges(hasPendingChanges);
  }, [hasPendingChanges, setHasUnsavedChanges]);

  // Clear the shared state when Settings is unmounted.
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  // Browser refresh, tab close, or navigation outside the app.
  useEffect(() => {
    if (!hasPendingChanges) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [hasPendingChanges]);

  // Preserve the existing custom confirmation modal behavior.
  useEffect(() => {
    if (!isConfirmationOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    discardCancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();

        if (isNavigationConfirmation) {
          cancelNavigation();
        } else {
          setShowDiscardConfirmation(false);
        }

        requestAnimationFrame(() => {
          cancelButtonRef.current?.focus();
        });

        return;
      }

      if (event.key !== "Tab") return;

      const container = discardDialogRef.current;
      if (!container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLButtonElement>(
          "button:not([disabled])"
        )
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (
        event.shiftKey &&
        (active === first || !container.contains(active))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (active === last || !container.contains(active))
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isConfirmationOpen,
    isNavigationConfirmation,
    cancelNavigation,
  ]);

  function updateField(field: keyof FormValues, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));
    setError("");
    setSuccess(false);
  }

  function discardChanges() {
    setValues(toFormValues(business));
    setEditing(false);
    setShowDiscardConfirmation(false);
    setError("");
    setSuccess(false);
    setHasUnsavedChanges(false);

    requestAnimationFrame(() => {
      editButtonRef.current?.focus();
    });
  }

  function handleCancel() {
    if (saving) return;

    if (isDirty) {
      setShowDiscardConfirmation(true);
      return;
    }

    discardChanges();
  }

  function keepEditing() {
    if (isNavigationConfirmation) {
      cancelNavigation();
    } else {
      setShowDiscardConfirmation(false);
    }

    requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });
  }

  function handleDiscardConfirmation() {
    if (isNavigationConfirmation) {
      setHasUnsavedChanges(false);
      confirmNavigation();
      return;
    }

    discardChanges();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isOwner || saving || !isDirty) return;

    if (!current.name || !current.industry) {
      setError(s.requiredField);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current.email)) {
      setError(s.invalidEmail);
      return;
    }

    const payload: BusinessUpdate = {
      name: current.name,
      industry: current.industry,
      email: current.email,
      phone: current.phone || null,
    };

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/business", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          setError(s.sessionExpired);
        } else if (response.status === 403) {
          setError(s.permissionError);
        } else if (response.status === 409) {
          setError(s.duplicateEmail);
        } else if (response.status === 422) {
          setError(s.requiredField);
        } else {
          setError(s.saveError);
        }
        return;
      }

      const updatedBusiness = data as Business;

      setBusiness(updatedBusiness);
      setValues(toFormValues(updatedBusiness));
      setEditing(false);
      setHasUnsavedChanges(false);
      setSuccess(true);
      router.refresh();
    } catch {
      setError(s.saveError);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 disabled:opacity-60";

  const fields: Array<{
    key: keyof FormValues;
    label: string;
    type: string;
  }> = [
    { key: "name", label: s.businessName, type: "text" },
    { key: "industry", label: s.industry, type: "text" },
    { key: "email", label: s.email, type: "email" },
    { key: "phone", label: s.phone, type: "tel" },
  ];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            {s.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {s.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {s.description}
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="flex flex-col gap-5 border-b border-slate-800 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-sky-500/10 p-3 text-sky-400">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {s.businessSection}
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {s.businessDescription}
                </p>
              </div>
            </div>

            {isOwner && !editing && (
              <button
                ref={editButtonRef}
                type="button"
                onClick={() => {
                  setEditing(true);
                  setSuccess(false);
                  setError("");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-sky-500 hover:text-white"
              >
                <Pencil size={15} />
                {s.edit}
              </button>
            )}
          </div>

          <div className="p-6">
            {!isOwner && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-300">
                <ShieldCheck
                  size={18}
                  className="shrink-0 text-sky-400"
                />
                <p>{s.ownerOnly}</p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-4"
              >
                <CheckCircle2
                  size={19}
                  className="shrink-0 text-emerald-400"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-300">
                    {s.savedTitle}
                  </p>
                  <p className="mt-1 text-sm text-emerald-200/80">
                    {s.savedDescription}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label
                      htmlFor={`business-${field.key}`}
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      {field.label}
                      {field.key === "phone" ? (
                        <span className="ml-2 text-xs font-normal text-slate-500">
                          {s.optional}
                        </span>
                      ) : (
                        editing && (
                          <span className="ml-1 text-rose-400">
                            *
                          </span>
                        )
                      )}
                    </label>

                    {editing ? (
                      <input
                        id={`business-${field.key}`}
                        type={field.type}
                        required={field.key !== "phone"}
                        disabled={saving}
                        value={values[field.key]}
                        onChange={(event) =>
                          updateField(field.key, event.target.value)
                        }
                        autoComplete={
                          field.key === "email"
                            ? "email"
                            : field.key === "phone"
                              ? "tel"
                              : "off"
                        }
                        className={inputClass}
                      />
                    ) : (
                      <div className="flex min-h-12 items-center rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-100">
                        {field.key === "phone" && !business.phone
                          ? "—"
                          : business[field.key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-6 rounded-xl border border-rose-900 bg-rose-950/40 p-4 text-sm text-rose-300"
                >
                  {error}
                </p>
              )}

              {editing && (
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
                  <button
                    ref={cancelButtonRef}
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {s.cancel}
                  </button>

                  <button
                    type="submit"
                    disabled={saving || !isDirty}
                    className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? s.saving : s.save}
                  </button>
                </div>
              )}
            </form>
          </div>
        </section>
      </div>

      {isConfirmationOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/75 px-5">
          <div
            ref={discardDialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="business-discard-title"
            aria-describedby="business-discard-description"
            className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <h3
              id="business-discard-title"
              className="text-lg font-semibold text-white"
            >
              {t.staff.discardTitle}
            </h3>

            <p
              id="business-discard-description"
              className="mt-2 text-sm leading-relaxed text-slate-400"
            >
              {s.unsavedChanges}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                ref={discardCancelRef}
                type="button"
                onClick={keepEditing}
                className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                {t.staff.keepEditing}
              </button>

              <button
                type="button"
                onClick={handleDiscardConfirmation}
                className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                {t.staff.discardChanges}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
