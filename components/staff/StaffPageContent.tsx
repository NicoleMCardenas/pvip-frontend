
"use client";

import { Users, UserRoundCheck, UserRoundX } from "lucide-react";

import { useLanguage } from "@/components/language/LanguageProvider";
import { AddStaff } from "./AddStaff";
import { EditStaffPanel } from "./EditStaffPanel";
import { StaffStatusAction } from "./StaffStatusAction";
import type { StaffMember } from "./StaffForm";

type StaffPageContentProps = {
  staff: StaffMember[];
};

export function StaffPageContent({
  staff,
}: StaffPageContentProps) {
  const { t } = useLanguage();

  const activeCount = staff.filter(
    (member) => member.status === "active"
  ).length;

  const inactiveCount = staff.filter(
    (member) => member.status !== "active"
  ).length;

  const metrics = [
    {
      label: t.staff.totalMembers,
      value: staff.length,
      icon: Users,
      iconClassName: "text-sky-400",
      backgroundClassName: "bg-sky-500/10",
    },
    {
      label: t.staff.activeMembers,
      value: activeCount,
      icon: UserRoundCheck,
      iconClassName: "text-emerald-400",
      backgroundClassName: "bg-emerald-500/10",
    },
    {
      label: t.staff.inactiveMembers,
      value: inactiveCount,
      icon: UserRoundX,
      iconClassName: "text-amber-400",
      backgroundClassName: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
            {t.staff.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.staff.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            {t.staff.subtitle}
          </p>
        </div>

        <div className="shrink-0">
          <AddStaff />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {metric.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                    {metric.value}
                  </p>
                </div>

                <div
                  className={`rounded-xl p-3 ${metric.backgroundClassName}`}
                >
                  <Icon
                    size={21}
                    className={metric.iconClassName}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            {t.staff.directoryTitle}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {t.staff.directoryDescription}
          </p>
        </div>

        {staff.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/70">
              <Users
                size={26}
                className="text-slate-400"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              {t.staff.emptyTitle}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
              {t.staff.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-950/40">
                <tr className="border-b border-slate-800">
                  {[
                    t.staff.memberColumn,
                    t.staff.roleColumn,
                    t.staff.contactColumn,
                    t.staff.statusColumn,
                    t.staff.actionsColumn,
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {staff.map((member) => {
                  const isActive = member.status === "active";

                  return (
                    <tr
                      key={member.id}
                      className="transition hover:bg-slate-800/30"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sm font-semibold text-sky-400">
                            {member.name
                              .trim()
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="font-medium text-white">
                            {member.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-300">
                        {member.role}
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-400">
                        {member.email ||
                          member.phone ||
                          t.staff.notProvided}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={[
                            "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
                            isActive
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : "border-slate-600 bg-slate-800 text-slate-400",
                          ].join(" ")}
                        >
                          {isActive
                            ? t.staff.active
                            : t.staff.inactive}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <EditStaffPanel staffMember={member} />
                          <StaffStatusAction staffMember={member} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
