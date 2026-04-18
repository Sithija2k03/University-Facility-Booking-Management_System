const PRIORITY_STYLES = {
  LOW: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  MEDIUM: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  HIGH: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  CRITICAL: "bg-red-500/15 text-red-300 border-red-500/30",
};

function PriorityBadge({ priority = "", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority] ?? ""} ${className}`}
    >
      {priority}
    </span>
  );
}

export default PriorityBadge;
