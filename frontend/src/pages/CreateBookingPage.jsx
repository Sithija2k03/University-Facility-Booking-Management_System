import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
import SelectInput from "../components/ui/SelectInput";

function CreateBookingPage() {
  const { credentials, user, buildBasicAuthHeader } = useAuth();

  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authHeader = buildBasicAuthHeader(
    credentials.email,
    credentials.password
  );

  useEffect(() => {
    const fetchResources = async () => {
      const res = await axiosClient.get("/api/resources", {
        headers: { Authorization: authHeader },
      });
      setResources(res.data);
    };

    fetchResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axiosClient.post(
        "/api/bookings",
        {
          resourceId: Number(form.resourceId),
          userId: user.id,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          purpose: form.purpose,
          attendees: form.attendees ? Number(form.attendees) : null,
        },
        {
          headers: { Authorization: authHeader },
        }
      );

      setSuccess("Booking request submitted!");
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <PageShell title="Create Booking" subtitle="Reserve a resource">
      <Card className="max-w-3xl">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <SelectInput
            label="Resource"
            name="resourceId"
            value={form.resourceId}
            onChange={(e) =>
              setForm({ ...form, resourceId: e.target.value })
            }
            options={[
              { value: "", label: "Select resource" },
              ...resources.map((r) => ({
                value: r.id,
                label: r.name,
              })),
            ]}
          />

          <TextInput
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <TextInput
            label="Start Time"
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />

          <TextInput
            label="End Time"
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />

          <TextInput
            label="Purpose"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />

          <TextInput
            label="Attendees"
            type="number"
            value={form.attendees}
            onChange={(e) => setForm({ ...form, attendees: e.target.value })}
          />

          {error && (
            <div className="md:col-span-2 text-red-400">{error}</div>
          )}
          {success && (
            <div className="md:col-span-2 text-green-400">{success}</div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit">Create Booking</Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}

export default CreateBookingPage;