
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
import { DashboardLinks } from "@/components/dashboard/DashboardLinks";

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

        <DashboardLinks destination="customers" />

        <RecoveryQueue clients={recoveryQueue} />

        <DashboardLinks destination="retention" />
      </div>
    </main>
  );
}
