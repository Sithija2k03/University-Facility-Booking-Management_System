import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import logo from "../../assets/logo.png";

const linkBase =
  "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition";
const activeClass =
  "bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.25)]";
const inactiveClass =
  "text-slate-300 hover:bg-slate-800 hover:text-white";

function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (to) => location.pathname === to;

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-slate-950/70 p-6 backdrop-blur lg:block">
      <div className="mb-10 flex flex-col items-center text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white">
          Smart Campus
        </p>
        <img src={logo} alt="Logo" className="mt-1 h-32 w-32 object-contain" />
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className={`${linkBase} ${isActive("/dashboard") ? activeClass : inactiveClass}`}
        >
          Dashboard
        </Link>

        <Link
          to="/resources"
          className={`${linkBase} ${isActive("/resources") ? activeClass : inactiveClass}`}
        >
          Resources
        </Link>

        {user.role === "USER" && (
          <>
            <p className="mt-6 px-2 text-xs uppercase text-slate-500">Booking</p>

            <Link
              to="/bookings/create"
              className={`${linkBase} ${isActive("/bookings/create") ? activeClass : inactiveClass}`}
            >
              Create Booking
            </Link>

            <Link
              to="/bookings/my"
              className={`${linkBase} ${isActive("/bookings/my") ? activeClass : inactiveClass}`}
            >
              My Bookings
            </Link>

            <p className="mt-6 px-2 text-xs uppercase text-slate-500">Tickets</p>

            <Link
              to="/tickets/create"
              className={`${linkBase} ${isActive("/tickets/create") ? activeClass : inactiveClass}`}
            >
              Create Ticket
            </Link>

            <Link
              to="/tickets/my"
              className={`${linkBase} ${isActive("/tickets/my") ? activeClass : inactiveClass}`}
            >
              My Tickets
            </Link>
          </>
        )}

        {user.role === "ADMIN" && (
          <>
            <p className="mt-6 px-2 text-xs uppercase text-slate-500">Admin</p>

            <Link
              to="/resources/create"
              className={`${linkBase} ${isActive("/resources/create") ? activeClass : inactiveClass}`}
            >
              Create Resource
            </Link>

            <Link
              to="/bookings/all"
              className={`${linkBase} ${isActive("/bookings/all") ? activeClass : inactiveClass}`}
            >
              Manage Bookings
            </Link>

            <Link
              to="/tickets/all"
              className={`${linkBase} ${isActive("/tickets/all") ? activeClass : inactiveClass}`}
            >
              Manage Tickets
            </Link>
          </>
        )}

        {user.role === "TECHNICIAN" && (
          <>
            <p className="mt-6 px-2 text-xs uppercase text-slate-500">Tickets</p>

            <Link
              to="/tickets/all"
              className={`${linkBase} ${isActive("/tickets/all") ? activeClass : inactiveClass}`}
            >
              Manage Tickets
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}

export default AppSidebar;