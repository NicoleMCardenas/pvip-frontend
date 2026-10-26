
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";
import IntelligencePageContent from "@/components/intelligence/IntelligencePageContent";

import type {
  CustomerSegmentsResponse,
  ExperienceTrendsResponse,
} from "@/types";

export default async function IntelligencePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  let segmentsData: CustomerSegmentsResponse;
  let trendsData: ExperienceTrendsResponse;

  try {
    await apiFetch("/auth/me");

    [segmentsData, trendsData] = (await Promise.all([
      apiFetch("/analytics/customer-segments"),
      apiFetch("/analytics/experience-trends"),
    ])) as [
      CustomerSegmentsResponse,
      ExperienceTrendsResponse,
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
    <IntelligencePageContent
      segmentsData={segmentsData}
      trendsData={trendsData}
    />
  );
}
