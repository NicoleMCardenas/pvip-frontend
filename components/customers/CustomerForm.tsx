
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
      setError("Customer name is required.");
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

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : isEditing
              ? "Unable to update customer."
              : "Unable to create customer."
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {isEditing ? "Edit customer" : "Add customer"}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          {isEditing
            ? "Update customer information and relationship status."
            : "Create a customer profile to start tracking visits, feedback, and retention."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="customer-name"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Full name <span className="text-rose-400">*</span>
          </label>

          <input
            id="customer-name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Mariana López"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500"
          />
        </div>

        <div>
          <label
            htmlFor="customer-email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Email address
          </label>

          <input
            id="customer-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="customer@example.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500"
          />
        </div>

        <div>
          <label
            htmlFor="customer-phone"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Phone number
          </label>

          <input
            id="customer-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="e.g. +52 222 123 4567"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500"
          />
        </div>

        {isEditing && (
          <div>
            <label
              htmlFor="customer-status"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Customer status
            </label>

            <select
              id="customer-status"
              value={status}
              onChange={(event) => {
  const nextStatus = event.target.value;

  if (editableStatuses.includes(nextStatus as ClientStatus)) {
    setStatus(nextStatus as ClientStatus);
  }
}}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
            >
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="at_risk">At risk</option>
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
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? isEditing
              ? "Saving changes..."
              : "Creating customer..."
            : isEditing
              ? "Save changes"
              : "Create customer"}
        </button>
      </div>
    </form>
  );
}
