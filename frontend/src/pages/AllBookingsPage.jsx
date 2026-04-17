import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function AllBookingsPage() {
  const { credentials, buildBasicAuthHeader } = useAuth();
  const [bookings, setBookings] = useState([]);

  const authHeader = buildBasicAuthHeader(
    credentials.email,
    credentials.password
  );

  const fetchBookings = async () => {
    const res = await axiosClient.get("/api/bookings", {
      headers: { Authorization: authHeader },
    });
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, action) => {
    await axiosClient.put(
      `/api/bookings/${id}/${action}`,
      {},
      { headers: { Authorization: authHeader } }
    );
    fetchBookings();
  };

  return (
    <PageShell title="All Bookings">
      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b.id}>
            <h3>{b.resourceName}</h3>
            <p>User: {b.userName}</p>
            <p>{b.date} | {b.startTime} - {b.endTime}</p>
            <p>Status: {b.status}</p>

            {b.status === "PENDING" && (
              <div className="flex gap-3">
                <Button onClick={() => updateStatus(b.id, "approve")}>
                  Approve
                </Button>
                <Button onClick={() => updateStatus(b.id, "reject")}>
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

export default AllBookingsPage;