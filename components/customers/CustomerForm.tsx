
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language/LanguageProvider";
import type { Client, ClientStatus } from "@/types";

const editableStatuses: ClientStatus[] = [
  "new",
  "active",
  "at_risk",
];

type CustomerFormProps = {
  customer?: Client;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function CustomerForm({
  customer,
  onCancel,
  onSuccess,
}: CustomerFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const isEditing = Boolean(customer);

  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [status, setStatus] = useState<ClientStatus>(
    customer?.status &&
      editableStatuses.includes(customer.status as ClientStatus)
      ? (customer.status as ClientStatus)
      : "new"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError(t.customers.nameRequired);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const endpoint = isEditing
        ? `/api/customers/${customer?.id}`
        : "/api/customers";

      const response = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          ...(isEditing ? { status } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditing
            ? t.customers.updateError
            : t.customers.createError
        );
      }

      onSuccess?.();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isEditing
            ? t.customers.updateError
            : t.customers.createError
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {isEditing
            ? t.customers.editCustomer
            : t.customers.addCustomer}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? t.customers.formEditDescription
            : t.customers.formCreateDescription}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="customer-name"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {t.customers.fullName}{" "}
            <span className="text-rose-400">*</span>
          </label>

          <input
            id="customer-name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t.customers.namePlaceholder}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500"
          />
        </div>

        <div>
          <label
            htmlFor="customer-email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {t.customers.customerEmail}
          </label>

          <input
            id="customer-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.customers.emailPlaceholder}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500"
          />
        </div>

        <div>
          <label
            htmlFor="customer-phone"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            {t.customers.customerPhone}
          </label>

          <input
            id="customer-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={t.customers.phonePlaceholder}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500"
          />
        </div>

        {isEditing && (
          <div>
            <label
              htmlFor="customer-status"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              {t.customers.customerStatus}
            </label>

            <select
              id="customer-status"
              value={status}
              onChange={(event) => {
                const nextStatus = event.target.value;

                if (
                  editableStatuses.includes(
                    nextStatus as ClientStatus
                  )
                ) {
                  setStatus(nextStatus as ClientStatus);
                }
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
            >
              <option value="new">{t.customers.new}</option>
              <option value="active">{t.customers.active}</option>
              <option value="at_risk">{t.customers.atRisk}</option>
            </select>
          </div>
        )}
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
            {t.common.cancel}
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? t.customers.savingChanges
              : t.customers.creatingCustomer
            : isEditing
              ? t.customers.saveChanges
              : t.customers.createCustomer}
        </button>
      </div>
    </form>
  );
}
