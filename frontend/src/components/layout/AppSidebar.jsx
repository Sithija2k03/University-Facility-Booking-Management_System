import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const linkBase =
  "flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition";
const activeClass = "bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.25)]";
const inactiveClass = "text-slate-300 hover:bg-slate-800 hover:text-white";

function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const commonLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/resources", label: "Resources" },
  ];

  const adminLinks = [
    { to: "/resources/create", label: "Create Resource" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-slate-950/70 p-6 backdrop-blur lg:block">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-orange-400">
          Smart Campus
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Operations Hub
        </h2>
      </div>

      <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-sm font-medium text-slate-100">{user.name}</p>
        <p className="mt-1 text-xs text-slate-400">{user.email}</p>
        <span className="mt-3 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
          {user.role}
        </span>
      </div>

      <nav className="space-y-2">
        {commonLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`${linkBase} ${isActive(link.to) ? activeClass : inactiveClass}`}
          >
            {link.label}
          </Link>
        ))}

        {user.role === "ADMIN" &&
          adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${linkBase} ${isActive(link.to) ? activeClass : inactiveClass}`}
            >
              {link.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}

export default AppSidebar;