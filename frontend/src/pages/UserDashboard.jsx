import { Link } from "react-router-dom";

function UserDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>
      <p>Welcome to the user dashboard.</p>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <Link to="/resources">Browse Resources</Link>
      </div>
    </div>
  );
}

export default UserDashboard;