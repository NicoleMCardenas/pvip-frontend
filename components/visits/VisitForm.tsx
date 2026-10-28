
"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language/LanguageProvider";
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

type VisitErrorKey =
  | "requiredOptionsError"
  | "requiredFieldsError"
  | "invalidDateError"
  | "invalidAmountError"
  | "createError"
  | "updateError"
  | "unexpectedError";

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
  const { t } = useLanguage();
  const copy = t.visits;

  const isEditing = Boolean(visit);

  const [initialValues] = useState<FormValues>(() =>
    getInitialValues(visit)
  );

  const [values, setValues] = useState<FormValues>(() =>
    getInitialValues(visit)
  );

  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<VisitErrorKey | null>(
    null
  );
  const [serverError, setServerError] = useState("");

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

  function clearError() {
    setErrorKey(null);
    setServerError("");
  }

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
    clearError();

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
      setErrorKey("requiredOptionsError");
      return;
    }

    if (
      !values.clientId ||
      !values.serviceId ||
      !values.staffId ||
      !values.visitDate
    ) {
      setErrorKey("requiredFieldsError");
      return;
    }

    const selectedDate = new Date(values.visitDate);
    const year = Number(values.visitDate.split("-")[0]);

    if (
      !Number.isInteger(year) ||
      year < 1000 ||
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate.getTime() > Date.now()
    ) {
      setErrorKey("invalidDateError");
      return;
    }

    const parsedAmount = Number(values.amount);

    if (
      values.amount.trim() === "" ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount < 0
    ) {
      setErrorKey("invalidAmountError");
      return;
    }

    setLoading(true);
    clearError();

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

        if (typeof detail === "string" && detail.trim()) {
          setServerError(detail);
        } else {
          setErrorKey(
            isEditing ? "updateError" : "createError"
          );
        }

        return;
      }

      onSuccess?.();
      router.refresh();
    } catch {
      setErrorKey("unexpectedError");
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 disabled:cursor-not-allowed disabled:opacity-50";

  const labelClassName =
    "mb-2 block text-sm font-medium text-slate-200";

  const displayedError = errorKey
    ? copy[errorKey]
    : serverError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {isEditing
            ? copy.editVisitDetails
            : copy.recordVisit}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? copy.editDescription
            : copy.createDescription}
        </p>
      </div>

      {!hasRequiredOptions && (
        <div
          role="status"
          className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-200"
        >
          {copy.requiredOptions}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="visit-client"
            className={labelClassName}
          >
            {copy.customer}{" "}
            <span className="text-rose-400">*</span>
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
            <option value="">{copy.selectCustomer}</option>

            {availableClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
                {client.status === "archived"
                  ? ` (${copy.archived})`
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
            {copy.service}{" "}
            <span className="text-rose-400">*</span>
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
            <option value="">{copy.selectService}</option>

            {availableServices.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
                {service.status !== "active"
                  ? ` (${copy.inactive})`
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
            {copy.teamMember}{" "}
            <span className="text-rose-400">*</span>
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
            <option value="">{copy.selectTeamMember}</option>

            {availableStaff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
                {member.status !== "active"
                  ? ` (${copy.inactive})`
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
            {copy.visitDateTime}{" "}
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
            {copy.visitDateHelp}
          </p>
        </div>

        <div>
          <label
            htmlFor="visit-amount"
            className={labelClassName}
          >
            {copy.amountMXN}{" "}
            <span className="text-rose-400">*</span>
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
            {copy.amountHelp}
          </p>
        </div>

        <div>
          <label
            htmlFor="visit-notes"
            className={labelClassName}
          >
            {copy.notes}
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
            placeholder={copy.notesPlaceholder}
            className={inputClassName}
          />
        </div>
      </div>

      {displayedError && (
        <p
          role="alert"
          className="rounded-xl border border-rose-900 bg-rose-950/40 p-3 text-sm text-rose-300"
        >
          {displayedError}
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
          disabled={
            loading ||
            !hasRequiredOptions ||
            (isEditing && !isDirty)
          }
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? copy.savingChanges
              : copy.recordingVisit
            : isEditing
              ? copy.saveChanges
              : copy.recordVisit}
        </button>
      </div>
    </form>
  );
}
