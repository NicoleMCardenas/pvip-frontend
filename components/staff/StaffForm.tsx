
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

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
      setError("Team member name is required.");
      return;
    }

    if (!normalizedCurrent.role) {
      setError("Role is required.");
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
            : "Unable to save team member.";

        throw new Error(message);
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
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
            ? "Edit team member"
            : "Add team member"}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? "Update employee information while keeping the team directory accurate."
            : "Create a team profile to organize employee information and associate staff members with customer visits."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="staff-name"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Full name{" "}
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
            placeholder="e.g. Sofia Martinez"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="staff-role"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Role{" "}
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
            placeholder="e.g. Esthetician"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="staff-email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Email address
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
            placeholder="team@example.com"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="staff-phone"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Phone number
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
            placeholder="e.g. +52 222 123 4567"
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
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || (isEditing && !isDirty)}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? "Saving changes..."
              : "Creating team member..."
            : isEditing
              ? "Save changes"
              : "Create team member"}
        </button>
      </div>
    </form>
  );
}
