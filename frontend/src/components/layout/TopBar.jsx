import NotificationBell from "./NotificationBell";
import ProfileMenu from "./ProfileMenu";
import { useAuth } from "../../auth/AuthContext";

function TopBar() {
  const { user } = useAuth();

  if (!user) return null;

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
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  );
}

export default TopBar;