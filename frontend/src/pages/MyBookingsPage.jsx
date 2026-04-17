import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function MyBookingsPage() {
  const { credentials, user, buildBasicAuthHeader } = useAuth();
  const [bookings, setBookings] = useState([]);

  const authHeader = buildBasicAuthHeader(
    credentials.email,
    credentials.password
  );

  const fetchBookings = async () => {
    const res = await axiosClient.get(`/api/bookings/user/${user.id}`, {
      headers: { Authorization: authHeader },
    });
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    await axiosClient.put(
      `/api/bookings/${id}/cancel`,
      {},
      { headers: { Authorization: authHeader } }
    );
    fetchBookings();
  };

  return (
    <PageShell title="My Bookings">
      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b.id}>
            <h3>{b.resourceName}</h3>
            <p>{b.date} | {b.startTime} - {b.endTime}</p>
            <p>Status: {b.status}</p>

            {b.status === "APPROVED" && (
              <Button onClick={() => cancelBooking(b.id)}>
                Cancel
              </Button>
            )}
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

export default MyBookingsPage;