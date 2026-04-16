import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";

function ResourceListPage() {
  const { credentials, buildBasicAuthHeader } = useAuth();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosClient.get("/api/resources", {
        headers: {
          Authorization: buildBasicAuthHeader(
            credentials.email,
            credentials.password
          ),
        },
      });
      setResources(res.data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resources</h2>

      <div style={styles.grid}>
        {resources.map((r) => (
          <div key={r.id} className="card">
            <h3>{r.name}</h3>
            <p>{r.type}</p>
            <p>{r.location}</p>
            <p>Status: {r.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px",
  },
};

export default ResourceListPage;