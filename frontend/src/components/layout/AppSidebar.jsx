import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

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
      
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Smart Campus
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Operations Hub
        </h2>
      </div>

      {/* USER CARD */}
      <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-sm font-medium text-slate-100">{user.name}</p>
        <p className="mt-1 text-xs text-slate-400">{user.email}</p>
        <span className="mt-3 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
          {user.role}
        </span>
      </div>

      {/* NAV */}
      <nav className="space-y-2">

        {/* COMMON */}
        <Link
          to="/dashboard"
          className={`${linkBase} ${
            isActive("/dashboard") ? activeClass : inactiveClass
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/resources"
          className={`${linkBase} ${
            isActive("/resources") ? activeClass : inactiveClass
          }`}
        >
          Resources
        </Link>

        {/* BOOKINGS SECTION */}
        <p className="mt-6 px-2 text-xs uppercase text-slate-500">
          Booking
        </p>

        {(user.role === "USER" || user.role === "ADMIN") && (
          <>
            <Link
              to="/bookings/create"
              className={`${linkBase} ${
                isActive("/bookings/create") ? activeClass : inactiveClass
              }`}
            >
              Create Booking
            </Link>

            <Link
              to="/bookings/my"
              className={`${linkBase} ${
                isActive("/bookings/my") ? activeClass : inactiveClass
              }`}
            >
              My Bookings
            </Link>
          </>
        )}

        {/* TICKETS SECTION */}
        <p className="mt-6 px-2 text-xs uppercase text-slate-500">
          Tickets
        </p>

        <Link
          to="/tickets/create"
          className={`${linkBase} ${
            isActive("/tickets/create") ? activeClass : inactiveClass
          }`}
        >
          Create Ticket
        </Link>

        {(user.role === "USER" || user.role === "ADMIN") && (
          <Link
            to="/tickets/my"
            className={`${linkBase} ${
              isActive("/tickets/my") ? activeClass : inactiveClass
            }`}
          >
            My Tickets
          </Link>
        )}

        {(user.role === "ADMIN" || user.role === "TECHNICIAN") && (
          <Link
            to="/tickets/all"
            className={`${linkBase} ${
              isActive("/tickets/all") ? activeClass : inactiveClass
            }`}
          >
            {user.role === "ADMIN" ? "View All Tickets" : "Assigned Tickets"}
          </Link>
        )}

        {(user.role === "ADMIN" || user.role === "TECHNICIAN") && (
          <Link
            to="/tickets/all"
            className={`${linkBase} ${
              isActive("/tickets/all") ? activeClass : inactiveClass
            }`}
          >
            Manage Tickets
          </Link>
        )}

        {user.role === "ADMIN" && (
          <>
            <p className="mt-6 px-2 text-xs uppercase text-slate-500">
              Admin
            </p>

            <Link
              to="/resources/create"
              className={`${linkBase} ${
                isActive("/resources/create")
                  ? activeClass
                  : inactiveClass
              }`}
            >
              Create Resource
            </Link>

            <Link
              to="/bookings/all"
              className={`${linkBase} ${
                isActive("/bookings/all") ? activeClass : inactiveClass
              }`}
            >
              Manage Bookings
            </Link>

          </>
        )}
      </nav>
    </aside>
  );
}

export default AppSidebar;