import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/resources">Resources</Link>

        {user.role === "ADMIN" && <span>Admin Controls</span>}
        {user.role === "TECHNICIAN" && <span>Technician Area</span>}
      </div>

      <div style={styles.right}>
        <span>
          {user.name} ({user.role})
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#eaeaea",
  },
  left: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  right: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
};

export default Navbar;