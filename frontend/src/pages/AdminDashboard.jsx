import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const cards = [
  { title: "Resource Management", desc: "Create, update, and maintain all campus resources." },
  { title: "Booking Approvals", desc: "Review and process booking requests." },
  { title: "Operations Control", desc: "Manage tickets, assignments, and notifications." },
];

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Manage the platform, resources, and operational workflows."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
          >
            <Card className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{card.desc}</p>
              </div>
              {card.title === "Operations Control" && (
                <Button className="mt-4" onClick={() => navigate("/tickets/all")}>
                  View All Tickets
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

export default AdminDashboard;