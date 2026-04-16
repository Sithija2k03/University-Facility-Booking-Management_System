import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Button from "../ui/Button";

function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/70 px-5 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Logged in as
        </p>
        <h3 className="mt-1 text-sm font-medium text-slate-100">
          {user.name}
        </h3>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 md:block">
          {user.role}
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default TopBar;