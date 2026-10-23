
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

const validStatuses = ["new", "active", "at_risk"];

export function CustomerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const status = validStatuses.includes(currentStatus)
    ? currentStatus
    : "all";

  const hasActiveFilters =
    currentSearch.trim().length > 0 || status !== "all";

  function navigateWithParams(params: URLSearchParams) {
    const query = params.toString();

    router.push(query ? `/customers?${query}` : "/customers");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const value = search.trim();

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    navigateWithParams(params);
  }

  function handleStatusChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("status");
    } else if (validStatuses.includes(value)) {
      params.set("status", value);
    }

    navigateWithParams(params);
  }

  function handleClearFilters() {
    setSearch("");
    router.push("/customers");
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          onSubmit={handleSearch}
          role="search"
          className="flex min-w-0 flex-1 gap-2"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers by name..."
            aria-label="Search customers"
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20"
          />

          <button
            type="submit"
            className="min-h-11 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(event) =>
            handleStatusChange(event.target.value)
          }
          aria-label="Filter customers by status"
          className="min-h-11 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 sm:min-w-44"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="active">Active</option>
          <option value="at_risk">At risk</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="min-h-11 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
