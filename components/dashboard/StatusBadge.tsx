
type StatusBadgeProps = {
  status: string;
};

function getStatusConfig(status: string) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        className:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      };

    case "at_risk":
      return {
        label: "At Risk",
        className:
          "bg-red-500/10 text-red-400 border border-red-500/20",
      };

    case "new":
      return {
        label: "New",
        className:
          "bg-sky-500/10 text-sky-400 border border-sky-500/20",
      };

    case "archived":
      return {
        label: "Archived",
        className:
          "bg-slate-700/50 text-slate-300 border border-slate-600/50",
      };

    default:
      return {
        label: "Unknown",
        className:
          "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      };
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
