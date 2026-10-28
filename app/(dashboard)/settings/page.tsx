
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";
import BusinessSettingsContent from "@/components/settings/BusinessSettingsContent";

import type {
  Business,
  AuthenticatedUser,
} from "@/types/business";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  let user: AuthenticatedUser;
  let business: Business;

  try {
    user = (await apiFetch(
      "/auth/me"
    )) as AuthenticatedUser;

    business = (await apiFetch(
      "/business/me"
    )) as Business;
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
    <BusinessSettingsContent
      business={business}
      user={user}
    />
  );
}
