import { apiFetch } from "@/lib/api";
import type {
  DashboardMetrics,
  Client,
  RecoveryClient
} from "@/types";

export default async function Home() {
  const metrics = await apiFetch("/analytics/dashboard") as DashboardMetrics;
  const clients = await apiFetch("/clients/") as Client[];
  const recoveryQueue = await apiFetch(
    "/analytics/recovery-queue"
  ) as RecoveryClient[];

  return (
    <main className="min-h-screen p-10 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">PVIP Dashboard</h1>

        <p className="text-slate-400 mb-10">
          Client Retention Intelligence Platform
        </p>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-slate-400">Total Clients</p>
            <h2 className="text-3xl font-bold">{metrics.total_clients}</h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-slate-400">At Risk Clients</p>
            <h2 className="text-3xl font-bold">{metrics.at_risk_clients}</h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-slate-400">Average Satisfaction</p>
            <h2 className="text-3xl font-bold">
              {metrics.average_satisfaction}
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl">
            <p className="text-slate-400">NPS Score</p>
            <h2 className="text-3xl font-bold">{metrics.nps_score}</h2>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Clients</h2>

          <div className="bg-slate-900 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="p-4">Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Visits</th>
                  <th className="p-4">Lifetime Value</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-b border-slate-800">
                    <td className="p-4">{client.name}</td>
                    <td className="p-4">{client.status}</td>
                    <td className="p-4">{client.total_visits}</td>
                    <td className="p-4">${client.lifetime_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recovery Queue</h2>

          <div className="grid grid-cols-2 gap-4">
            {recoveryQueue.map((client) => (
              <div key={client.client_id} className="bg-slate-900 p-6 rounded-xl">
                <h3 className="text-xl font-semibold">{client.client_name}</h3>

                <p className="text-slate-400 mt-2">
                  Status: {client.risk_status}
                </p>

                <p className="text-slate-400">
                  NPS: {client.latest_nps}
                </p>

                <p className="text-slate-400">
                  Satisfaction: {client.latest_satisfaction}
                </p>

                <p className="mt-4 text-sm text-slate-300">
                  {client.recommended_action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}