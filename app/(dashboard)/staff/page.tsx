
import { apiFetch } from "@/lib/api";
import { StaffPageContent } from "@/components/staff/StaffPageContent";
import type { StaffMember } from "@/components/staff/StaffForm";

export default async function StaffPage() {
  const staff = (await apiFetch("/staff/")) as StaffMember[];

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <StaffPageContent staff={staff} />
      </div>
    </main>
  );
}
