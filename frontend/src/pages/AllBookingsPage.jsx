import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SelectInput from "../components/ui/SelectInput";

function StatusBadge({ status }) {
  const styles = {
    PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    APPROVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    REJECTED: "border-red-500/30 bg-red-500/10 text-red-300",
    CANCELLED: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status] || "border-slate-700 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

function DecisionModal({ open, mode, booking, reason, setReason, onClose, onConfirm, submitting }) {
  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-slate-900 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h3 className="text-xl font-semibold text-slate-100">
          {mode === "approve" ? "Approve Booking" : "Reject Booking"}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          {booking.resourceName} · {booking.bookingDate} · {booking.startTime} - {booking.endTime}
        </p>

        <div className="mt-5 space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Reason / Note
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
            placeholder="Enter approval or rejection note"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant={mode === "approve" ? "primary" : "danger"} onClick={onConfirm} disabled={submitting}>
            {submitting
              ? "Submitting..."
              : mode === "approve"
              ? "Approve"
              : "Reject"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AllBookingsPage() {
  const { credentials, buildBasicAuthHeader } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [resourceFilter, setResourceFilter] = useState("");
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [decisionMode, setDecisionMode] = useState("approve");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reason, setReason] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);

  const authHeader = buildBasicAuthHeader(
    credentials.email,
    credentials.password
  );

  const fetchBookings = async () => {
    try {
      const response = await axiosClient.get("/api/bookings", {
        headers: {
          Authorization: authHeader,
        },
      });
      setBookings(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = !statusFilter || booking.status === statusFilter;
      const matchesResource =
        !resourceFilter ||
        booking.resourceName.toLowerCase().includes(resourceFilter.toLowerCase());

      return matchesStatus && matchesResource;
    });
  }, [bookings, statusFilter, resourceFilter]);

  const openDecisionModal = (booking, mode) => {
    setSelectedBooking(booking);
    setDecisionMode(mode);
    setReason("");
    setModalOpen(true);
  };

  const closeDecisionModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
    setReason("");
  };

  const handleDecision = async () => {
    if (!selectedBooking) return;

    try {
      setSubmittingDecision(true);

      await axiosClient.patch(
        `/api/bookings/${selectedBooking.id}/${decisionMode}`,
        { reason: reason || `${decisionMode}d by admin` },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      closeDecisionModal();
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update booking");
    } finally {
      setSubmittingDecision(false);
    }
  };

  return (
    <PageShell
      title="Manage Bookings"
      subtitle="Review, filter, approve, and reject booking requests."
    >
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectInput
            label="Filter by Status"
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "PENDING", label: "PENDING" },
              { value: "APPROVED", label: "APPROVED" },
              { value: "REJECTED", label: "REJECTED" },
              { value: "CANCELLED", label: "CANCELLED" },
            ]}
          />

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-300">
              Search by Resource
            </label>
            <input
              type="text"
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              placeholder="Search by resource name"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
            />
          </div>
        </div>
      </Card>

      {error ? (
        <Card>
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">No bookings found.</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {booking.resourceName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {booking.resourceLocation}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-500">User:</span>{" "}
                      {booking.userName} ({booking.userEmail})
                    </p>
                    <p>
                      <span className="text-slate-500">Date:</span>{" "}
                      {booking.bookingDate}
                    </p>
                    <p>
                      <span className="text-slate-500">Time:</span>{" "}
                      {booking.startTime} - {booking.endTime}
                    </p>
                    <p>
                      <span className="text-slate-500">Purpose:</span>{" "}
                      {booking.purpose}
                    </p>
                    <p>
                      <span className="text-slate-500">Attendees:</span>{" "}
                      {booking.expectedAttendees ?? "-"}
                    </p>
                    {booking.adminReason && (
                      <p>
                        <span className="text-slate-500">Admin Note:</span>{" "}
                        {booking.adminReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <StatusBadge status={booking.status} />

                  {booking.status === "PENDING" && (
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        onClick={() => openDecisionModal(booking, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => openDecisionModal(booking, "reject")}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <DecisionModal
        open={modalOpen}
        mode={decisionMode}
        booking={selectedBooking}
        reason={reason}
        setReason={setReason}
        onClose={closeDecisionModal}
        onConfirm={handleDecision}
        submitting={submittingDecision}
      />
    </PageShell>
  );
}

export default AllBookingsPage;