import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { createTicket } from "../api/ticketApi";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import TextInput from "../components/ui/TextInput";
import SelectInput from "../components/ui/SelectInput";
import Button from "../components/ui/Button";

const CATEGORIES = [
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "PLUMBING", label: "Plumbing" },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "NETWORK", label: "Network / IT" },
  { value: "HVAC", label: "HVAC / Air Conditioning" },
  { value: "STRUCTURAL", label: "Structural / Civil" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

function CreateTicketPage() {
  const { user, buildBasicAuthHeader, credentials } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    locationText: "",
    category: "ELECTRICAL",
    description: "",
    priority: "MEDIUM",
    preferredContact: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.locationText.trim()) errs.locationText = "Location is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (!form.preferredContact.trim())
      errs.preferredContact = "Preferred contact is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const authHeader = buildBasicAuthHeader(
        credentials.email,
        credentials.password
      );
      const payload = { ...form, reporterId: user.id };
      const res = await createTicket(payload, authHeader);
      setSuccessMessage("Ticket created successfully. Redirecting...");
      setTimeout(() => {
        navigate(`/tickets/${res.data.id}`);
      }, 900);
    } catch (err) {
      setServerError(
        err?.response?.data?.message || "Failed to create ticket. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Report an Incident"
      subtitle="Submit a maintenance or fault report for a campus resource or location."
    >
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Location */}
          <TextInput
            label="Location / Area"
            name="locationText"
            value={form.locationText}
            onChange={handleChange}
            placeholder="e.g. Lab 302, Building A"
            error={errors.locationText}
          />

          {/* Category */}
          <SelectInput
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={CATEGORIES}
          />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the issue in detail..."
              className={`w-full rounded-2xl border bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-orange-400 resize-none ${
                errors.description ? "border-red-500" : "border-slate-700"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Priority */}
          <SelectInput
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            options={PRIORITIES}
          />

          {/* Preferred Contact */}
          <TextInput
            label="Preferred Contact"
            name="preferredContact"
            value={form.preferredContact}
            onChange={handleChange}
            placeholder="e.g. your phone number or email"
            error={errors.preferredContact}
          />

          {/* Server Error */}
          {serverError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400"
            >
              {serverError}
            </motion.p>
          )}

          {successMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300"
            >
              {successMessage}
            </motion.p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/tickets/my")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}

export default CreateTicketPage;
