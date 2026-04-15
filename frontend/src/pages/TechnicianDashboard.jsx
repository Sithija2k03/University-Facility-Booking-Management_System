import { Link } from "react-router-dom";

function TechnicianDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Technician Dashboard</h2>
      <p>Welcome to the technician dashboard.</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <Link to="/resources">View Resources</Link>
      </div>
    </div>
  );
}

export default TechnicianDashboard;