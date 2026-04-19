import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import { getAuthConfig } from "../api/authHelper";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

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
    to: "/tickets/all",
    action: "Manage Tickets",
  },
  {
    title: "Resource Catalogue",
    desc: "Inspect the full resource list as users see it and verify availability information.",
    to: "/resources",
    action: "View Resources",
  },
];

const PIE_COLORS = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ef4444", "#eab308"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-orange-400">{payload[0].value} bookings</p>
      </div>
    );
  }
  return null;
};

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, credentials, buildBasicAuthHeader } = useAuth();

  const [stats, setStats] = useState({
    totalResources: 0,
    pendingBookings: 0,
    openTickets: 0,
    unreadNotifications: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const authConfig = useMemo(
    () => getAuthConfig(credentials, buildBasicAuthHeader),
    [credentials, buildBasicAuthHeader]
  );

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        setLoadingStats(true);
        const [resourcesRes, bookingsRes, ticketsRes, unreadRes] = await Promise.all([
          axiosClient.get("/api/resources", authConfig),
          axiosClient.get("/api/bookings", authConfig),
          axiosClient.get("/api/tickets", authConfig),
          axiosClient.get(`/api/notifications/${user.id}/unread-count`, authConfig),
        ]);

        const bookings = bookingsRes.data || [];
        const tickets = ticketsRes.data || [];
        const unread = typeof unreadRes.data === "number"
          ? unreadRes.data
          : unreadRes.data?.count || 0;

        setStats({
          totalResources: (resourcesRes.data || []).length,
          pendingBookings: bookings.filter((b) => b.status === "PENDING").length,
          openTickets: tickets.filter((t) => ["OPEN", "IN_PROGRESS"].includes(t.status)).length,
          unreadNotifications: unread,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        const res = await axiosClient.get("/api/analytics/admin", authConfig);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    fetchStats();
    fetchAnalytics();
  }, [user, authConfig]);

  const statCards = [
    { label: "Resources", value: stats.totalResources, hint: "Managed rooms, labs, and equipment" },
    { label: "Pending Bookings", value: stats.pendingBookings, hint: "Need approval or rejection" },
    { label: "Open Tickets", value: stats.openTickets, hint: "Operational issues in progress" },
    { label: "Unread Alerts", value: stats.unreadNotifications, hint: "Notifications requiring attention" },
  ];

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Control resources, approvals, tickets, and overall platform operations."
    >
      <div className="space-y-6">

        {/* Stat cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
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

        {/* Hero + priorities */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card className="h-full overflow-hidden">
              <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-transparent p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300">Operations Control</p>
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
                  <Button variant="secondary" onClick={() => navigate("/tickets/all")}>
                    Manage Tickets
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">Admin Priorities</h3>
              <div className="mt-5 space-y-4">
                {[
                  `${loadingStats ? "..." : stats.pendingBookings} booking request(s) are pending review.`,
                  `${loadingStats ? "..." : stats.openTickets} ticket(s) are still open or in progress.`,
                  `${loadingStats ? "..." : stats.unreadNotifications} unread alert(s) require attention.`,
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-sm leading-6 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ── ANALYTICS SECTION ── */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-100">Usage Analytics</h2>
            <p className="mt-1 text-sm text-slate-400">
              Platform-wide insights on bookings, tickets, and resource usage.
            </p>
          </div>

          {loadingAnalytics ? (
            <Card>
              <p className="text-sm text-slate-400 animate-pulse">Loading analytics...</p>
            </Card>
          ) : analytics ? (
            <div className="grid gap-5 xl:grid-cols-2">

              {/* Top booked resources */}
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <Card>
                  <h3 className="mb-4 text-base font-semibold text-slate-100">Top Booked Resources</h3>
                  {analytics.topBookedResources?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={analytics.topBookedResources} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249,115,22,0.06)" }} />
                        <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-slate-500">No booking data yet.</p>
                  )}
                </Card>
              </motion.div>

              {/* Peak booking hours */}
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }}>
                <Card>
                  <h3 className="mb-4 text-base font-semibold text-slate-100">Peak Booking Hours</h3>
                  {analytics.peakBookingHours?.some((h) => h.count > 0) ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={analytics.peakBookingHours} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                        <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                          content={({ active, payload, label }) =>
                            active && payload?.length ? (
                              <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 shadow-lg">
                                <p className="font-medium">{label}</p>
                                <p className="text-orange-400">{payload[0].value} bookings</p>
                              </div>
                            ) : null
                          }
                          cursor={{ fill: "rgba(249,115,22,0.06)" }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-slate-500">No booking hour data yet.</p>
                  )}
                </Card>
              </motion.div>

              {/* Tickets by status pie */}
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
                <Card>
                  <h3 className="mb-4 text-base font-semibold text-slate-100">Tickets by Status</h3>
                  {analytics.ticketsByStatus?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={analytics.ticketsByStatus}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {analytics.ticketsByStatus.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} />
                        <Tooltip formatter={(val, name) => [val, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-slate-500">No ticket data yet.</p>
                  )}
                </Card>
              </motion.div>

              {/* Tickets by priority pie */}
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.15 }}>
                <Card>
                  <h3 className="mb-4 text-base font-semibold text-slate-100">Tickets by Priority</h3>
                  {analytics.ticketsByPriority?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={analytics.ticketsByPriority}
                          dataKey="count"
                          nameKey="priority"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ priority, percent }) => `${priority} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {analytics.ticketsByPriority.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} />
                        <Tooltip formatter={(val, name) => [val, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-slate-500">No priority data yet.</p>
                  )}
                </Card>
              </motion.div>

            </div>
          ) : (
            <Card>
              <p className="text-sm text-slate-500">Analytics unavailable.</p>
            </Card>
          )}
        </div>

        {/* Management cards */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-100">Management Actions</h2>
            <p className="mt-1 text-sm text-slate-400">Open the main operational areas directly from the dashboard.</p>
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