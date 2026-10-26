
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";
import RevenueRecoveryPageContent from "@/components/revenue-recovery/RevenueRecoveryPageContent";

import type { Visit } from "@/types/visit";
import type {
  Client,
  RetentionCase,
  RevenueRecoveryAttribution,
  RevenueRecoveryMetricsResponse,
} from "@/types";

export default async function RevenueRecoveryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  let metrics: RevenueRecoveryMetricsResponse;
  let cases: RetentionCase[];
  let visits: Visit[];
  let activeCustomers: Client[];
  let archivedCustomers: Client[];
  let attributions: RevenueRecoveryAttribution[];

  try {
    await apiFetch("/auth/me");

    [metrics, cases, visits, activeCustomers, archivedCustomers, attributions] =
      (await Promise.all([
        apiFetch("/revenue-recovery/metrics"),
        apiFetch("/retention/"),
        apiFetch("/visits/"),
        apiFetch("/clients/"),
        apiFetch("/clients/archived"),
        apiFetch("/revenue-recovery/"),
      ])) as [
        RevenueRecoveryMetricsResponse,
        RetentionCase[],
        Visit[],
        Client[],
        Client[],
        RevenueRecoveryAttribution[],
      ];
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
    <RevenueRecoveryPageContent
      metrics={metrics}
      cases={cases}
      visits={visits}
      activeCustomers={activeCustomers}
      archivedCustomers={archivedCustomers}
      attributions={attributions}
    />
  );
}
