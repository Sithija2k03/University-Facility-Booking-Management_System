import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const stats = [
  { label: "Resources", value: "24", hint: "Managed rooms, labs, and equipment" },
  { label: "Pending Bookings", value: "08", hint: "Need approval or rejection" },
  { label: "Open Tickets", value: "11", hint: "Operational issues in progress" },
  { label: "Unread Alerts", value: "07", hint: "Notifications requiring attention" },
];

const managementCards = [
  {
    title: "Resource Management",
    desc: "Create, update, and maintain all campus resources with visibility and availability controls.",
    to: "/resources/create",
    action: "Manage Resources",
  },
  {
    title: "Booking Approvals",
    desc: "Review pending reservations, approve valid requests, and reject conflicts or policy violations.",
    to: "/bookings/all",
    action: "Review Bookings",
  },
  {
    title: "Ticket Operations",
    desc: "Monitor issue flow, assign technicians, and ensure incidents move toward resolution.",
    to: "/tickets/manage",
    action: "Manage Tickets",
  },
  {
    title: "Resource Catalogue",
    desc: "Inspect the full resource list as users see it and verify availability information.",
    to: "/resources",
    action: "View Resources",
  },
];

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Control resources, approvals, tickets, and overall platform operations."
    >
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <Card className="h-full">
                <p className="text-sm font-medium text-slate-400">{item.label}</p>
                <h3 className="mt-3 text-3xl font-bold text-slate-100">{item.value}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.hint}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="h-full overflow-hidden">
              <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-transparent p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
                  Operations Control
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-50">
                  Keep the campus platform efficient and accountable
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Oversee bookings, resource records, and issue resolution while keeping
                  operational workflows aligned with campus policies.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="primary" onClick={() => navigate("/bookings/all")}>
                    Approve Bookings
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/tickets/manage")}>
                    Manage Tickets
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
          >
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Admin Priorities</h3>
              <div className="mt-5 space-y-4">
                {[
                  "Review pending bookings early to reduce scheduling delays.",
                  "Assign technicians to high-priority issues without backlog.",
                  "Keep resource records current so users book accurate items and spaces.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm leading-6 text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-100">Management Actions</h2>
            <p className="mt-1 text-sm text-slate-400">
              Open the main operational areas directly from the dashboard.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {managementCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <Card className="flex h-full flex-col justify-between transition-all duration-200 hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.12)]">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{card.desc}</p>
                  </div>

                  <div className="mt-5">
                    <Button variant="secondary" onClick={() => navigate(card.to)}>
                      {card.action}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default AdminDashboard;