import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const initials = useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleProfileClick = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 transition hover:bg-slate-800"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white shadow">
          {initials}
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold text-slate-100">{user.name}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>

        <span className="hidden text-slate-400 md:block">⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-[24px] border border-slate-800 bg-slate-900/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="mb-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-slate-100">{user.name}</p>
            <p className="mt-1 text-xs text-slate-400">{user.email}</p>
            <span className="mt-3 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
              {user.role}
            </span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleProfileClick}
              className="w-full rounded-2xl px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-800"
            >
              Profile Settings
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-2xl px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;