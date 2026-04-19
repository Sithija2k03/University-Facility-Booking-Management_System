import { motion } from "framer-motion";

function AuthLayout({ title, subtitle, children, sideTitle, sideText }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-center px-6 py-10"
        >
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-900/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-orange-400">
                Smart Campus
              </p>
              <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
              <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
            </div>

            {children}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="hidden items-center justify-center border-l border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_25%),linear-gradient(180deg,#111827,#0f172a)] px-10 lg:flex"
        >
          <div className="max-w-lg">
            <div className="rounded-[32px] border border-slate-700/60 bg-slate-900/50 p-8 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.25em] text-orange-400">
                Campus Platform
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">
                {sideTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                {sideText}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
                  <p className="text-sm font-medium text-slate-100">Resources</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Rooms, labs, equipment, and smart availability.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
                  <p className="text-sm font-medium text-slate-100">Operations</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Bookings, incidents, updates, and notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;