const STATUS_STYLES = {
  OPEN: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  IN_PROGRESS: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  RESOLVED: "bg-green-500/15 text-green-300 border-green-500/30",
  CLOSED: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/30",
};

function StatusBadge({ status = "", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? ""} ${className}`}
    >
      {String(status).replace("_", " ")}
    </span>
  );
}

export default StatusBadge;
