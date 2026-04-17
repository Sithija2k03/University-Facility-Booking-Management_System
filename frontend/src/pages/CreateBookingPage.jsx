import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [form, setForm] = useState({
    resourceId: "",
    bookingDate: null,
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [conflict, setConflict] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const authHeader = useMemo(
    () =>
      buildBasicAuthHeader(credentials.email, credentials.password),
    [credentials, buildBasicAuthHeader]
  );

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour !== 18) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const normalizeTime = (time) => {
    if (!time) return "";
    return time.length === 5 ? `${time}:00` : time;
  };

  const isSlotBooked = (slot) => {
    const normalizedSlot = normalizeTime(slot);

    return bookings.some((booking) => {
      const bookingStart = normalizeTime(booking.startTime);
      const bookingEnd = normalizeTime(booking.endTime);

      return normalizedSlot >= bookingStart && normalizedSlot < bookingEnd;
    });
  };

  const getEndTimeOptions = () => {
    if (!form.startTime) {
      return timeSlots.map((slot) => ({
        value: slot,
        label: slot,
        disabled: false,
        booked: isSlotBooked(slot),
      }));
    }

    return timeSlots
      .filter((slot) => slot > form.startTime)
      .map((slot) => ({
        value: slot,
        label: slot,
        disabled: false,
        booked: isSlotBooked(slot),
      }));
  };

  const getStartTimeOptions = () => {
    return timeSlots.map((slot) => ({
      value: slot,
      label: slot,
      disabled: isSlotBooked(slot),
      booked: isSlotBooked(slot),
    }));
  };

  const fetchResources = async () => {
    try {
      const response = await axiosClient.get("/api/resources", {
        headers: {
          Authorization: authHeader,
        },
      });
      setResources(response.data);
    } catch (err) {
      setError("Failed to load resources");
    }
  };

  const fetchBookingsForResourceAndDate = async () => {
    if (!form.resourceId || !form.bookingDate) {
      setBookings([]);
      return;
    }

    try {
      setLoadingBookings(true);
      const formattedDate = formatDate(form.bookingDate);

      const response = await axiosClient.get(
        `/api/bookings/resource/${form.resourceId}/date/${formattedDate}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      setBookings(response.data);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    fetchBookingsForResourceAndDate();
  }, [form.resourceId, form.bookingDate]);

  useEffect(() => {
    if (!form.startTime || !form.endTime || bookings.length === 0) {
      setConflict(false);
      return;
    }

    const newStart = normalizeTime(form.startTime);
    const newEnd = normalizeTime(form.endTime);

    const hasConflict = bookings.some((booking) => {
      const bookingStart = normalizeTime(booking.startTime);
      const bookingEnd = normalizeTime(booking.endTime);

      return newStart < bookingEnd && newEnd > bookingStart;
    });

    setConflict(hasConflict);
  }, [form.startTime, form.endTime, bookings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.resourceId || !form.bookingDate || !form.startTime || !form.endTime || !form.purpose) {
      setError("Please fill all required fields");
      return;
    }

    if (conflict) {
      setError("Selected time slot conflicts with an existing booking");
      return;
    }

    setSubmitting(true);

    try {
      await axiosClient.post(
        "/api/bookings",
        {
          userId: user.id,
          resourceId: Number(form.resourceId),
          bookingDate: formatDate(form.bookingDate),
          startTime: normalizeTime(form.startTime),
          endTime: normalizeTime(form.endTime),
          purpose: form.purpose,
          expectedAttendees: form.expectedAttendees
            ? Number(form.expectedAttendees)
            : null,
        },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      setSuccess("Booking request submitted successfully");
      setForm({
        resourceId: "",
        bookingDate: null,
        startTime: "",
        endTime: "",
        purpose: "",
        expectedAttendees: "",
      });
      setBookings([]);
    } catch (err) {
      setError(err?.response?.data?.message || "Booking creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resourceOptions = [
    { value: "", label: "Select resource" },
    ...resources.map((resource) => ({
      value: resource.id,
      label: `${resource.name} (${resource.type})`,
    })),
  ];

  return (
    <PageShell
      title="Create Booking"
      subtitle="Reserve a campus resource using an interactive booking interface."
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <SelectInput
              label="Resource"
              name="resourceId"
              value={form.resourceId}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  resourceId: e.target.value,
                  startTime: "",
                  endTime: "",
                }))
              }
              options={resourceOptions}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Booking Date
              </label>
              <DatePicker
                selected={form.bookingDate}
                onChange={(date) =>
                  setForm((prev) => ({
                    ...prev,
                    bookingDate: date,
                    startTime: "",
                    endTime: "",
                  }))
                }
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
                placeholderText="Select booking date"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Start Time
              </label>
              <select
                value={form.startTime}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    startTime: e.target.value,
                    endTime: "",
                  }))
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
              >
                <option value="">Select start time</option>
                {getStartTimeOptions().map((slot) => (
                  <option
                    key={slot.value}
                    value={slot.value}
                    disabled={slot.disabled}
                    className={slot.booked ? "text-red-400" : ""}
                  >
                    {slot.booked ? `🔴 ${slot.label} (Booked)` : slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                End Time
              </label>
              <select
                value={form.endTime}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
              >
                <option value="">Select end time</option>
                {getEndTimeOptions().map((slot) => (
                  <option
                    key={slot.value}
                    value={slot.value}
                    className={slot.booked ? "text-red-400" : ""}
                  >
                    {slot.booked ? `🔴 ${slot.label} (Partly unavailable)` : slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Purpose
              </label>
              <input
                type="text"
                value={form.purpose}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    purpose: e.target.value,
                  }))
                }
                placeholder="Describe the purpose of this booking"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Expected Attendees
              </label>
              <input
                type="number"
                value={form.expectedAttendees}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    expectedAttendees: e.target.value,
                  }))
                }
                placeholder="Enter expected number of attendees"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400"
              />
            </div>

            {conflict && (
              <div className="md:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                Selected time slot conflicts with an existing booking.
              </div>
            )}

            {error && (
              <div className="md:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="md:col-span-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" variant="primary" disabled={submitting || conflict}>
                {submitting ? "Submitting..." : "Create Booking"}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Booking Timeline
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Booked slots for the selected resource and date.
              </p>
            </div>

            {!form.resourceId || !form.bookingDate ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-5 text-sm text-slate-400">
                Select a resource and date to see the timeline.
              </div>
            ) : loadingBookings ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-5 text-sm text-slate-400">
                Loading bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-5 text-sm text-emerald-300">
                No bookings found for this date. All displayed time slots are available.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-red-300">
                        🔴 {booking.startTime} - {booking.endTime}
                      </p>
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-200">
                      {booking.purpose}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Booked by {booking.userName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default CreateBookingPage;