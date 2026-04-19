import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

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

function MyBookingsPage() {
  const { credentials, authMode, user, buildBasicAuthHeader } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const requestConfig = useMemo(() => {
    if (authMode === "basic" && credentials) {
      return {
        headers: {
          Authorization: buildBasicAuthHeader(
            credentials.email,
            credentials.password
          ),
        },
      };
    }

    return {};
  }, [authMode, credentials, buildBasicAuthHeader]);

  const fetchBookings = async () => {
    try {
      const response = await axiosClient.get(
        `/api/bookings/user/${user.id}`,
        requestConfig
      );
      setBookings(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings");
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, requestConfig]);

  const handleCancel = async (id) => {
    const reason = window.prompt("Enter cancellation reason (optional):") || "";
    try {
      await axiosClient.patch(
        `/api/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}`,
        null,
        requestConfig
      );
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <PageShell
      title="My Bookings"
      subtitle="Track your booking requests, approvals, and cancellations."
    >
      {error ? (
        <Card>
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">No bookings found.</p>
        </Card>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
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

                  {(booking.status === "PENDING" || booking.status === "APPROVED") && (
                    <Button
                      variant="danger"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default MyBookingsPage;