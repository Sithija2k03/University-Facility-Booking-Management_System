import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getAuthConfig } from "../api/authHelper";
import { getAllResources, searchResources, deleteResource } from "../api/resourceApi";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import SelectInput from "../components/ui/SelectInput";

function ResourceListPage() {
  const { credentials, user, buildBasicAuthHeader } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("");

  const typeOptions = useMemo(
    () => [
      { value: "", label: "All Types" },
      { value: "LAB", label: "LAB" },
      { value: "LECTURE_HALL", label: "LECTURE_HALL" },
      { value: "MEETING_ROOM", label: "MEETING_ROOM" },
      { value: "EQUIPMENT", label: "EQUIPMENT" },
    ],
    []
  );

  const authConfig = useMemo(
    () => getAuthConfig(credentials, buildBasicAuthHeader),
    [credentials, buildBasicAuthHeader]
  );

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = searchType
        ? await searchResources({ type: searchType }, authConfig)
        : await getAllResources(authConfig);

      setResources(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this resource?");
    if (!confirmed) return;

    try {
      await deleteResource(id, authConfig);
      fetchResources();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete resource");
    }
  };

  useEffect(() => {
    fetchResources();
  }, [searchType, authConfig]);

  return (
    <PageShell
      title="Resources"
      subtitle="Browse and filter the campus catalogue of rooms, labs, and equipment."
      actions={
        user?.role === "ADMIN" ? (
          <Link to="/resources/create">
            <Button variant="primary">Create Resource</Button>
          </Link>
        ) : null
      }
    >
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <SelectInput
            label="Filter by Type"
            name="type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            options={typeOptions}
          />
        </div>
      </Card>

      {loading ? (
        <Card>
          <p className="text-sm text-slate-400">Loading resources...</p>
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      ) : resources.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-sm text-slate-400">No resources found.</p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {resource.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">{resource.type}</p>
                  </div>

                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
                    {resource.status}
                  </span>
                </div>

                {resource.imageUrl && (
                  <img
                    src={`http://localhost:8080/${resource.imageUrl.replace(/\\/g, "/")}`}
                    alt={resource.name}
                    className="mt-4 h-44 w-full rounded-2xl object-cover border border-slate-800"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="text-slate-500">Location:</span>{" "}
                    {resource.location}
                  </p>
                  <p>
                    <span className="text-slate-500">Building:</span>{" "}
                    {resource.building || "-"}
                  </p>
                  <p>
                    <span className="text-slate-500">Capacity:</span>{" "}
                    {resource.capacity ?? "-"}
                  </p>
                  {resource.equipmentType && (
                    <p>
                      <span className="text-slate-500">Equipment Type:</span>{" "}
                      {resource.equipmentType}
                    </p>
                  )}
                </div>

                {user?.role === "ADMIN" && (
                  <div className="mt-5 flex gap-3">
                    <Link to={`/resources/edit/${resource.id}`}>
                      <Button variant="secondary">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(resource.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default ResourceListPage;