import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { getAllTickets, getTicketsByStatus } from "../api/ticketApi";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const STATUS_STYLES = {
  OPEN: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  IN_PROGRESS: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  RESOLVED: "bg-green-500/15 text-green-300 border-green-500/30",
  CLOSED: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/30",
};

const PRIORITY_STYLES = {
  LOW: "text-slate-400",
  MEDIUM: "text-yellow-400",
  HIGH: "text-orange-400",
  CRITICAL: "text-red-400 font-semibold",
};

const STATUS_OPTIONS = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];

function AllTicketsPage() {
  const { user, credentials, buildBasicAuthHeader } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN";
  const isTechnician = user?.role === "TECHNICIAN";

  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeader = useMemo(() => {
    if (!credentials?.email || !credentials?.password) return null;
    return buildBasicAuthHeader(credentials.email, credentials.password);
  }, [buildBasicAuthHeader, credentials]);

  const fetchTickets = async (status = "ALL") => {
    if (!authHeader) return;

    setLoading(true);
    setError("");

    try {
      const response =
        status === "ALL"
          ? await getAllTickets(authHeader)
          : await getTicketsByStatus(status, authHeader);

      setTickets(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(statusFilter);
  }, [authHeader, statusFilter]);

  const visibleTickets = useMemo(() => {
    if (isAdmin) return tickets;
    if (isTechnician) {
      return tickets.filter((t) => t.assignedTechnicianId === user?.id);
    }
    return [];
  }, [tickets, isAdmin, isTechnician, user?.id]);

  const filteredTickets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return visibleTickets;

    return visibleTickets.filter((t) => {
      const values = [
        String(t.id ?? ""),
        t.category ?? "",
        t.locationText ?? "",
        t.reporterName ?? "",
        t.reporterEmail ?? "",
        t.assignedTechnicianName ?? "",
        t.status ?? "",
        t.priority ?? "",
      ];

      return values.some((v) => v.toLowerCase().includes(q));
    });
  }, [search, visibleTickets]);

  if (!isAdmin && !isTechnician) {
    return (
      <PageShell title="All Tickets" subtitle="Admin access required">
        <Card>
          <p className="text-sm text-red-300">Only admins and technicians can access this page.</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={isAdmin ? "All Tickets" : "Assigned Tickets"}
      subtitle={
        isAdmin
          ? "Monitor and filter all submitted incident tickets."
          : "View and filter tickets assigned to you."
      }
      actions={
        <Button variant="secondary" onClick={() => fetchTickets(statusFilter)}>
          Refresh
        </Button>
      }
    >
      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Search
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by id, category, location, reporter, technician..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-orange-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-slate-500">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-orange-400"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "ALL" ? "All Statuses" : opt.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {loading && <p className="text-sm text-slate-400 animate-pulse">Loading tickets...</p>}

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && filteredTickets.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-sm text-slate-400">No tickets found for the selected filters.</p>
        </Card>
      )}

      <div className="space-y-4">
        {filteredTickets.map((ticket, index) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
          >
            <Card>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-500">#{ticket.id}</span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[ticket.status] ?? ""}`}
                    >
                      {ticket.status?.replace("_", " ")}
                    </span>
                    <span className={`text-xs ${PRIORITY_STYLES[ticket.priority] ?? "text-slate-400"}`}>
                      {ticket.priority}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-100">{ticket.category}</p>
                  <p className="text-xs text-slate-400">{ticket.description}</p>
                  <p className="text-xs text-slate-500">Location: {ticket.locationText}</p>
                  <p className="text-xs text-slate-500">
                    Reporter: {ticket.reporterName} ({ticket.reporterEmail})
                  </p>
                  <p className="text-xs text-slate-500">
                    Technician: {ticket.assignedTechnicianName || "Not assigned"}
                  </p>
                </div>

                <div className="flex flex-row gap-2 lg:flex-col lg:items-end">
                  <Button variant="secondary" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    View Details
                  </Button>
                  <Button onClick={() => navigate(`/tickets/${ticket.id}/manage`)}>
                    Manage
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

export default AllTicketsPage;
