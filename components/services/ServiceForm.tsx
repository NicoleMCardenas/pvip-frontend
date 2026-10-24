
"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language/LanguageProvider";
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
  const { t } = useLanguage();
  const copy = t.services;
  const formId = useId();

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
      setError(copy.nameRequired);
      return;
    }

    if (name.length > 150) {
      setError(copy.nameTooLong);
      return;
    }

    if (description.length > 1000 || category.length > 100) {
      setError(copy.descriptionOrCategoryTooLong);
      return;
    }

    if (
      values.duration.trim() === "" ||
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      setError(copy.invalidDuration);
      return;
    }

    if (
      values.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(values.price)
    ) {
      setError(copy.invalidPrice);
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
              ? copy.updateError
              : copy.createError
        );
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : copy.unexpectedError
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
          {isEditing ? copy.editFormTitle : copy.addFormTitle}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? copy.editFormDescription
            : copy.addFormDescription}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={`${formId}-name`}
            className={labelClassName}
          >
            {copy.serviceName}{" "}
            <span className="text-rose-400">*</span>
          </label>

          <input
            id={`${formId}-name`}
            type="text"
            required
            maxLength={150}
            disabled={loading}
            value={values.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            placeholder={copy.serviceNamePlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-category`}
            className={labelClassName}
          >
            {copy.category}
          </label>

          <input
            id={`${formId}-category`}
            type="text"
            maxLength={100}
            disabled={loading}
            value={values.category}
            onChange={(event) =>
              updateField("category", event.target.value)
            }
            placeholder={copy.categoryPlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-duration`}
            className={labelClassName}
          >
            {copy.durationMinutes}{" "}
            <span className="text-rose-400">*</span>
          </label>

          <input
            id={`${formId}-duration`}
            type="number"
            required
            min="1"
            step="1"
            disabled={loading}
            value={values.duration}
            onChange={(event) =>
              updateField("duration", event.target.value)
            }
            placeholder={copy.durationPlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-price`}
            className={labelClassName}
          >
            {copy.priceMXN}{" "}
            <span className="text-rose-400">*</span>
          </label>

          <input
            id={`${formId}-price`}
            type="number"
            required
            min="0"
            step="0.01"
            disabled={loading}
            value={values.price}
            onChange={(event) =>
              updateField("price", event.target.value)
            }
            placeholder={copy.pricePlaceholder}
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-description`}
            className={labelClassName}
          >
            {copy.description}
          </label>

          <textarea
            id={`${formId}-description`}
            rows={4}
            maxLength={1000}
            disabled={loading}
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder={copy.descriptionPlaceholder}
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
            {copy.cancel}
          </button>
        )}

        <button
          type="submit"
          disabled={loading || (isEditing && !isDirty)}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? copy.savingChanges
              : copy.addingService
            : isEditing
              ? copy.saveChanges
              : copy.addService}
        </button>
      </div>
    </form>
  );
}
