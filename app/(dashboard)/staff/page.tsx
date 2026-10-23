
import { apiFetch } from "@/lib/api";
import { AddStaff } from "@/components/staff/AddStaff";
import { EditStaffPanel } from "@/components/staff/EditStaffPanel";
import { StaffStatusAction } from "@/components/staff/StaffStatusAction";
import type { StaffMember } from "@/components/staff/StaffForm";

export default async function StaffPage() {
  const staff = (await apiFetch("/staff/")) as StaffMember[];

  const activeCount = staff.filter(
    (member) => member.status === "active"
  ).length;

  const inactiveCount = staff.filter(
    (member) => member.status === "inactive"
  ).length;

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Team management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Staff
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Manage your team, keep employee information
            organized, and maintain visibility over the
            people delivering your customer experience.
          </p>

          <div className="mt-6">
            <AddStaff />
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">
              Total team members
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {staff.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">
              Active members
            </p>
            <p className="mt-2 text-3xl font-semibold text-emerald-400">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">
              Inactive members
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-300">
              {inactiveCount}
            </p>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-lg font-semibold text-white">
              Team directory
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              View your registered team members and their
              current status.
            </p>
          </div>

          {staff.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-white">
                No team members yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                Your team directory is empty. Add your first
                team member to get started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-800 bg-slate-900/70">
                  <tr className="text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-medium">
                      Team member
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Role
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Contact
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {staff.map((member) => (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-white">
                          {member.name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-300">
                        {member.role}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-400">
                        {member.email ||
                          member.phone ||
                          "Not provided"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={[
                            "inline-flex rounded-full border px-3 py-1 text-xs font-medium",
                            member.status === "active"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-slate-700 bg-slate-800 text-slate-300",
                          ].join(" ")}
                        >
                          {member.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <EditStaffPanel staffMember={member} />
                          <StaffStatusAction staffMember={member} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
