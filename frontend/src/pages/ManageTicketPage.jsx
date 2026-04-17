import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { assignTechnician, getTicketById, updateTicketStatus } from "../api/ticketApi";
import { getUsersByRole } from "../api/userApi";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SelectInput from "../components/ui/SelectInput";

const NEXT_STATUS_BY_CURRENT = {
  OPEN: ["IN_PROGRESS", "REJECTED"],
  IN_PROGRESS: ["RESOLVED", "REJECTED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  REJECTED: [],
};

function ManageTicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, credentials, buildBasicAuthHeader } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [technicianId, setTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [technicianSearch, setTechnicianSearch] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const [nextStatus, setNextStatus] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

  const authHeader = useMemo(() => {
    if (!credentials?.email || !credentials?.password) return null;
    return buildBasicAuthHeader(credentials.email, credentials.password);
  }, [buildBasicAuthHeader, credentials]);

  const canManage = user?.role === "ADMIN" || user?.role === "TECHNICIAN";

  useEffect(() => {
    const fetchTicket = async () => {
      if (!authHeader) return;

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const [ticketRes, techRes] = await Promise.all([
          getTicketById(id, authHeader),
          getUsersByRole("TECHNICIAN", authHeader),
        ]);

        setTicket(ticketRes.data);
        setTechnicians(techRes.data || []);
        setTechnicianId(ticketRes.data?.assignedTechnicianId ? String(ticketRes.data.assignedTechnicianId) : "");
        setResolutionNotes(ticketRes.data?.resolutionNotes || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, authHeader]);

  const statusOptions = useMemo(() => {
    if (!ticket?.status) {
      return [{ value: "", label: "Select next status" }];
    }

    const nextStatuses = NEXT_STATUS_BY_CURRENT[ticket.status] || [];
    return [
      { value: "", label: "Select next status" },
      ...nextStatuses.map((status) => ({
        value: status,
        label: status.replace("_", " "),
      })),
    ];
  }, [ticket]);

  const filteredTechnicians = useMemo(() => {
    if (!technicianSearch.trim()) return technicians;
    
    const q = technicianSearch.toLowerCase();
    return technicians.filter((tech) => 
      tech.name.toLowerCase().includes(q) || 
      tech.email.toLowerCase().includes(q)
    );
  }, [technicians, technicianSearch]);

  const technicianOptions = useMemo(() => {
    return [
      { value: "", label: "Select technician" },
      ...filteredTechnicians.map((tech) => ({
        value: String(tech.id),
        label: `${tech.name} (${tech.email})`,
      })),
    ];
  }, [filteredTechnicians]);

  const handleAssignTechnician = async () => {
    if (!technicianId.trim()) {
      setError("Technician ID is required.");
      return;
    }

    const parsedId = Number(technicianId);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setError("Technician ID must be a valid positive number.");
      return;
    }

    setAssignLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await assignTechnician(id, parsedId, authHeader);
      setTicket(res.data);
      setTechnicianId(res.data?.assignedTechnicianId ? String(res.data.assignedTechnicianId) : "");
      setSuccess("Technician assignment updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to assign technician.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!nextStatus) {
      setError("Please select a next status.");
      return;
    }

    setStatusLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        status: nextStatus,
        resolutionNotes: resolutionNotes.trim() || null,
      };

      const res = await updateTicketStatus(id, payload, authHeader);
      setTicket(res.data);
      setNextStatus("");
      setResolutionNotes(res.data?.resolutionNotes || resolutionNotes);
      setSuccess("Ticket status updated successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update ticket status.");
    } finally {
      setStatusLoading(false);
    }
  };

  if (!canManage) {
    return (
      <PageShell title="Manage Ticket" subtitle="Admin or technician access required.">
        <Card>
          <p className="text-sm text-red-300">You are not allowed to manage tickets.</p>
          <Button className="mt-4" variant="secondary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell title="Manage Ticket" subtitle="Loading ticket details...">
        <p className="text-sm text-slate-400 animate-pulse">Loading...</p>
      </PageShell>
    );
  }

  if (error && !ticket) {
    return (
      <PageShell title="Manage Ticket" subtitle="Unable to load this ticket.">
        <Card>
          <p className="text-sm text-red-400">{error}</p>
          <Button className="mt-4" variant="secondary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card>
      </PageShell>
    );
  }

  if (!ticket) return null;

  return (
    <PageShell
      title={`Manage Ticket #${ticket.id}`}
      subtitle={`${ticket.category} - ${ticket.locationText}`}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/tickets/${id}`)}>
            View Details
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      }
    >
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {success}
        </p>
      )}

      <Card>
        <h2 className="text-base font-semibold text-slate-100">Current Ticket Info</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <p>
            <span className="text-slate-500">Status:</span> {ticket.status}
          </p>
          <p>
            <span className="text-slate-500">Priority:</span> {ticket.priority}
          </p>
          <p>
            <span className="text-slate-500">Reporter:</span> {ticket.reporterName}
          </p>
          <p>
            <span className="text-slate-500">Assigned Technician:</span>{" "}
            {ticket.assignedTechnicianName || "Not assigned"}
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-slate-100">Assign Technician</h2>
        <p className="mt-1 text-xs text-slate-500">
          Search for and select a technician to assign or reassign this ticket.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Search Technician</label>
            <input
              type="text"
              value={technicianSearch}
              onChange={(e) => setTechnicianSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-orange-400"
            />
            {filteredTechnicians.length === 0 && technicianSearch && (
              <p className="mt-2 text-xs text-slate-500">No technicians found matching your search.</p>
            )}
            {filteredTechnicians.length > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <SelectInput
              label="Select Technician"
              name="technicianId"
              value={technicianId}
              onChange={(e) => setTechnicianId(e.target.value)}
              options={technicianOptions}
            />
            <Button onClick={handleAssignTechnician} disabled={assignLoading || user?.role !== "ADMIN"}>
              {assignLoading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>

        {user?.role !== "ADMIN" && (
          <p className="mt-3 text-xs text-slate-500">Only admins can assign technicians.</p>
        )}
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-slate-100">Update Status</h2>
        <p className="mt-1 text-xs text-slate-500">
          Allowed transitions follow backend rules based on the current status.
        </p>

        <div className="mt-4 grid gap-4">
          <SelectInput
            label="Next Status"
            name="nextStatus"
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value)}
            options={statusOptions}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Resolution Notes (optional)</label>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={4}
              placeholder="Add notes when resolving or closing the ticket..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 resize-none"
            />
          </div>

          <div>
            <Button onClick={handleUpdateStatus} disabled={statusLoading || statusOptions.length <= 1}>
              {statusLoading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

export default ManageTicketPage;
