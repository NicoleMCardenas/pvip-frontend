
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api";
import { StaffPageContent } from "@/components/staff/StaffPageContent";

import type { StaffMember } from "@/components/staff/StaffForm";
import type { AuthenticatedUser } from "@/types/business";

export default async function StaffPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (!token) {
    redirect("/login");
  }

  let user: AuthenticatedUser;
  let staff: StaffMember[];

  try {
    user = (await apiFetch(
      "/auth/me"
    )) as AuthenticatedUser;

    staff = (await apiFetch(
      "/staff/"
    )) as StaffMember[];
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
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <StaffPageContent
          staff={staff}
          isOwner={user.role === "owner"}
        />
      </div>
    </main>
  );
}
