import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin dashboard.</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <Link to="/resources">Manage Resources</Link>
      </div>
    </div>
  );
}

export default AdminDashboard;