import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import logo from "../assets/logo.png";

const slides = [
  {
    title: "Manage campus resources smoothly",
    subtitle: "Browse, organize, and maintain labs, lecture halls, meeting rooms, and equipment through one centralized platform.",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Track maintenance and support tickets",
    subtitle: "Report issues, assign technicians, monitor progress, and improve service response through a connected support workflow.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Role-based dashboards for every user",
    subtitle: "Users, administrators, and technicians receive focused interfaces tailored to their responsibilities.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1400&q=80",
  },
];

const tabSections = [
  {
    id: "resources",
    label: "Resources",
    title: "Resource Management",
    subtitle: "Centralized control over campus spaces and equipment",
    description: "The resource management module enables the institution to organize lecture halls, laboratories, meeting rooms, and equipment within a single digital platform. It helps users quickly discover available facilities while giving administrators the tools to maintain accurate operational information.",
    highlights: [
      "Maintain a structured catalogue of halls, labs, rooms, and equipment",
      "Store availability windows, capacities, locations, and supporting images",
      "Allow users to browse and search resources with a modern visual experience",
      "Enable administrators to add, update, and remove resources through controlled access",
    ],
    cards: [
      { title: "Smart Discovery", text: "Users can quickly explore available resources using structured listings and search-driven discovery.", color: "from-orange-500/20 to-orange-400/5", accent: "bg-orange-500" },
      { title: "Admin Control", text: "Administrators can keep resource records accurate and operationally useful.", color: "from-sky-500/20 to-sky-400/5", accent: "bg-sky-500" },
      { title: "Operational Clarity", text: "Consistent data helps reduce confusion around availability, suitability, and facility usage.", color: "from-emerald-500/20 to-emerald-400/5", accent: "bg-emerald-500" },
    ],
  },
  {
    id: "bookings",
    label: "Bookings",
    title: "Booking Workflow",
    subtitle: "From request creation to approval and scheduling confidence",
    description: "The booking workflow is designed to manage the entire reservation lifecycle for campus resources. Users can submit requests through an interactive interface, while administrators handle approvals and decisions with visibility into scheduling conflicts and booking history.",
    highlights: [
      "Interactive booking creation experience with resource and time selection",
      "Conflict-aware logic to reduce overlapping reservations",
      "Approval, rejection, and cancellation support through role-based workflows",
      "Booking tracking for users and centralized booking oversight for administrators",
    ],
    cards: [
      { title: "Conflict Awareness", text: "Users receive guidance when time slots are unavailable or already reserved.", color: "from-red-500/20 to-red-400/5", accent: "bg-red-500" },
      { title: "Approval Control", text: "Administrators can review booking requests and make structured decisions.", color: "from-orange-500/20 to-orange-400/5", accent: "bg-orange-500" },
      { title: "Scheduling Confidence", text: "The institution gains more reliable facility usage through visible booking workflows.", color: "from-violet-500/20 to-violet-400/5", accent: "bg-violet-500" },
    ],
  },
  {
    id: "tickets",
    label: "Tickets",
    title: "Ticket Handling",
    subtitle: "Issue reporting, tracking, technician assignment, and resolution",
    description: "The ticketing module supports structured reporting of maintenance and operational issues. Users can raise incidents, while administrators and technicians collaborate through assignment, status changes, comments, and evidence attachments to ensure accountability and service progress.",
    highlights: [
      "Report issues with location, category, priority, and detailed descriptions",
      "Assign technicians and monitor operational progress clearly",
      "Support comments, discussion history, and collaborative updates",
      "Attach evidence files to improve resolution quality and traceability",
    ],
    cards: [
      { title: "Issue Visibility", text: "Users can raise concerns in a structured way instead of relying on informal communication.", color: "from-amber-500/20 to-amber-400/5", accent: "bg-amber-500" },
      { title: "Support Coordination", text: "Admins and technicians operate through clearer assignment and status management.", color: "from-cyan-500/20 to-cyan-400/5", accent: "bg-cyan-500" },
      { title: "Resolution Tracking", text: "Every update becomes visible through comments, notes, and ticket progress history.", color: "from-pink-500/20 to-pink-400/5", accent: "bg-pink-500" },
    ],
  },
  {
    id: "notifications",
    label: "Notifications",
    title: "Notifications",
    subtitle: "Real-time awareness of important actions across the system",
    description: "The notification layer keeps users informed about relevant events across bookings, tickets, and workflow activity. It improves responsiveness by making important updates visible without requiring users to manually check every page repeatedly.",
    highlights: [
      "Unread notification counts improve awareness of pending actions",
      "Users receive updates on bookings, ticket comments, and workflow decisions",
      "Notifications support faster response to operational changes",
      "The interface provides a clean, interactive dropdown experience for updates",
    ],
    cards: [
      { title: "Instant Awareness", text: "Users stay informed about important changes as they happen within the platform.", color: "from-orange-500/20 to-orange-400/5", accent: "bg-orange-500" },
      { title: "Workflow Continuity", text: "Notifications reduce missed approvals, comments, and status changes.", color: "from-blue-500/20 to-blue-400/5", accent: "bg-blue-500" },
      { title: "Responsive Experience", text: "A clear notification UI helps users react quickly to operational updates.", color: "from-emerald-500/20 to-emerald-400/5", accent: "bg-emerald-500" },
    ],
  },
];

const stats = [
  { value: "4", label: "Core Modules" },
  { value: "3", label: "User Roles" },
  { value: "REST", label: "API Architecture" },
  { value: "OAuth2", label: "Authentication" },
];

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("resources");
  const sectionRefs = useRef({});
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((e) => e.isIntersecting);
        if (visibleEntry?.target?.id) setActiveTab(visibleEntry.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0.15 }
    );
    const refs = sectionRefs.current;
    Object.values(refs).forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#020617",
          borderBottom: "1px solid rgba(30,41,59,0.8)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-md" />
              <img src={logo} alt="Smart Campus" className="relative h-14 w-14 object-contain" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
              Smart Campus
            </p>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden items-center gap-1 lg:flex"
          >
            {tabSections.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => scrollToSection(tab.id)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-[0_4px_16px_rgba(249,115,22,0.3)]"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-2"
          >
            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(249,115,22,0.3)] transition hover:bg-orange-600"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile nav */}
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-3 lg:hidden">
          {tabSections.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white"
                  : "border border-slate-700 text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main>
        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[92vh] overflow-hidden">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(249,115,22,0.12),transparent)]" />
            <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-orange-500/5 blur-[100px]" />
            <div className="absolute right-1/4 top-1/2 h-80 w-80 rounded-full bg-sky-500/5 blur-[100px]" />
          </motion.div>

          <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Campus Resource, Booking & Support Platform
              </motion.span>

              <div className="space-y-5">
                <h2 className="text-4xl font-bold leading-[1.15] text-white md:text-5xl xl:text-6xl">
                  Manage campus{" "}
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    resources, bookings
                  </span>{" "}
                  and operations in one place.
                </h2>
                <p className="max-w-xl text-base leading-7 text-slate-400 md:text-lg">
                  Smart Campus Operations Hub helps institutions organize academic facilities, track service workflows, and manage operational requests through one connected digital environment.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(249,115,22,0.3)] transition hover:bg-orange-600 hover:scale-[1.02]"
                >
                  Get Started Free
                  <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  Sign In
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-3 pt-2">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-center"
                  >
                    <p className="text-lg font-bold text-orange-400">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/70 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
                <div className="relative h-[460px] overflow-hidden rounded-[26px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.75 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="mb-3 inline-block rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300"
                        >
                          {["Resource Management", "Maintenance Tracking", "Role-Based Access"][currentSlide]}
                        </motion.div>
                        <motion.h3
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.32 }}
                          className="text-2xl font-semibold text-white"
                        >
                          {slides[currentSlide].title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.42 }}
                          className="mt-2 text-sm leading-6 text-slate-300"
                        >
                          {slides[currentSlide].subtitle}
                        </motion.p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index ? "w-8 bg-orange-500" : "w-2 bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1.5 text-slate-600"
            >
              <span className="text-xs tracking-widest">SCROLL</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        <div className="mx-auto max-w-7xl px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
        </div>

        {/* Feature sections */}
        <section className="mx-auto max-w-7xl space-y-6 px-6 py-16">
          {tabSections.map((section, sectionIndex) => (
            <motion.section
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el; }}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.55, delay: sectionIndex * 0.04 }}
              className="overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/50 transition-all duration-300 hover:border-slate-700"
            >
              <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-900/80 px-8 py-4">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-orange-400">
                  {section.label}
                </span>
                <div className="ml-auto h-px w-16 bg-gradient-to-r from-orange-500/50 to-transparent" />
              </div>

              <div className="grid gap-10 p-8 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white">{section.title}</h3>
                    <p className="mt-2 text-base text-slate-400">{section.subtitle}</p>
                    <p className="mt-4 text-sm leading-7 text-slate-500">{section.description}</p>
                  </div>

                  <div className="space-y-3">
                    {section.highlights.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.07 }}
                        className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/40 px-5 py-3.5 transition hover:border-slate-700 hover:bg-slate-950/60"
                      >
                        <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                        <p className="text-sm leading-6 text-slate-300">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {section.cards.map((card, index) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5, scale: 1.015 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`rounded-[24px] border border-slate-800 bg-gradient-to-br ${card.color} p-1`}
                    >
                      <div className="rounded-[20px] bg-slate-950/70 p-5">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${card.accent}`} />
                          <h4 className="text-base font-semibold text-slate-50">{card.title}</h4>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-400">{card.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[32px] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-900 p-10 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(249,115,22,0.12),transparent)]" />
            <div className="relative space-y-5">
              <h3 className="text-3xl font-bold text-white md:text-4xl">
                Ready to modernize your campus operations?
              </h3>
              <p className="mx-auto max-w-lg text-base text-slate-400">
                Join the platform built for institutions that want clarity, efficiency, and structured workflows.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  to="/register"
                  className="rounded-xl bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(249,115,22,0.35)] transition hover:bg-orange-600 hover:scale-[1.02]"
                >
                  Create an Account
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-700 px-7 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Smart Campus" className="h-10 w-10 object-contain" />
              <p className="text-sm font-semibold text-slate-100">Smart Campus Operations Hub</p>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-500">
              A centralized platform for campus resources, booking workflows, maintenance handling, and operational visibility.
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Quick Links</p>
            <div className="space-y-3 text-sm">
              <p><Link to="/login" className="text-slate-400 transition hover:text-orange-400">Login</Link></p>
              <p><Link to="/register" className="text-slate-400 transition hover:text-orange-400">Register</Link></p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">Modules</p>
            <div className="space-y-3 text-sm text-slate-400">
              {tabSections.map((s) => (
                <p key={s.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(s.id)}
                    className="transition hover:text-orange-400"
                  >
                    {s.label}
                  </button>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-6 py-5 text-center text-xs text-slate-600">
          © 2026 Smart Campus Operations Hub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;