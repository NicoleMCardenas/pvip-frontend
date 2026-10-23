import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { apiFetch } from "@/lib/api";

import type {
  DashboardMetrics,
  Client,
  RecoveryClient,
} from "@/types";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { ClientsTable } from "@/components/dashboard/ClientsTable";
import { RecoveryQueue } from "@/components/dashboard/RecoveryQueue";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    await apiFetch("/auth/me");
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      redirect("/api/auth/clear-session");
    }

    throw error;
  }

  let metrics: DashboardMetrics;
  let clients: Client[];
  let recoveryQueue: RecoveryClient[];

  try {
    [metrics, clients, recoveryQueue] = await Promise.all([
      apiFetch("/analytics/dashboard") as Promise<DashboardMetrics>,
      apiFetch("/clients/") as Promise<Client[]>,
      apiFetch("/analytics/recovery-queue") as Promise<RecoveryClient[]>,
    ]);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "UNAUTHENTICATED"
    ) {
      redirect("/api/auth/clear-session");
    }

    throw error;
  }

  return (
    <main className="min-h-screen px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader />

        <MetricsGrid metrics={metrics} />

        <ClientsTable clients={clients} />

        <div className="mt-4 flex justify-end">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            View all customers
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <RecoveryQueue clients={recoveryQueue} />

        <div className="mt-4 flex justify-end">
          <Link
            href="/retention"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sky-400 transition-colors hover:bg-slate-900 hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Open retention workspace
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  );
}