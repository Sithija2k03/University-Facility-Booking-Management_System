import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { getMyTickets } from "../api/ticketApi";
import { getAuthConfig } from "../api/authHelper";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import PriorityBadge from "../components/ui/PriorityBadge";

const formatTicketAge = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

function MyTicketsPage() {
  const { credentials, buildBasicAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const config = getAuthConfig(credentials, buildBasicAuthHeader);
        const res = await getMyTickets(config);
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
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500">#{ticket.id}</span>
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="text-sm font-medium text-slate-100">{ticket.category}</p>
                  <p className="text-xs text-slate-400 line-clamp-2">{ticket.description}</p>
                  <p className="text-xs text-slate-500">{ticket.locationText}</p>
                  {ticket.assignedTechnicianName && (
                    <p className="text-xs text-slate-400">
                      Assigned to:{" "}
                      <span className="text-orange-300">{ticket.assignedTechnicianName}</span>
                    </p>
                  )}
                  {ticket.resolutionNotes && ticket.resolutionNotes.trim() && (
                    <p className="text-xs text-slate-400">
                      Resolution: {ticket.resolutionNotes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Created: {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Age: {formatTicketAge(ticket.createdAt)}
                    </p>
                  </div>
                  <Button variant="secondary" onClick={() => navigate(`/tickets/${ticket.id}`)}>
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