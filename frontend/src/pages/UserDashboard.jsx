import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const quickActions = [
  {
    title: "Browse Resources",
    desc: "Find labs, lecture halls, meeting rooms, and equipment available for booking.",
    to: "/resources",
    action: "Explore Resources",
  },
  {
    title: "Create Booking",
    desc: "Reserve a resource using the smart booking workflow and availability timeline.",
    to: "/bookings/create",
    action: "New Booking",
  },
  {
    title: "My Bookings",
    desc: "Track approvals, cancellations, and the current status of your booking requests.",
    to: "/bookings/my",
    action: "View Bookings",
  },
  {
    title: "Create Ticket",
    desc: "Report maintenance issues, damaged equipment, or operational incidents quickly.",
    to: "/tickets/create",
    action: "Raise Ticket",
  },
  {
    title: "My Tickets",
    desc: "See technician updates, comments, attachments, and resolution progress.",
    to: "/tickets/my",
    action: "View Tickets",
  },
  {
    title: "Profile Settings",
    desc: "Manage your account details, password, and personal information securely.",
    to: "/profile",
    action: "Open Profile",
  },
];

function UserDashboard() {
  const navigate = useNavigate();
  const { user, credentials, authMode, buildBasicAuthHeader } = useAuth();

  const [stats, setStats] = useState({
    totalBookings: 0,
    approvedBookings: 0,
    totalTickets: 0,
    openTickets: 0,
    unreadNotifications: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const requestConfig = useMemo(() => {
    if (authMode === "basic" && credentials) {
      return {
        headers: {
          Authorization: buildBasicAuthHeader(
            credentials.email,
            credentials.password
          ),
        },
      };
    }
    return {};
  }, [authMode, credentials, buildBasicAuthHeader]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;

      try {
        setLoadingStats(true);

        const [bookingsRes, ticketsRes, unreadRes] = await Promise.all([
          axiosClient.get(`/api/bookings/user/${user.id}`, requestConfig),
          axiosClient.get(`/api/tickets/reporter/${user.id}`, requestConfig),
          axiosClient.get(
            `/api/notifications/${user.id}/unread-count`,
            requestConfig
          ),
        ]);

        const bookings = bookingsRes.data || [];
        const tickets = ticketsRes.data || [];
        const unreadNotifications =
          typeof unreadRes.data === "number"
            ? unreadRes.data
            : unreadRes.data?.count || 0;

        setStats({
          totalBookings: bookings.length,
          approvedBookings: bookings.filter(
            (booking) => booking.status === "APPROVED"
          ).length,
          totalTickets: tickets.length,
          openTickets: tickets.filter((ticket) =>
            ["OPEN", "IN_PROGRESS"].includes(ticket.status)
          ).length,
          unreadNotifications,
        });
      } catch (error) {
        console.error("Failed to load user dashboard stats", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [user, requestConfig]);

  const statCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      hint: "All your booking requests",
    },
    {
      label: "Approved Bookings",
      value: stats.approvedBookings,
      hint: "Ready and confirmed",
    },
    {
      label: "Open Tickets",
      value: stats.openTickets,
      hint: "Issues still in progress",
    },
    {
      label: "Unread Alerts",
      value: stats.unreadNotifications,
      hint: "Notifications waiting",
    },
  ];

  return (
    <PageShell
      title="User Dashboard"
      subtitle="Access bookings, tickets, resources, and your account from one place."
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
                <p className="text-sm font-medium text-slate-400">
                  {item.label}
                </p>
                <h3 className="mt-3 text-3xl font-bold text-slate-100">
                  {loadingStats ? "..." : item.value}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.hint}
                </p>
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
                  Smart Campus Access
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-50">
                  Manage your campus requests with clarity
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Use the booking and ticket modules to reserve resources, report
                  issues, and stay updated on approvals, comments, and operational
                  changes.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/bookings/create")}
                  >
                    Create Booking
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/tickets/create")}
                  >
                    Create Ticket
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
              <h3 className="text-lg font-semibold text-slate-100">
                Today’s Focus
              </h3>
              <div className="mt-5 space-y-4">
                {[
                  `You currently have ${stats.approvedBookings} approved booking(s).`,
                  `You currently have ${stats.openTickets} open ticket(s).`,
                  `You currently have ${stats.unreadNotifications} unread notification(s).`,
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
            <h2 className="text-xl font-semibold text-slate-100">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Jump directly into the most common tasks.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
              >
                <Card className="flex h-full flex-col justify-between transition-all duration-200 hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.12)]">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-5">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(card.to)}
                    >
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

export default UserDashboard;