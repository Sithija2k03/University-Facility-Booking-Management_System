import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

function UnauthorizedPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-6">
      <div className="max-w-md rounded-[28px] border border-slate-800 bg-slate-900/70 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-400">
          Access Denied
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-50">
          You do not have permission
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          The page you tried to open requires a different role or a higher level
          of access.
        </p>

        <div className="mt-6">
          <Link to="/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;