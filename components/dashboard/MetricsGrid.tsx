import type { DashboardMetrics } from "@/types";

type MetricsGridProps = {
  metrics: DashboardMetrics;
};

type MetricCardProps = {
  label: string;
  value: string | number;
  description: string;
  valueColor?: string;
  suffix?: string;
};

function MetricCard({
  label,
  value,
  description,
  valueColor = "text-white",
  suffix,
}: MetricCardProps) {
  return (
    <article className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 lg:p-6">
      <div>
        <p className="text-xs font-medium leading-5 text-slate-400 sm:text-sm">
          {label}
        </p>

        <p
          className={`mt-3 text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl ${valueColor}`}
        >
          {value}

          {suffix && value !== "—" && (
            <span className="ml-1 text-sm font-normal text-slate-500">
              {suffix}
            </span>
          )}
        </p>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </article>
  );
}

function formatSatisfaction(value: number | null | undefined) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 1 ||
    value > 5
  ) {
    return "—";
  }

  return value.toFixed(1);
}

function formatNps(value: number | null | undefined) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < -100 ||
    value > 100
  ) {
    return "—";
  }

  const rounded = Math.round(value);

  return rounded > 0 ? `+${rounded}` : String(rounded);
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const satisfaction = formatSatisfaction(
    metrics.average_satisfaction
  );

  const nps = formatNps(metrics.nps_score);

  return (
    <section aria-label="Customer intelligence metrics">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricCard
          label="Total Clients"
          value={metrics.total_clients}
          description="Customers in your portfolio, excluding archived records."
        />

        <MetricCard
          label="At Risk Clients"
          value={metrics.at_risk_clients}
          description="Customers currently classified as at risk."
          valueColor={
            metrics.at_risk_clients > 0
              ? "text-amber-400"
              : "text-white"
          }
        />

        <MetricCard
          label="Average Satisfaction"
          value={satisfaction}
          suffix="/ 5"
          description="Average rating across completed surveys with valid satisfaction scores."
        />

        <MetricCard
          label="NPS Score"
          value={nps}
          description="Net Promoter Score across completed surveys with valid NPS responses."
          valueColor={
            typeof metrics.nps_score === "number" &&
            metrics.nps_score < 0
              ? "text-rose-400"
              : "text-white"
          }
        />
      </div>
    </section>
  );
}