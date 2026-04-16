import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
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

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const authHeader = buildBasicAuthHeader(
        credentials.email,
        credentials.password
      );

      const url = searchType
        ? `/api/resources/search?type=${searchType}`
        : "/api/resources";

      const response = await axiosClient.get(url, {
        headers: {
          Authorization: authHeader,
        },
      });

      setResources(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (credentials) {
      fetchResources();
    }
  }, [searchType, credentials]);

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
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default ResourceListPage;