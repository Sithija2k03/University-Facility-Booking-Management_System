import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
import SelectInput from "../components/ui/SelectInput";

function CreateResourcePage() {
  const { credentials, buildBasicAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "LAB",
    equipmentType: "",
    capacity: "",
    location: "",
    building: "",
    floor: "",
    availableFrom: "",
    availableTo: "",
    status: "ACTIVE",
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const authHeader = buildBasicAuthHeader(
        credentials.email,
        credentials.password
      );

      const payload = {
        ...form,
        capacity:
          form.type === "EQUIPMENT" || form.capacity === ""
            ? null
            : Number(form.capacity),
        equipmentType: form.type === "EQUIPMENT" ? form.equipmentType : null,
      };

      const formData = new FormData();
      formData.append(
        "resource",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axiosClient.post("/api/resources", formData, {
        headers: {
          Authorization: authHeader,
        },
      });

      navigate("/resources");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create resource");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      title="Create Resource"
      subtitle="Add a new lab, hall, meeting room, or equipment item to the system."
    >
      <Card className="max-w-4xl">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <TextInput
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Resource name"
          />

          <TextInput
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
          />

          <SelectInput
            label="Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={[
              { value: "LAB", label: "LAB" },
              { value: "LECTURE_HALL", label: "LECTURE_HALL" },
              { value: "MEETING_ROOM", label: "MEETING_ROOM" },
              { value: "EQUIPMENT", label: "EQUIPMENT" },
            ]}
          />

          {form.type === "EQUIPMENT" ? (
            <SelectInput
              label="Equipment Type"
              name="equipmentType"
              value={form.equipmentType}
              onChange={handleChange}
              options={[
                { value: "", label: "Select equipment type" },
                { value: "PROJECTOR", label: "PROJECTOR" },
                { value: "CAMERA", label: "CAMERA" },
                { value: "MICROPHONE", label: "MICROPHONE" },
                { value: "LAPTOP", label: "LAPTOP" },
                { value: "PRINTER", label: "PRINTER" },
                { value: "SPEAKER", label: "SPEAKER" },
                { value: "OTHER", label: "OTHER" },
              ]}
            />
          ) : (
            <TextInput
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
            />
          )}

          <TextInput
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />

          <TextInput
            label="Building"
            name="building"
            value={form.building}
            onChange={handleChange}
            placeholder="Building"
          />

          <TextInput
            label="Floor"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            placeholder="Floor"
          />

          <SelectInput
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "OUT_OF_SERVICE", label: "OUT_OF_SERVICE" },
            ]}
          />

          <TextInput
            label="Available From"
            name="availableFrom"
            type="time"
            value={form.availableFrom}
            onChange={handleChange}
          />

          <TextInput
            label="Available To"
            name="availableTo"
            type="time"
            value={form.availableTo}
            onChange={handleChange}
          />

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-slate-300">
              Browse Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100"
            />
          </div>

          {error ? (
            <div className="md:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create Resource"}
            </Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}

export default CreateResourcePage;