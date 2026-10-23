
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/types/service";

type ServiceFormProps = {
  service?: Service;
  onCancel?: () => void;
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

type FormValues = {
  name: string;
  description: string;
  category: string;
  duration: string;
  price: string;
};

function getInitialValues(service?: Service): FormValues {
  return {
    name: service?.name ?? "",
    description: service?.description ?? "",
    category: service?.category ?? "",
    duration: service ? String(service.duration_minutes) : "",
    price: service ? String(service.price) : "",
  };
}

function valuesChanged(
  values: FormValues,
  initial: FormValues
) {
  return (
    values.name !== initial.name ||
    values.description !== initial.description ||
    values.category !== initial.category ||
    values.duration !== initial.duration ||
    values.price !== initial.price
  );
}

export function ServiceForm({
  service,
  onCancel,
  onSuccess,
  onDirtyChange,
}: ServiceFormProps) {
  const router = useRouter();
  const isEditing = Boolean(service);

  const [initialValues] = useState<FormValues>(() =>
    getInitialValues(service)
  );

  const [values, setValues] = useState<FormValues>(() =>
    getInitialValues(service)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isDirty = valuesChanged(values, initialValues);

  function updateField(
    field: keyof FormValues,
    value: string
  ) {
    const next = {
      ...values,
      [field]: value,
    };

    setValues(next);
    setError("");
    onDirtyChange?.(valuesChanged(next, initialValues));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    const name = values.name.trim();
    const description = values.description.trim();
    const category = values.category.trim();
    const duration = Number(values.duration);
    const price = Number(values.price);

    if (!name) {
      setError("Enter a service name.");
      return;
    }

    if (name.length > 150) {
      setError("Service name must be 150 characters or fewer.");
      return;
    }

    if (description.length > 1000 || category.length > 100) {
      setError("Description or category exceeds the allowed length.");
      return;
    }

    if (
      values.duration.trim() === "" ||
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      setError("Duration must be a whole number greater than zero.");
      return;
    }

    if (
      values.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(values.price)
    ) {
      setError("Enter a valid price with up to two decimal places.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        isEditing
          ? `/api/services/${encodeURIComponent(service!.id)}`
          : "/api/services",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description: description || null,
            category: category || null,
            duration_minutes: duration,
            price,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : isEditing
              ? "Unable to update service."
              : "Unable to create service."
        );
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
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-50";

  const labelClassName =
    "mb-2 block text-sm font-medium text-slate-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {isEditing ? "Edit service details" : "Add a service"}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? "Update service information. Historical visit amounts will remain unchanged."
            : "Add a service to your catalog so it can be selected when recording customer visits."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="service-name" className={labelClassName}>
            Service name <span className="text-rose-400">*</span>
          </label>

          <input
            id="service-name"
            type="text"
            required
            maxLength={150}
            disabled={loading}
            value={values.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            placeholder="e.g. Deep cleansing facial"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="service-category" className={labelClassName}>
            Category
          </label>

          <input
            id="service-category"
            type="text"
            maxLength={100}
            disabled={loading}
            value={values.category}
            onChange={(event) =>
              updateField("category", event.target.value)
            }
            placeholder="e.g. Facial treatments"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="service-duration" className={labelClassName}>
            Duration (minutes) <span className="text-rose-400">*</span>
          </label>

          <input
            id="service-duration"
            type="number"
            required
            min="1"
            step="1"
            disabled={loading}
            value={values.duration}
            onChange={(event) =>
              updateField("duration", event.target.value)
            }
            placeholder="e.g. 60"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="service-price" className={labelClassName}>
            Price (MXN) <span className="text-rose-400">*</span>
          </label>

          <input
            id="service-price"
            type="number"
            required
            min="0"
            step="0.01"
            disabled={loading}
            value={values.price}
            onChange={(event) =>
              updateField("price", event.target.value)
            }
            placeholder="e.g. 850.00"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="service-description" className={labelClassName}>
            Description
          </label>

          <textarea
            id="service-description"
            rows={4}
            maxLength={1000}
            disabled={loading}
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Describe what this service includes..."
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
              : "Adding service..."
            : isEditing
              ? "Save changes"
              : "Add service"}
        </button>
      </div>
    </form>
  );
}
