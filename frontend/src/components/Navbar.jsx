import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/bookings/create/">Create Booking</Link>
        <Link to="/bookings/my/">My Bookings</Link>

        <Link to="/bookings/all">Manage Bookings</Link>
      </div>

      <div style={styles.right}>
        <span>{user.name} ({user.role})</span>
        <button className="button-primary" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#1e293b",
    borderBottom: "1px solid #334155",
  },
  left: {
    display: "flex",
    gap: "16px",
  },
  right: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
};

export default Navbar;