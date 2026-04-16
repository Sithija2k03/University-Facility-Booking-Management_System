import { motion } from "framer-motion";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";

const cards = [
  { title: "Resource Management", desc: "Create, update, and maintain all campus resources." },
  { title: "Booking Approvals", desc: "Review and process booking requests." },
  { title: "Operations Control", desc: "Manage tickets, assignments, and notifications." },
];

function AdminDashboard() {
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
            <Card className="h-full">
              <h3 className="text-lg font-semibold text-slate-100">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{card.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

export default AdminDashboard;