import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";

const cards = [
  { title: "Browse Resources", desc: "Find available rooms, labs, and equipment.", to: null },
  { title: "My Bookings", desc: "Track your booking requests and approvals.", to: null },
  { title: "My Tickets", desc: "View maintenance reports and updates.", to: "/tickets/my" },
];

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="User Dashboard"
      subtitle="Quick access to your campus operations and requests."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <Card
              className={`h-full transition-all duration-200 ${
                card.to
                  ? "cursor-pointer hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                  : ""
              }`}
              onClick={card.to ? () => navigate(card.to) : undefined}
            >
              <h3 className="text-lg font-semibold text-slate-100">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{card.desc}</p>
              {card.to && (
                <p className="mt-4 text-xs text-orange-400">Go →</p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

export default UserDashboard;