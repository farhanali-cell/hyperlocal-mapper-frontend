import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cities = [
  {
    name: "Karachi",
    complaints: "4,820",
    resolved: "89%",
    note: "Sabse zyada active reporting — traffic aur waste management top categories.",
  },
  {
    name: "Lahore",
    complaints: "3,210",
    resolved: "91%",
    note: "Streetlight aur road damage complaints mein sabse tez resolution.",
  },
  {
    name: "Hyderabad",
    complaints: "1,140",
    resolved: "84%",
    note: "Water supply issues par community sabse active hai.",
  },
  {
    name: "Faisalabad",
    complaints: "980",
    resolved: "86%",
    note: "Industrial waste complaints mein tezi se izafa dekha gaya.",
  },
];

const steps = [
  {
    title: "Report",
    desc: "Location aur image ke sath apni complaint chand seconds mein submit karein.",
  },
  {
    title: "Cluster",
    desc: "AI (DBSCAN) automatically similar complaints ko area-wise group karta hai.",
  },
  {
    title: "Resolve",
    desc: "Admin priority-based dashboard se sabse zaroori issues pehle solve karta hai.",
  },
];

const features = [
  {
    title: "AI-Powered Clustering",
    desc: "DBSCAN algorithm nearby complaints ko automatically identify karta hai, taake ek hi masla baar baar report na ho.",
  },
  {
    title: "Priority Dashboard",
    desc: "Admins ko cluster size aur severity ke hisaab se sorted, actionable view milta hai.",
  },
  {
    title: "Live Complaint Map",
    desc: "Har complaint real-time map par dikhti hai — apne shehar ka pura civic health-check dekhein.",
  },
  {
    title: "Transparent Tracking",
    desc: "Har citizen apni complaint ka status — submitted, in-progress, resolved — track kar sakta hai.",
  },
];

const activityFeed = [
  { text: "Pothole reported near Gulshan-e-Iqbal, Karachi", time: "5 min ago" },
  {
    text: "Streetlight cluster marked High Priority in DHA, Lahore",
    time: "22 min ago",
  },
  { text: "Water leakage resolved in Latifabad, Hyderabad", time: "1 hr ago" },
  {
    text: "Waste dumping complaint escalated in Madina Town, Faisalabad",
    time: "3 hrs ago",
  },
];

const testimonials = [
  {
    quote:
      "Maine apne mohalle ki broken streetlight report ki thi — 3 din mein fix ho gayi.",
    name: "Ayesha, Lahore",
  },
  {
    quote:
      "Pehli baar laga ke civic complaints ka koi proper record aur follow-up hota hai.",
    name: "Bilal, Karachi",
  },
  {
    quote:
      "Cluster dashboard ki wajah se authorities ko pata chal gaya ke ye masla akela nahi tha.",
    name: "Sana, Hyderabad",
  },
];

// The 4 background videos cycled in the hero.
// Drop matching .mp4 files into frontend/public/videos/ with these exact names.
const heroVideos = [
  {
    src: "/videos/electricity-maintenance.mp4",
    label: "Electricity Maintenance",
  },
  {
    src: "/videos/water-sewerage.mp4",
    label: "Water & Sewerage Work",
  },
  {
    src: "/videos/streetlight-recovery.mp4",
    label: "Streetlight Recovery",
  },
  {
    src: "/videos/waste-cleaning.mp4",
    label: "Waste Cleaning",
  },
];

function useAnimatedCounter(target, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {};
  }, [target, duration]);

  return value;
}

function StatCard({ label, target, suffix = "" }) {
  const count = useAnimatedCounter(target);
  return (
    <motion.div
      variants={fadeUp}
      className="glass rounded-2xl border border-white/40 px-6 py-8 text-center"
    >
      <p className="font-mono text-4xl font-bold text-text-dark">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-text-muted">{label}</p>
    </motion.div>
  );
}

function CitiesCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cities.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const city = cities[index];

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="glass overflow-hidden rounded-3xl border border-white/40 px-8 py-10 shadow-lg shadow-slate-200/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={city.name}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 className="font-display text-3xl font-bold text-text-dark">
              {city.name}
            </h3>
            <p className="mt-3 text-sm text-text-muted">{city.note}</p>

            <div className="mt-6 flex gap-8">
              <div>
                <p className="font-mono text-2xl font-bold text-primary">
                  {city.complaints}
                </p>
                <p className="text-xs text-text-muted">Complaints filed</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-secondary">
                  {city.resolved}
                </p>
                <p className="text-xs text-text-muted">Resolution rate</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {cities.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setIndex(i)}
            aria-label={`Show ${c.name}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-primary" : "w-2 bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * LiveMapHero — full-screen hero that cycles through 4 background videos
 * (electricity maintenance, water/sewerage, streetlight recovery, waste
 * cleaning) with a smooth crossfade and a light gradient overlay just
 * enough to keep the heading readable, while keeping the footage itself
 * clearly visible.
 *
 * Video files expected at: frontend/public/videos/<name>.mp4
 * If a file is missing, that slide just shows the dark background —
 * nothing breaks.
 */
function LiveMapHero() {
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-text-dark pt-20">
      {/* Video layer with crossfade */}
      <AnimatePresence mode="wait">
        <motion.video
          key={heroVideos[videoIndex].src}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={heroVideos[videoIndex].src} type="video/mp4" />
        </motion.video>
      </AnimatePresence>

      {/* Light gradient overlay — just enough for text readability, video stays clear */}
      <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/15 to-black/55" />

      {/* Foreground content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative z-10 mx-auto max-w-2xl px-6 text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
          </span>
          <span className="text-xs font-medium text-white/80">
            Tracking complaints in real time
          </span>
        </div>

        <h2 className="font-display text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
          Har complaint, ek dhadakti hui pin.
        </h2>
        <p className="mt-3 text-sm text-white/80 drop-shadow">
          Karachi se Faisalabad tak — apne shehar ka live civic pulse dekhein.
        </p>

        {/* Current category label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={heroVideos[videoIndex].label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mt-5 font-mono text-xs uppercase tracking-widest text-secondary drop-shadow"
          >
            {heroVideos[videoIndex].label}
          </motion.p>
        </AnimatePresence>

        {/* Progress dots for the 4 video categories */}
        <div className="mt-4 flex justify-center gap-2">
          {heroVideos.map((v, i) => (
            <button
              key={v.src}
              onClick={() => setVideoIndex(i)}
              aria-label={`Show ${v.label}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === videoIndex ? "w-6 bg-secondary" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="w-full bg-bg font-body text-text-dark">
      {/* ===== SECTION 1: Live Map Hero (rotating background videos) ===== */}
      <LiveMapHero />

      {/* ===== SECTION 2: Headline / Intro ===== */}
      <section className="relative overflow-hidden py-24">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <h1 className="font-display text-5xl font-extrabold leading-[1.1] text-text-dark sm:text-6xl">
            Apne shehar ki <span className="text-primary">awaaz</span> ban
            jaiye.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-text-muted">
            AI-powered civic complaint platform — complaint report karein,
            similar issues clusters mein group hon, aur admin priority ke saath
            resolve karein.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/report-issue"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
            >
              Report an Issue
            </Link>
            <Link
              to="/live-map"
              className="rounded-full glass border border-white/40 px-8 py-3.5 text-sm font-semibold text-text-dark transition hover:bg-white/70"
            >
              Explore Live Map
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 3: Problem Statement ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="mx-auto max-w-5xl px-6 py-24 text-center"
      >
        <h2 className="font-display text-3xl font-bold text-text-dark sm:text-4xl">
          Civic problems, bikhri hui shikayatein.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted">
          Roz hazaron log apne shehar ke masail — potholes, streetlights, water
          leakage — alag alag jagah report karte hain, jahan koi bhi pattern ya
          priority dikhai nahi deti. Result: sabse zaroori issues bhi kho jate
          hain.
        </p>
      </motion.section>

      {/* ===== SECTION 4: How It Works Preview ===== */}
      <section className="bg-white/50 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-5xl px-6 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-text-dark sm:text-4xl">
            Teen simple steps.
          </h2>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-8 px-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl border border-white/40 p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold text-text-dark">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 5: Live Stats ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
        className="mx-auto max-w-5xl px-6 py-24"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard label="Complaints filed" target={12480} suffix="+" />
          <StatCard label="Clusters resolved" target={860} suffix="+" />
          <StatCard label="Active cities" target={4} />
        </div>
      </motion.section>

      {/* ===== SECTION 6: Features Grid ===== */}
      <section className="bg-white/50 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-5xl px-6 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-text-dark sm:text-4xl">
            Platform ki khasoosiyat.
          </h2>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl border border-white/40 p-7 transition-shadow hover:shadow-lg hover:shadow-slate-200/50"
            >
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-text-dark">
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 7: Cities Carousel ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
        className="mx-auto max-w-5xl px-6 py-24 text-center"
      >
        <h2 className="font-display text-3xl font-bold text-text-dark sm:text-4xl">
          Char shehar, ek platform.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-text-muted">
          Karachi, Lahore, Hyderabad, aur Faisalabad — har shehar ki apni
          activity dekhein.
        </p>

        <div className="mt-12">
          <CitiesCarousel />
        </div>
      </motion.section>

      {/* ===== SECTION 8: AI Clustering Explainer ===== */}
      <section className="bg-linear-to-br from-primary to-secondary py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-4xl px-6 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            AI clustering kaise kaam karti hai?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85">
            Jab bhi kai log ek hi area mein similar complaints (jaise "road
            damage") report karte hain, DBSCAN algorithm unhe automatically ek
            cluster mein jama kar deta hai — jitna bara cluster, utni zyada
            priority.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {["Report", "Detect", "Cluster", "Prioritize"].map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <span className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur">
                  {label}
                </span>
                {i < 3 && <span className="text-white/50">→</span>}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 9: Community Insights Preview ===== */}
      <section className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-5xl px-6"
        >
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-text-dark sm:text-4xl">
              Community Insights.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-text-muted">
              Har shehar ke top categories aur resolution trends ek nazar mein.
            </p>
          </div>

          <div className="glass mt-12 rounded-3xl border border-white/40 p-8">
            <div className="overflow-x-auto">
              <div className="flex min-w-105 items-end justify-between gap-3 sm:min-w-0 sm:gap-6">
                {[
                  { label: "Potholes", value: 85 },
                  { label: "Streetlights", value: 62 },
                  { label: "Water", value: 48 },
                  { label: "Waste", value: 70 },
                  { label: "Drainage", value: 35 },
                ].map((bar, i) => (
                  <div
                    key={bar.label}
                    className="flex w-14 shrink-0 flex-col items-center gap-2"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${bar.value * 1.6}px` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.1,
                        ease: "easeOut",
                      }}
                      className="w-full rounded-t-lg bg-linear-to-t from-primary to-secondary"
                    />
                    <span className="text-xs text-text-muted">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/community-insights"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View full Community Insights →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 10: Recent Activity Feed ===== */}
      <section className="bg-white/50 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-3xl px-6"
        >
          <h2 className="text-center font-display text-3xl font-bold text-text-dark sm:text-4xl">
            Live activity.
          </h2>

          <div className="mt-10 space-y-3">
            {activityFeed.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass flex items-center gap-4 rounded-xl border border-white/40 px-5 py-4"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-secondary" />
                <p className="flex-1 text-sm text-text-dark">{item.text}</p>
                <span className="shrink-0 text-xs text-text-muted">
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 11: Testimonials ===== */}
      <section className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto max-w-5xl px-6 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-text-dark sm:text-4xl">
            Citizens ki raye.
          </h2>
        </motion.div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl border border-white/40 p-7"
            >
              <p className="text-sm italic text-text-muted">"{t.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-text-dark">
                — {t.name}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 12: Final CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="relative overflow-hidden py-24"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-text-dark sm:text-4xl">
            Apne shehar ke liye aaj hi report karein.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-text-muted">
            Sirf ek complaint se farq shuru hota hai.
          </p>
          <Link
            to="/report-issue"
            className="mt-8 inline-block rounded-full bg-primary px-10 py-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark"
          >
            Report an Issue
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
