
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useLanguage } from "@/components/language/LanguageProvider";

export type StaffMember = {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string | null;
};

type StaffFormProps = {
  staffMember?: StaffMember;
  onCancel?: () => void;
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

type StaffFormValues = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

function normalizeValues(
  values: StaffFormValues
): StaffFormValues {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    role: values.role.trim(),
  };
}

export function StaffForm({
  staffMember,
  onCancel,
  onSuccess,
  onDirtyChange,
}: StaffFormProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const isEditing = Boolean(staffMember);

  const initialValues: StaffFormValues = {
    name: staffMember?.name ?? "",
    email: staffMember?.email ?? "",
    phone: staffMember?.phone ?? "",
    role: staffMember?.role ?? "",
  };

  const [values, setValues] =
    useState<StaffFormValues>(initialValues);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedInitial = normalizeValues(initialValues);
  const normalizedCurrent = normalizeValues(values);

  const isDirty = (
    Object.keys(normalizedCurrent) as Array<
      keyof StaffFormValues
    >
  ).some(
    (key) =>
      normalizedCurrent[key] !== normalizedInitial[key]
  );

  function updateField(
    field: keyof StaffFormValues,
    value: string
  ) {
    const nextValues = {
      ...values,
      [field]: value,
    };

    setValues(nextValues);
    setError("");

    const nextNormalized = normalizeValues(nextValues);

    const dirty = (
      Object.keys(nextNormalized) as Array<
        keyof StaffFormValues
      >
    ).some(
      (key) =>
        nextNormalized[key] !== normalizedInitial[key]
    );

    onDirtyChange?.(dirty);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!normalizedCurrent.name) {
      setError(t.staff.nameRequired);
      return;
    }

    if (!normalizedCurrent.role) {
      setError(t.staff.roleRequired);
      return;
    }

    if (isEditing && !isDirty) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        isEditing
          ? `/api/staff/${staffMember?.id}`
          : "/api/staff",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: normalizedCurrent.name,
            email: normalizedCurrent.email || null,
            phone: normalizedCurrent.phone || null,
            role: normalizedCurrent.role,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof data?.detail === "string"
            ? data.detail
            : t.staff.saveError;

        throw new Error(message);
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.staff.unexpectedError
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {isEditing
            ? t.staff.editStaff
            : t.staff.addStaff}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? t.staff.editFormDescription
            : t.staff.createFormDescription}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="staff-name"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {t.staff.fullName}{" "}
            <span className="text-rose-400">*</span>
          </label>

          <input
            id="staff-name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            disabled={loading}
            value={values.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            placeholder={t.staff.namePlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="staff-role"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {t.staff.role}{" "}
            <span className="text-rose-400">*</span>
          </label>

          <input
            id="staff-role"
            type="text"
            required
            maxLength={100}
            disabled={loading}
            value={values.role}
            onChange={(event) =>
              updateField("role", event.target.value)
            }
            placeholder={t.staff.rolePlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="staff-email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {t.staff.email}
          </label>

          <input
            id="staff-email"
            type="email"
            autoComplete="email"
            disabled={loading}
            value={values.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            placeholder={t.staff.emailPlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="staff-phone"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {t.staff.phone}
          </label>

          <input
            id="staff-phone"
            type="tel"
            autoComplete="tel"
            disabled={loading}
            value={values.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            placeholder={t.staff.phonePlaceholder}
            className={inputClassName}
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
          >
            {t.staff.cancel}
          </button>
        )}

        <button
          type="submit"
          disabled={loading || (isEditing && !isDirty)}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? t.staff.savingChanges
              : t.staff.creatingMember
            : isEditing
              ? t.staff.saveChanges
              : t.staff.createMember}
        </button>
      </div>
    </form>
  );
}
