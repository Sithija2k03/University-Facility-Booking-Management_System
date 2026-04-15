import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";

function ResourceListPage() {
  const { credentials, buildBasicAuthHeader } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("");

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
    <div style={{ padding: "20px" }}>
      <h2>Resources</h2>

      <div style={{ marginBottom: "16px" }}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="LAB">LAB</option>
          <option value="LECTURE_HALL">LECTURE_HALL</option>
          <option value="MEETING_ROOM">MEETING_ROOM</option>
          <option value="EQUIPMENT">EQUIPMENT</option>
        </select>
      </div>

      {loading && <p>Loading resources...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.name}</td>
                <td>{resource.type}</td>
                <td>{resource.location}</td>
                <td>{resource.status}</td>
                <td>{resource.capacity ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResourceListPage;