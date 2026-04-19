import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import { getAuthConfig } from "../api/authHelper";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const taskCards = [
  {
    title: "Assigned Tickets",
    desc: "Open the ticket workspace and review the incidents currently assigned to you.",
    actionLabel: "Open Ticket Queue",
    path: "/tickets/all",
  },
  {
    title: "Status Updates",
    desc: "Update progress, add technician notes, and move tickets through their lifecycle.",
    actionLabel: "Update Status",
    path: "/tickets/all",
  },
  {
    title: "Resource Context",
    desc: "Inspect related resource details to understand the environment of the issue.",
    actionLabel: "View Resources",
    path: "/resources",
  },
  {
    title: "My Ticket Activity",
    desc: "Follow comments, attachments, and issue history to respond with better context.",
    actionLabel: "Manage Tickets",
    path: "/tickets/all",
  },
];

function TechnicianDashboard() {
  const navigate = useNavigate();
  const { user, credentials, buildBasicAuthHeader } = useAuth();

  const [stats, setStats] = useState({
    assignedTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    unreadNotifications: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const authConfig = useMemo(
    () => getAuthConfig(credentials, buildBasicAuthHeader),
    [credentials, buildBasicAuthHeader]
  );

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;
      try {
        setLoadingStats(true);
        const [ticketsRes, unreadRes] = await Promise.all([
          axiosClient.get("/api/tickets", authConfig),
          axiosClient.get(`/api/notifications/${user.id}/unread-count`, authConfig),
        ]);

        const tickets = ticketsRes.data || [];
        const unreadNotifications =
          typeof unreadRes.data === "number"
            ? unreadRes.data
            : unreadRes.data?.count || 0;

        const assignedTickets = tickets.filter(
          (t) => t.assignedTechnicianId === user.id
        );

        setStats({
          assignedTickets: assignedTickets.length,
          inProgressTickets: assignedTickets.filter((t) => t.status === "IN_PROGRESS").length,
          resolvedTickets: assignedTickets.filter((t) =>
            ["RESOLVED", "CLOSED"].includes(t.status)
          ).length,
          unreadNotifications,
        });
      } catch (error) {
        console.error("Failed to load technician dashboard stats", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [user, authConfig]);

  const statCards = [
    { label: "Assigned Tickets", value: stats.assignedTickets, hint: "Cases currently under your responsibility" },
    { label: "In Progress", value: stats.inProgressTickets, hint: "Actively being investigated or repaired" },
    { label: "Resolved", value: stats.resolvedTickets, hint: "Tickets completed or closed" },
    { label: "Unread Alerts", value: stats.unreadNotifications, hint: "Notifications waiting" },
  ];

  return (
    <PageShell
      title="Technician Dashboard"
      subtitle="Handle assigned incidents efficiently and keep issue resolution moving."
    >
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Card className="h-full">
                <p className="text-sm font-medium text-slate-400">{item.label}</p>
                <h3 className="mt-3 text-3xl font-bold text-slate-100">
                  {loadingStats ? "..." : item.value}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.hint}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card className="h-full overflow-hidden">
              <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-transparent p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Technical Workflow</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-50">
                  Focus on resolution, updates, and field context
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Review assigned incidents, add progress notes, inspect related resources,
                  and move tickets toward resolution with clear operational visibility.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="primary" onClick={() => navigate("/tickets/all")}>
                    Open Assigned Tickets
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/tickets/my")}>
                    My Tickets
                  </Button>
                  <Button variant="secondary" onClick={() => navigate("/resources")}>
                    View Resources
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Technician Focus</h3>
              <div className="mt-5 space-y-4">
                {[
                  `${loadingStats ? "..." : stats.assignedTickets} ticket(s) are currently assigned to you.`,
                  `${loadingStats ? "..." : stats.inProgressTickets} ticket(s) are actively in progress.`,
                  `${loadingStats ? "..." : stats.unreadNotifications} unread notification(s) may need action.`,
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
            <h2 className="text-xl font-semibold text-slate-100">Work Area</h2>
            <p className="mt-1 text-sm text-slate-400">Open the main technician actions directly from here.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {taskCards.map((card, index) => (
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
                    <Button variant="secondary" onClick={() => navigate(card.path)}>
                      {card.actionLabel}
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

export default TechnicianDashboard;