import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/logo.png";

const slides = [
  {
    title: "Manage campus resources smoothly",
    subtitle:
      "Browse, organize, and maintain labs, lecture halls, meeting rooms, and equipment through one centralized platform.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Track maintenance and support tickets",
    subtitle:
      "Report issues, assign technicians, monitor progress, and improve service response through a connected support workflow.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Role-based dashboards for every user",
    subtitle:
      "Users, administrators, and technicians receive focused interfaces tailored to their responsibilities.",
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&q=80",
  },
];

const tabSections = [
  {
    id: "resources",
    label: "Resources",
    title: "Resource Management",
    subtitle: "Centralized control over campus spaces and equipment",
    description:
      "The resource management module enables the institution to organize lecture halls, laboratories, meeting rooms, and equipment within a single digital platform. It helps users quickly discover available facilities while giving administrators the tools to maintain accurate operational information.",
    highlights: [
      "Maintain a structured catalogue of halls, labs, rooms, and equipment",
      "Store availability windows, capacities, locations, and supporting images",
      "Allow users to browse and search resources with a modern visual experience",
      "Enable administrators to add, update, and remove resources through controlled access",
    ],
    cards: [
      {
        title: "Smart Discovery",
        text: "Users can quickly explore available resources using structured listings and search-driven discovery.",
        color: "from-orange-500/20 to-orange-400/5",
      },
      {
        title: "Admin Control",
        text: "Administrators can keep resource records accurate and operationally useful.",
        color: "from-sky-500/20 to-sky-400/5",
      },
      {
        title: "Operational Clarity",
        text: "Consistent data helps reduce confusion around availability, suitability, and facility usage.",
        color: "from-emerald-500/20 to-emerald-400/5",
      },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    title: "Booking Workflow",
    subtitle: "From request creation to approval and scheduling confidence",
    description:
      "The booking workflow is designed to manage the entire reservation lifecycle for campus resources. Users can submit requests through an interactive interface, while administrators handle approvals and decisions with visibility into scheduling conflicts and booking history.",
    highlights: [
      "Interactive booking creation experience with resource and time selection",
      "Conflict-aware logic to reduce overlapping reservations",
      "Approval, rejection, and cancellation support through role-based workflows",
      "Booking tracking for users and centralized booking oversight for administrators",
    ],
    cards: [
      {
        title: "Conflict Awareness",
        text: "Users receive guidance when time slots are unavailable or already reserved.",
        color: "from-red-500/20 to-red-400/5",
      },
      {
        title: "Approval Control",
        text: "Administrators can review booking requests and make structured decisions.",
        color: "from-orange-500/20 to-orange-400/5",
      },
      {
        title: "Scheduling Confidence",
        text: "The institution gains more reliable facility usage through visible booking workflows.",
        color: "from-violet-500/20 to-violet-400/5",
      },
    ],
  },
  {
    id: "tickets",
    label: "Tickets",
    title: "Ticket Handling",
    subtitle: "Issue reporting, tracking, technician assignment, and resolution",
    description:
      "The ticketing module supports structured reporting of maintenance and operational issues. Users can raise incidents, while administrators and technicians collaborate through assignment, status changes, comments, and evidence attachments to ensure accountability and service progress.",
    highlights: [
      "Report issues with location, category, priority, and detailed descriptions",
      "Assign technicians and monitor operational progress clearly",
      "Support comments, discussion history, and collaborative updates",
      "Attach evidence files to improve resolution quality and traceability",
    ],
    cards: [
      {
        title: "Issue Visibility",
        text: "Users can raise concerns in a structured way instead of relying on informal communication.",
        color: "from-amber-500/20 to-amber-400/5",
      },
      {
        title: "Support Coordination",
        text: "Admins and technicians operate through clearer assignment and status management.",
        color: "from-cyan-500/20 to-cyan-400/5",
      },
      {
        title: "Resolution Tracking",
        text: "Every update becomes visible through comments, notes, and ticket progress history.",
        color: "from-pink-500/20 to-pink-400/5",
      },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    title: "Notifications",
    subtitle: "Real-time awareness of important actions across the system",
    description:
      "The notification layer keeps users informed about relevant events across bookings, tickets, and workflow activity. It improves responsiveness by making important updates visible without requiring users to manually check every page repeatedly.",
    highlights: [
      "Unread notification counts improve awareness of pending actions",
      "Users receive updates on bookings, ticket comments, and workflow decisions",
      "Notifications support faster response to operational changes",
      "The interface provides a clean, interactive dropdown experience for updates",
    ],
    cards: [
      {
        title: "Instant Awareness",
        text: "Users stay informed about important changes as they happen within the platform.",
        color: "from-orange-500/20 to-orange-400/5",
      },
      {
        title: "Workflow Continuity",
        text: "Notifications reduce missed approvals, comments, and status changes.",
        color: "from-blue-500/20 to-blue-400/5",
      },
      {
        title: "Responsive Experience",
        text: "A clear notification UI helps users react quickly to operational updates.",
        color: "from-emerald-500/20 to-emerald-400/5",
      },
    ],
  },
];

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("resources");
  const sectionRefs = useRef({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry?.target?.id) {
          setActiveTab(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: 0.15,
      }
    );

    const refs = sectionRefs.current;
    Object.values(refs).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const section = sectionRefs.current[id];
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Smart Campus" className="h-14 w-14 object-contain" />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-orange-400">
                Smart Campus
              </p>
              <h1 className="text-xl font-semibold text-slate-50">
                Operations Hub
              </h1>
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {tabSections.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.25)]"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-2xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-2xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition hover:bg-orange-600"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-4 lg:hidden">
          {tabSections.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="space-y-8"
          >
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-orange-300">
                Campus Resource, Booking & Support Platform
              </span>

              <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                Manage campus resources, bookings, support, and operations from one intelligent platform.
              </h2>

              <p className="max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
                Smart Campus Operations Hub helps institutions organize academic
                facilities, track service workflows, manage operational requests,
                and improve communication through one connected digital environment.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(249,115,22,0.28)] transition hover:scale-[1.02] hover:bg-orange-600"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                Sign In
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Resources", "Manage halls, labs, spaces, and equipment"],
                ["Bookings", "Handle request, approval, and time-slot workflows"],
                ["Tickets", "Track issues, maintenance, and support actions"],
              ].map(([title, text]) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5"
                >
                  <p className="text-sm font-semibold text-slate-100">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/70 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
              <div className="relative h-[460px] overflow-hidden rounded-[26px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <motion.h3
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.45 }}
                        className="text-2xl font-semibold text-white"
                      >
                        {slides[currentSlide].title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32, duration: 0.45 }}
                        className="mt-3 max-w-xl text-sm leading-6 text-slate-200"
                      >
                        {slides[currentSlide].subtitle}
                      </motion.p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentSlide === index
                        ? "w-10 bg-orange-500"
                        : "w-2.5 bg-slate-600 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-6 space-y-8">
          {tabSections.map((section, sectionIndex) => (
            <motion.section
              key={section.id}
              id={section.id}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, delay: sectionIndex * 0.05 }}
              className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 md:p-8"
            >
              <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-orange-400">
                      {section.label}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold text-white">
                      {section.title}
                    </h3>
                    <p className="mt-2 text-lg text-slate-300">
                      {section.subtitle}
                    </p>
                    <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-400">
                      {section.description}
                    </p>
                  </motion.div>

                  <div className="mt-6 grid gap-4">
                    {section.highlights.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/50 px-5 py-4"
                      >
                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
                        <p className="text-sm leading-7 text-slate-300">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  {section.cards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -6, scale: 1.01 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`rounded-[28px] border border-slate-800 bg-gradient-to-br ${card.color} p-6`}
                    >
                      <div className="rounded-[22px] bg-slate-950/60 p-5">
                        <h4 className="text-lg font-semibold text-slate-50">
                          {card.title}
                        </h4>
                        <p className="mt-3 text-sm leading-7 text-slate-300">
                          {card.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid gap-5 md:grid-cols-3"
          >
            {[
              {
                title: "Role-Based Access",
                text: "Different users interact with the system through structured, role-aware dashboards and workflows.",
              },
              {
                title: "Connected Operations",
                text: "Resource usage, bookings, issue resolution, and notifications all work together in one ecosystem.",
              },
              {
                title: "Professional Experience",
                text: "Modern design, interactive transitions, and clear structure make the system easier to use and present.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -5 }}
                className="rounded-[28px] border border-slate-800 bg-slate-900/60 p-6"
              >
                <h4 className="text-lg font-semibold text-slate-50">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <footer className="mt-10 border-t border-slate-800 bg-slate-950/90">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-4">
              <img src={logo} alt="Smart Campus" className="h-12 w-12 object-contain" />
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  Smart Campus Operations Hub
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  A centralized platform for campus resources, booking workflows,
                  maintenance handling, and operational visibility.
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-100">Quick Links</p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>
                <Link to="/login" className="hover:text-orange-400">
                  Login
                </Link>
              </p>
              <p>
                <Link to="/register" className="hover:text-orange-400">
                  Register
                </Link>
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-100">Modules</p>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>Resources</p>
              <p>Bookings</p>
              <p>Tickets</p>
              <p>Notifications</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
          © 2026 Smart Campus Operations Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;