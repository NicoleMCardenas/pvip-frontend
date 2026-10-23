
import LogoutButton from "@/components/auth/LogoutButton";

export function DashboardHeader() {
  return (
    <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-white">
          KAIRO Dashboard
        </h1>

        <p className="text-slate-400">
          Client Retention Intelligence Platform
        </p>
      </div>

      <LogoutButton />
    </header>
  );
}
