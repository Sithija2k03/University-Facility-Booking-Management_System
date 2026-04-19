import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getAuthConfig } from "../api/authHelper";
import { getResourceById, updateResource } from "../api/resourceApi";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";
import SelectInput from "../components/ui/SelectInput";

function EditResourcePage() {
  const { id } = useParams();
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
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const authConfig = getAuthConfig(credentials, buildBasicAuthHeader);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await getResourceById(id, authConfig);
        const resource = response.data;

        setForm({
          name: resource.name || "",
          description: resource.description || "",
          type: resource.type || "LAB",
          equipmentType: resource.equipmentType || "",
          capacity: resource.capacity ?? "",
          location: resource.location || "",
          building: resource.building || "",
          floor: resource.floor || "",
          availableFrom: resource.availableFrom || "",
          availableTo: resource.availableTo || "",
          status: resource.status || "ACTIVE",
        });

        setCurrentImageUrl(resource.imageUrl || "");
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load resource");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        description: form.description,
        type: form.type,
        equipmentType: form.type === "EQUIPMENT" ? form.equipmentType || null : null,
        capacity:
          form.type === "EQUIPMENT" || form.capacity === ""
            ? null
            : Number(form.capacity),
        location: form.location,
        building: form.building,
        floor: form.floor,
        availableFrom: form.availableFrom || null,
        availableTo: form.availableTo || null,
        status: form.status,
        // Never send imageUrl — backend manages it via file upload only
      };

      const formData = new FormData();
      formData.append(
        "resource",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      // For multipart, let browser set Content-Type with boundary
      // Merge authConfig headers but remove Content-Type so browser sets it
      const { headers: configHeaders, ...restConfig } = authConfig;
      const { "Content-Type": _removed, ...headersWithoutContentType } = configHeaders || {};

      await updateResource(id, formData, {
        ...restConfig,
        headers: headersWithoutContentType,
      });

      navigate("/resources");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update resource");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageShell title="Edit Resource" subtitle="Loading resource details...">
        <Card>
          <p className="text-sm text-slate-400">Loading...</p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell title="Edit Resource" subtitle="Update the selected campus resource.">
      <Card className="max-w-4xl">
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <TextInput
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <TextInput
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
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
            />
          )}

          <TextInput
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <TextInput
            label="Building"
            name="building"
            value={form.building}
            onChange={handleChange}
          />

          <TextInput
            label="Floor"
            name="floor"
            value={form.floor}
            onChange={handleChange}
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

          <div className="md:col-span-2 space-y-2">
            {currentImageUrl && (
              <img
                src={`http://localhost:8080/${currentImageUrl.replace(/\\/g, "/")}`}
                alt="Current resource"
                className="h-44 w-full max-w-sm rounded-2xl object-cover border border-slate-800"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            )}
            <label className="text-sm font-medium text-slate-300">
              Replace Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100"
            />
          </div>

          {error && (
            <div className="md:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Updating..." : "Update Resource"}
            </Button>
          </div>
        </form>
      </Card>
    </PageShell>
  );
}

export default EditResourcePage;