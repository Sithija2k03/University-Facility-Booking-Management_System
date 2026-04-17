import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SelectInput from "../components/ui/SelectInput";

function CreateBookingPage() {
  const { credentials, user, buildBasicAuthHeader } = useAuth();

  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    resourceId: "",
    date: null,
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);

  const authHeader = buildBasicAuthHeader(
    credentials.email,
    credentials.password
  );

  // ⏱ Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 8; h <= 18; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 📦 Load resources
  useEffect(() => {
    const fetchResources = async () => {
      const res = await axiosClient.get("/api/resources", {
        headers: { Authorization: authHeader },
      });
      setResources(res.data);
    };

    fetchResources();
  }, []);

  // 📦 Load bookings for selected resource
  useEffect(() => {
    if (!form.resourceId) return;

    const fetchBookings = async () => {
      const res = await axiosClient.get(
        `/api/bookings/resource/${form.resourceId}`,
        { headers: { Authorization: authHeader } }
      );
      setBookings(res.data);
    };

    fetchBookings();
  }, [form.resourceId]);

  // 🚫 Conflict detection
  useEffect(() => {
    if (!form.date || !form.startTime || !form.endTime) return;

    const selectedDate = form.date.toISOString().split("T")[0];

    const hasConflict = bookings.some((b) => {
      if (b.date !== selectedDate) return false;

      return (
        form.startTime < b.endTime &&
        form.endTime > b.startTime
      );
    });

    setConflict(hasConflict);
  }, [form, bookings]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (conflict) {
      setError("Time slot conflict detected");
      return;
    }

    try {
      await axiosClient.post(
        "/api/bookings",
        {
          resourceId: Number(form.resourceId),
          userId: user.id,
          date: form.date.toISOString().split("T")[0],
          startTime: form.startTime,
          endTime: form.endTime,
          purpose: form.purpose,
        },
        { headers: { Authorization: authHeader } }
      );

      alert("Booking created!");
    } catch (err) {
      setError(err?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <PageShell title="Create Booking">
      <Card className="max-w-3xl">
        <form className="grid gap-5" onSubmit={handleSubmit}>
          
          {/* Resource */}
          <SelectInput
            label="Resource"
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

          {/* Date Picker */}
          <div>
            <label className="text-sm text-slate-300">Date</label>
            <DatePicker
              selected={form.date}
              onChange={(date) =>
                setForm({ ...form, date })
              }
              className="input w-full"
              minDate={new Date()}
            />
          </div>

          {/* Time selection */}
          <SelectInput
            label="Start Time"
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
            options={[
              { value: "", label: "Select time" },
              ...timeSlots.map((t) => ({ value: t, label: t })),
            ]}
          />

          <SelectInput
            label="End Time"
            value={form.endTime}
            onChange={(e) =>
              setForm({ ...form, endTime: e.target.value })
            }
            options={[
              { value: "", label: "Select time" },
              ...timeSlots.map((t) => ({ value: t, label: t })),
            ]}
          />

          {/* Conflict UI */}
          {conflict && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-300">
              ⚠ Time slot already booked
            </div>
          )}

          {/* Purpose */}
          <input
            className="input"
            placeholder="Purpose"
            value={form.purpose}
            onChange={(e) =>
              setForm({ ...form, purpose: e.target.value })
            }
          />

          {error && <p className="text-red-400">{error}</p>}

          <Button disabled={conflict}>
            Create Booking
          </Button>
        </form>
      </Card>
    </PageShell>
  );
}

export default CreateBookingPage;