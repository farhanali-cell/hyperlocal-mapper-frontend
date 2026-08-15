import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// ---------- Small reusable bits ----------

const PulsePin = ({ size = 14, color = "#2F6FED" }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span
      className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
      style={{ backgroundColor: color }}
    />
    <span
      className="relative inline-flex rounded-full h-full w-full border-2 border-white shadow-md"
      style={{ backgroundColor: color }}
    />
  </span>
);

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

// ---------- Section 1: Hero ----------

const HeroSection = () => (
  <section className="relative overflow-hidden bg-[#F5F8FC] pt-36 pb-24 px-6">
    {/* soft ambient glow */}
    <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#2F6FED]/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#14B8A6]/10 blur-3xl" />

    <div className="relative max-w-4xl mx-auto text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-sm font-['Inter'] text-[#5B6B85]"
      >
        <PulsePin size={10} />
        From street to solution
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={1}
        className="font-['Sora'] font-bold text-4xl md:text-6xl leading-tight text-[#0F1729]"
      >
        How a complaint becomes
        <span className="text-[#2F6FED]"> a resolved problem</span>
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={2}
        className="font-['Inter'] text-[#5B6B85] text-lg mt-6 max-w-2xl mx-auto"
      >
        Every pin you drop on the map moves through four clear stages —
        from your report, to AI clustering, to admin action, to a problem
        that's actually fixed.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={3}
        className="mt-8"
      >
        <a
          href="#process"
          className="font-['Inter'] font-medium text-[#2F6FED] inline-flex items-center gap-2 hover:gap-3 transition-all"
        >
          See the four steps
          <span aria-hidden>↓</span>
        </a>
      </motion.div>
    </div>
  </section>
);

// ---------- Section 2: Process timeline ----------

const steps = [
  {
    n: "01",
    title: "You report it",
    desc: "Drop a pin on the map, attach a photo, add a short description. Takes under a minute.",
    color: "#2F6FED",
  },
  {
    n: "02",
    title: "AI clusters it",
    desc: "DBSCAN groups your report with nearby similar complaints, so ten people reporting the same broken streetlight becomes one prioritized issue.",
    color: "#14B8A6",
  },
  {
    n: "03",
    title: "Admin reviews it",
    desc: "City admins see clusters ranked by density and severity on a live dashboard, and assign action.",
    color: "#FF6B4A",
  },
  {
    n: "04",
    title: "You track it",
    desc: "Status updates flow back to everyone who reported — from Submitted to Resolved.",
    color: "#2F6FED",
  },
];

const ProcessSection = () => (
  <section id="process" className="relative bg-white py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="font-['Sora'] font-bold text-3xl md:text-4xl text-[#0F1729] text-center mb-4"
      >
        The four-step route
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        custom={1}
        className="font-['Inter'] text-[#5B6B85] text-center mb-16 max-w-xl mx-auto"
      >
        Same route, every time — like a pin travelling across the map.
      </motion.p>

      <div className="relative">
        {/* connecting route line */}
        <div className="hidden md:block absolute top-8 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2F6FED] via-[#14B8A6] to-[#FF6B4A] opacity-30" />

        <div className="grid md:grid-cols-4 gap-10 md:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              custom={i}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-5">
                <PulsePin size={18} color={s.color} />
              </div>
              <span
                className="font-['JetBrains_Mono'] text-xs tracking-widest mb-2"
                style={{ color: s.color }}
              >
                {s.n}
              </span>
              <h3 className="font-['Sora'] font-semibold text-lg text-[#0F1729] mb-2">
                {s.title}
              </h3>
              <p className="font-['Inter'] text-sm text-[#5B6B85] leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ---------- Section 3: AI clustering explainer ----------

const dots = [
  { x: 20, y: 30 }, { x: 26, y: 22 }, { x: 32, y: 34 }, // cluster A
  { x: 70, y: 60 }, { x: 76, y: 68 }, { x: 66, y: 72 }, { x: 74, y: 55 }, // cluster B
  { x: 45, y: 15 }, // noise point
];

const ClusteringSection = () => (
  <section className="relative bg-[#F5F8FC] py-24 px-6 overflow-hidden">
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        <span className="font-['JetBrains_Mono'] text-xs tracking-widest text-[#14B8A6]">
          THE AI MODULE
        </span>
        <h2 className="font-['Sora'] font-bold text-3xl md:text-4xl text-[#0F1729] mt-3 mb-5">
          Density, not duplicates
        </h2>
        <p className="font-['Inter'] text-[#5B6B85] leading-relaxed mb-4">
          We use DBSCAN clustering to group complaints that are close in
          both location and time. Instead of an admin scrolling through
          200 duplicate reports of the same pothole, they see one cluster
          — with a size, a severity score, and every photo attached.
        </p>
        <p className="font-['Inter'] text-[#5B6B85] leading-relaxed">
          A single stray report far from everything else stays its own
          case — nothing gets lost, and nothing gets buried either.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        custom={1}
        className="relative glass rounded-2xl p-6 h-72"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* cluster A ring */}
          <circle cx="26" cy="29" r="14" fill="#2F6FED" fillOpacity="0.08" stroke="#2F6FED" strokeOpacity="0.3" strokeDasharray="3 2" />
          {/* cluster B ring */}
          <circle cx="72" cy="64" r="15" fill="#14B8A6" fillOpacity="0.08" stroke="#14B8A6" strokeOpacity="0.3" strokeDasharray="3 2" />

          {dots.map((d, i) => {
            const isNoise = i === 7;
            const color = isNoise ? "#5B6B85" : i < 3 ? "#2F6FED" : "#14B8A6";
            return (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={isNoise ? 1.4 : 1.8}
                fill={color}
              />
            );
          })}
        </svg>
        <div className="absolute bottom-4 left-6 font-['JetBrains_Mono'] text-xs text-[#5B6B85]">
          2 clusters · 1 unclustered report
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------- Section 4: Roles ----------

const roles = [
  {
    title: "As a citizen",
    color: "#2F6FED",
    items: [
      "Report an issue in under a minute",
      "See it grouped with others nearby",
      "Track status from your Profile",
      "Get notified when it's resolved",
    ],
  },
  {
    title: "As an admin",
    color: "#FF6B4A",
    items: [
      "View clusters ranked by priority",
      "Filter by city and category",
      "Assign and update complaint status",
      "Generate reports for city records",
    ],
  },
];

const RolesSection = () => (
  <section className="bg-white py-24 px-6">
    <div className="max-w-4xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="font-['Sora'] font-bold text-3xl md:text-4xl text-[#0F1729] text-center mb-14"
      >
        Two sides of the same map
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((r, i) => (
          <motion.div
            key={r.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={i}
            className="glass rounded-2xl p-8"
          >
            <h3
              className="font-['Sora'] font-semibold text-xl mb-5"
              style={{ color: r.color }}
            >
              {r.title}
            </h3>
            <ul className="space-y-3">
              {r.items.map((item) => (
                <li key={item} className="flex items-start gap-3 font-['Inter'] text-[#0F1729] text-sm">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ---------- Section 5: Live example walkthrough ----------

const timeline = [
  { label: "Submitted", time: "09:14", done: true },
  { label: "Clustered", time: "09:16", done: true },
  { label: "In review", time: "11:40", done: true },
  { label: "Resolved", time: "—", done: false },
];

const ExampleSection = () => (
  <section className="bg-[#F5F8FC] py-24 px-6">
    <div className="max-w-2xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="font-['Sora'] font-bold text-3xl md:text-4xl text-[#0F1729] text-center mb-4"
      >
        A report in motion
      </motion.h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        custom={1}
        className="font-['Inter'] text-[#5B6B85] text-center mb-12"
      >
        A broken streetlight reported in Gulshan-e-Iqbal, Karachi.
      </motion.p>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        custom={2}
        className="glass rounded-2xl p-8"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h4 className="font-['Sora'] font-semibold text-[#0F1729]">Streetlight Recovery</h4>
            <p className="font-['Inter'] text-sm text-[#5B6B85]">Cluster of 6 reports · Block 4</p>
          </div>
          <span className="font-['JetBrains_Mono'] text-xs bg-[#FF6B4A]/10 text-[#FF6B4A] px-3 py-1 rounded-full">
            High priority
          </span>
        </div>

        <div className="space-y-0">
          {timeline.map((t, i) => (
            <div key={t.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`h-3 w-3 rounded-full ${
                    t.done ? "bg-[#14B8A6]" : "border-2 border-[#5B6B85]/30"
                  }`}
                />
                {i < timeline.length - 1 && (
                  <span className="w-[2px] h-10 bg-[#5B6B85]/15" />
                )}
              </div>
              <div className="pb-8 -mt-0.5">
                <p className="font-['Inter'] text-sm font-medium text-[#0F1729]">{t.label}</p>
                <p className="font-['JetBrains_Mono'] text-xs text-[#5B6B85]">{t.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------- Section 6: FAQ + CTA ----------

const faqs = [
  {
    q: "Do I need an account to report an issue?",
    a: "Yes — a quick registration lets us tie your reports to your profile so you can track status and get notified.",
  },
  {
    q: "What happens if my report is a duplicate?",
    a: "It isn't wasted — it strengthens an existing cluster, which raises that issue's priority for admins.",
  },
  {
    q: "How long until something is resolved?",
    a: "It depends on severity and cluster size. High-priority clusters are surfaced to admins first.",
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#0F1729]/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex justify-between items-center py-5 text-left font-['Inter'] font-medium text-[#0F1729]"
      >
        {q}
        <span className={`transition-transform text-[#2F6FED] ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="font-['Inter'] text-sm text-[#5B6B85] pb-5 pr-8"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
};

const FAQCTASection = () => (
  <section className="bg-white py-24 px-6">
    <div className="max-w-2xl mx-auto">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="font-['Sora'] font-bold text-3xl text-[#0F1729] text-center mb-10"
      >
        Common questions
      </motion.h2>

      <div className="mb-16">
        {faqs.map((f) => (
          <FAQItem key={f.q} {...f} />
        ))}
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
        className="relative rounded-2xl bg-[#0F1729] text-center py-14 px-8 overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#2F6FED]/20 blur-3xl" />
        <div className="relative">
          <div className="flex justify-center mb-5">
            <PulsePin size={16} color="#14B8A6" />
          </div>
          <h3 className="font-['Sora'] font-bold text-2xl md:text-3xl text-white mb-3">
            See something that needs fixing?
          </h3>
          <p className="font-['Inter'] text-white/60 mb-8">
            It takes less than a minute to put it on the map.
          </p>
          <Link
            to="/report-issue"
            className="inline-block font-['Inter'] font-medium bg-[#2F6FED] hover:bg-[#2F6FED]/90 text-white px-8 py-3 rounded-full transition-colors"
          >
            Report an Issue
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

// ---------- Page ----------

const HowItWorks = () => {
  return (
    <div>
      <HeroSection />
      <ProcessSection />
      <ClusteringSection />
      <RolesSection />
      <ExampleSection />
      <FAQCTASection />
    </div>
  );
};

export default HowItWorks;