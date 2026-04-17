import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { getMyTickets } from "../api/ticketApi";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const STATUS_STYLES = {
  OPEN:        "bg-blue-500/15 text-blue-300 border-blue-500/30",
  IN_PROGRESS: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  RESOLVED:    "bg-green-500/15 text-green-300 border-green-500/30",
  CLOSED:      "bg-slate-500/15 text-slate-400 border-slate-500/30",
  REJECTED:    "bg-red-500/15 text-red-300 border-red-500/30",
};

const PRIORITY_STYLES = {
  LOW:      "text-slate-400",
  MEDIUM:   "text-yellow-400",
  HIGH:     "text-orange-400",
  CRITICAL: "text-red-400 font-semibold",
};

function MyTicketsPage() {
  const { user, credentials, buildBasicAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const authHeader = buildBasicAuthHeader(credentials.email, credentials.password);
        const res = await getMyTickets(user.id, authHeader);
        setTickets(res.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <PageShell
      title="My Tickets"
      subtitle="Track all incident reports you have submitted."
      actions={
        <Button onClick={() => navigate("/tickets/create")}>
          + Report Incident
        </Button>
      }
    >
      {loading && (
        <p className="text-sm text-slate-400 animate-pulse">Loading tickets…</p>
      )}

      {error && (
        <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && tickets.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-slate-400 text-sm">You have not submitted any tickets yet.</p>
          <Button className="mt-4" onClick={() => navigate("/tickets/create")}>
            Report an Incident
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {tickets.map((ticket, i) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
          >
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                {/* LEFT — main info */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500">#{ticket.id}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[ticket.status] ?? ""}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                    <span className={`text-xs font-medium ${PRIORITY_STYLES[ticket.priority] ?? ""}`}>
                      {ticket.priority}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-100">{ticket.category}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">{ticket.description}</p>
                  <p className="text-xs text-slate-500">📍 {ticket.locationText}</p>

                  {ticket.assignedTechnicianName && (
                    <p className="text-xs text-slate-400">
                      🔧 Assigned to:{" "}
                      <span className="text-orange-300">{ticket.assignedTechnicianName}</span>
                    </p>
                  )}
                </div>

                {/* RIGHT — date + action */}
                <div className="flex flex-col items-end gap-3">
                  <p className="text-xs text-slate-500">
                    {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

export default MyTicketsPage;
