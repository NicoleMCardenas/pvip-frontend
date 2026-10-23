
"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Visit } from "@/types/visit";

type ClientOption = {
  id: string;
  name: string;
  status: string;
};

type ServiceOption = {
  id: string;
  name: string;
  price: number | string;
  status: string;
};

type StaffOption = {
  id: string;
  name: string;
  status: string;
};

type VisitFormProps = {
  clients: ClientOption[];
  services: ServiceOption[];
  staff: StaffOption[];
  visit?: Visit;
  onCancel?: () => void;
  onSuccess?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

type FormValues = {
  clientId: string;
  serviceId: string;
  staffId: string;
  visitDate: string;
  amount: string;
  notes: string;
};

function toLocalDateTime(date: Date) {
  const pad = (value: number) =>
    String(value).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

function getInitialValues(visit?: Visit): FormValues {
  if (!visit) {
    return {
      clientId: "",
      serviceId: "",
      staffId: "",
      visitDate: "",
      amount: "",
      notes: "",
    };
  }

  return {
    clientId: visit.client_id,
    serviceId: visit.service_id,
    staffId: visit.staff_id,
    visitDate: toLocalDateTime(new Date(visit.visit_date)),
    amount: String(visit.amount),
    notes: visit.notes ?? "",
  };
}

export function VisitForm({
  clients,
  services,
  staff,
  visit,
  onCancel,
  onSuccess,
  onDirtyChange,
}: VisitFormProps) {
  const router = useRouter();
  const isEditing = Boolean(visit);

  const [initialValues] = useState<FormValues>(() =>
    getInitialValues(visit)
  );

  const [values, setValues] = useState<FormValues>(
    () => getInitialValues(visit)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const availableClients = useMemo(
    () =>
      clients
        .filter(
          (client) =>
            client.status !== "archived" ||
            client.id === visit?.client_id
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [clients, visit?.client_id]
  );

  const availableServices = useMemo(
    () =>
      services
        .filter(
          (service) =>
            service.status === "active" ||
            service.id === visit?.service_id
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [services, visit?.service_id]
  );

  const availableStaff = useMemo(
    () =>
      staff
        .filter(
          (member) =>
            member.status === "active" ||
            member.id === visit?.staff_id
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [staff, visit?.staff_id]
  );

  const hasRequiredOptions =
    availableClients.length > 0 &&
    availableServices.length > 0 &&
    availableStaff.length > 0;

  const isDirty =
    values.clientId !== initialValues.clientId ||
    values.serviceId !== initialValues.serviceId ||
    values.staffId !== initialValues.staffId ||
    values.visitDate !== initialValues.visitDate ||
    values.amount !== initialValues.amount ||
    values.notes !== initialValues.notes;

  function updateField(
    field: keyof FormValues,
    value: string
  ) {
    const nextValues: FormValues = {
      ...values,
      [field]: value,
    };

    if (field === "serviceId") {
      const selectedService = availableServices.find(
        (service) => service.id === value
      );

      nextValues.amount = selectedService
        ? String(selectedService.price)
        : "";
    }

    setValues(nextValues);
    setError("");

    const dirty =
      nextValues.clientId !== initialValues.clientId ||
      nextValues.serviceId !== initialValues.serviceId ||
      nextValues.staffId !== initialValues.staffId ||
      nextValues.visitDate !== initialValues.visitDate ||
      nextValues.amount !== initialValues.amount ||
      nextValues.notes !== initialValues.notes;

    onDirtyChange?.(dirty);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    if (!hasRequiredOptions) {
      setError(
        "A customer, service, and team member are required."
      );
      return;
    }

    if (
      !values.clientId ||
      !values.serviceId ||
      !values.staffId ||
      !values.visitDate
    ) {
      setError("Complete all required fields.");
      return;
    }

    const selectedDate = new Date(values.visitDate);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() > Date.now()
    ) {
      setError(
        "Visit date must be valid and cannot be in the future."
      );
      return;
    }

    const parsedAmount = Number(values.amount);

    if (
      values.amount.trim() === "" ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0
    ) {
      setError("Enter a valid amount of zero or greater.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        isEditing
          ? `/api/visits/${visit!.id}`
          : "/api/visits",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: values.clientId,
            service_id: values.serviceId,
            staff_id: values.staffId,
            visit_date: selectedDate.toISOString(),
            amount: parsedAmount,
            notes: values.notes.trim() || null,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = data?.detail;

        throw new Error(
          typeof detail === "string"
            ? detail
            : isEditing
              ? "Unable to update visit."
              : "Unable to create visit."
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
          {isEditing ? "Edit visit details" : "Record a visit"}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? "Update the visit information. Changes to the amount or date will be reflected in customer metrics."
            : "Connect a customer with the service they received and the team member who attended them."}
        </p>
      </div>

      {!hasRequiredOptions && (
        <div
          role="status"
          className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-200"
        >
          A customer, service, and team member must be
          available to complete this form.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="visit-client"
            className={labelClassName}
          >
            Customer <span className="text-rose-400">*</span>
          </label>

          <select
            id="visit-client"
            required
            disabled={loading || availableClients.length === 0}
            value={values.clientId}
            onChange={(event) =>
              updateField("clientId", event.target.value)
            }
            className={inputClassName}
          >
            <option value="">Select a customer</option>

            {availableClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
                {client.status === "archived"
                  ? " (Archived)"
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="visit-service"
            className={labelClassName}
          >
            Service <span className="text-rose-400">*</span>
          </label>

          <select
            id="visit-service"
            required
            disabled={loading || availableServices.length === 0}
            value={values.serviceId}
            onChange={(event) =>
              updateField("serviceId", event.target.value)
            }
            className={inputClassName}
          >
            <option value="">Select a service</option>

            {availableServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
                {service.status !== "active"
                  ? " (Inactive)"
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="visit-staff"
            className={labelClassName}
          >
            Team member <span className="text-rose-400">*</span>
          </label>

          <select
            id="visit-staff"
            required
            disabled={loading || availableStaff.length === 0}
            value={values.staffId}
            onChange={(event) =>
              updateField("staffId", event.target.value)
            }
            className={inputClassName}
          >
            <option value="">Select a team member</option>

            {availableStaff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
                {member.status !== "active"
                  ? " (Inactive)"
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="visit-date"
            className={labelClassName}
          >
            Visit date and time{" "}
            <span className="text-rose-400">*</span>
          </label>

          <input
            id="visit-date"
            type="datetime-local"
            required
            max={toLocalDateTime(new Date())}
            disabled={loading}
            value={values.visitDate}
            onChange={(event) =>
              updateField("visitDate", event.target.value)
            }
            className={inputClassName}
          />

          <p className="mt-2 text-xs text-slate-500">
            Enter the local date and time of the completed visit.
          </p>
        </div>

        <div>
          <label
            htmlFor="visit-amount"
            className={labelClassName}
          >
            Amount (MXN) <span className="text-rose-400">*</span>
          </label>

          <input
            id="visit-amount"
            type="number"
            required
            min="0"
            step="0.01"
            disabled={loading}
            value={values.amount}
            onChange={(event) =>
              updateField("amount", event.target.value)
            }
            placeholder="0.00"
            className={inputClassName}
          />

          <p className="mt-2 text-xs text-slate-500">
            The service price is suggested automatically.
            You can adjust the final amount.
          </p>
        </div>

        <div>
          <label
            htmlFor="visit-notes"
            className={labelClassName}
          >
            Notes
          </label>

          <textarea
            id="visit-notes"
            rows={3}
            maxLength={1000}
            disabled={loading}
            value={values.notes}
            onChange={(event) =>
              updateField("notes", event.target.value)
            }
            placeholder="Add optional details about this visit..."
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
          disabled={
            loading ||
            !hasRequiredOptions ||
            (isEditing && !isDirty)
          }
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? "Saving changes..."
              : "Recording visit..."
            : isEditing
              ? "Save changes"
              : "Record visit"}
        </button>
      </div>
    </form>
  );
}
