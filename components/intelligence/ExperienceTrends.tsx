import type {
  ExperienceTrend,
  ExperienceTrendsResponse,
} from "@/types";

type Metric = "satisfaction" | "nps";

type MetricConfig = {
  title: string;
  description: string;
  metric: Metric;
  min: number;
  max: number;
  color: string;
};

const metrics: MetricConfig[] = [
  {
    title: "Customer Satisfaction",
    description: "Average satisfaction score · Scale 1–5",
    metric: "satisfaction",
    min: 1,
    max: 5,
    color: "#38bdf8",
  },
  {
    title: "Net Promoter Score",
    description: "Customer recommendation score · Scale −100 to +100",
    metric: "nps",
    min: -100,
    max: 100,
    color: "#a78bfa",
  },
];

function getValue(item: ExperienceTrend, metric: Metric) {
  return metric === "satisfaction"
    ? item.average_satisfaction
    : item.nps_score;
}

function getResponses(item: ExperienceTrend, metric: Metric) {
  return metric === "satisfaction"
    ? item.satisfaction_responses
    : item.nps_responses;
}

function formatMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

function formatValue(value: number, metric: Metric) {
  return metric === "satisfaction"
    ? value.toFixed(2)
    : value.toFixed(1);
}

function MetricChart({
  trends,
  config,
}: {
  trends: ExperienceTrend[];
  config: MetricConfig;
}) {
  const chartWidth = 720;
  const chartHeight = 240;
  const left = 45;
  const right = 15;
  const top = 20;
  const bottom = 40;

  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;

  const points = trends.map((item, index) => {
    const value = getValue(item, config.metric);

    return {
      month: item.month,
      value,
      responses: getResponses(item, config.metric),
      x:
        left +
        (trends.length > 1
          ? (index / (trends.length - 1)) * plotWidth
          : plotWidth / 2),
      y:
        value === null
          ? null
          : top +
            ((config.max - value) / (config.max - config.min)) *
              plotHeight,
    };
  });

  const hasData = points.some((point) => point.value !== null);

  const totalResponses = points.reduce(
    (sum, point) => sum + point.responses,
    0
  );

  const gridValues = Array.from(
    { length: 5 },
    (_, index) =>
      config.max -
      (index / 4) * (config.max - config.min)
  );

  const lineSegments: string[] = [];
  let currentSegment: string[] = [];

  for (const point of points) {
    if (point.y === null) {
      if (currentSegment.length > 0) {
        lineSegments.push(currentSegment.join(" "));
        currentSegment = [];
      }
    } else {
      currentSegment.push(
        `${currentSegment.length === 0 ? "M" : "L"} ${point.x} ${point.y}`
      );
    }
  }

  if (currentSegment.length > 0) {
    lineSegments.push(currentSegment.join(" "));
  }

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {config.title}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {config.description}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums text-white">
            {totalResponses}
          </p>

          <p className="text-xs text-slate-500">
            Valid responses
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-5 text-center">
          <p className="text-sm font-medium text-slate-200">
            No trend data available yet
          </p>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            Complete customer surveys to start tracking this
            metric over time.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label={`${config.title} monthly trend`}
              className="min-w-[560px] w-full"
            >
              {gridValues.map((value) => {
                const y =
                  top +
                  ((config.max - value) /
                    (config.max - config.min)) *
                    plotHeight;

                return (
                  <g key={value}>
                    <line
                      x1={left}
                      y1={y}
                      x2={chartWidth - right}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="3 5"
                    />

                    <text
                      x={left - 10}
                      y={y + 4}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="11"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              {config.metric === "nps" && (
                <line
                  x1={left}
                  x2={chartWidth - right}
                  y1={top + plotHeight / 2}
                  y2={top + plotHeight / 2}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
              )}

              {lineSegments.map((segment, index) => (
                <path
                  key={index}
                  d={segment}
                  fill="none"
                  stroke={config.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {points.map((point) =>
                point.y === null ? null : (
                  <circle
                    key={point.month}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill={config.color}
                    stroke="#0f172a"
                    strokeWidth="2"
                  >
                    <title>
                      {`${formatMonth(point.month)}: ${formatValue(
                        point.value!,
                        config.metric
                      )} · ${point.responses} valid responses`}
                    </title>
                  </circle>
                )
              )}

              {points.map((point, index) =>
                index % 2 === 0 || index === points.length - 1 ? (
                  <text
                    key={point.month}
                    x={point.x}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                  >
                    {formatMonth(point.month)}
                  </text>
                ) : null
              )}
            </svg>
          </div>

          <div className="mt-5 border-t border-slate-800 pt-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
              Monthly breakdown
            </p>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {points.map((point) => (
                <div
                  key={point.month}
                  className="rounded-lg bg-slate-950/60 px-3 py-2"
                >
                  <p className="text-xs text-slate-500">
                    {formatMonth(point.month)}
                  </p>

                  <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                    {point.value === null
                      ? "—"
                      : formatValue(point.value, config.metric)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {point.responses}{" "}
                    {point.responses === 1
                      ? "response"
                      : "responses"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}

export default function ExperienceTrends({
  data,
}: {
  data: ExperienceTrendsResponse;
}) {
  return (
    <section
      aria-labelledby="experience-trends-heading"
      className="mt-12"
    >
      <div className="mb-5">
        <h2
          id="experience-trends-heading"
          className="text-xl font-semibold tracking-tight text-white sm:text-2xl"
        >
          Experience Trends
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Monthly satisfaction and recommendation trends across
          the last {data.period_months} calendar months.
        </p>
      </div>

      <div className="grid gap-5">
        {metrics.map((config) => (
          <MetricChart
            key={config.metric}
            trends={data.trends}
            config={config}
          />
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Reporting timezone: {data.timezone}. Only completed
        surveys with valid scores are included. Months without
        valid responses are shown as unavailable rather than
        zero. Lines are not connected across missing months.
      </p>
    </section>
  );
}