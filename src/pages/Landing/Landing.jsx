// frontend/src/pages/Landing/Landing.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const SOLUTION_STEPS = [
  {
    step: "01",
    title: "Report",
    desc: "Location + photo ke sath, 2 minute mein complaint submit karein.",
    color: "#2F6FED",
  },
  {
    step: "02",
    title: "Cluster",
    desc: "AI (DBSCAN) similar reports ko automatically group karta hai.",
    color: "#14B8A6",
  },
  {
    step: "03",
    title: "Resolve",
    desc: "Priority-ranked dashboard se admins fastest action le sakte hain.",
    color: "#FF6B4A",
  },
];

const CITIES = ["Karachi", "Lahore", "Hyderabad", "Faisalabad"];

const FEATURES = [
  {
    title: "Live Problem Map",
    desc: "Apne shehar ke sab active issues ek interactive map par dekhein.",
    icon: "🗺️",
  },
  {
    title: "Smart Clustering",
    desc: "Duplicate reports noise nahi banate — AI unhe ek signal mein badal deta hai.",
    icon: "🧠",
  },
  {
    title: "Real-time Tracking",
    desc: "Apni complaint ka status submit se resolve tak follow karein.",
    icon: "📍",
  },
  {
    title: "Community Insights",
    desc: "City-wide trends aur most-affected areas ka data dekhein.",
    icon: "📊",
  },
];

export default function Landing() {
  return (
    <div className="bg-[#F5F8FC] text-[#0F1729] font-['Inter'] overflow-hidden">
      {/* 1. HERO */}
      <section className="relative px-6 pt-28 pb-24 md:pt-36 md:pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-[#5B6B85] mb-6"
        >
          <span className="relative inline-flex w-2.5 h-2.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
              style={{ backgroundColor: "#2F6FED" }}
            />
            <span
              className="relative inline-flex rounded-full h-full w-full"
              style={{ backgroundColor: "#2F6FED" }}
            />
          </span>
          Ab live hai — 4 cities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-['Sora'] font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1] max-w-4xl mx-auto"
        >
          Shehar Ke Masail,{" "}
          <span style={{ color: "#2F6FED" }}>AI Ki Nazar Se</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-[#5B6B85] max-w-xl mx-auto"
        >
          Bijli, paani, sadak, safai — har complaint ko location aur AI
          clustering se actionable data mein badal dete hain, taake sabse zyada
          affected areas ko sabse pehle response mile.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex justify-center gap-3 flex-wrap"
        >
          <Link
            to="/report-issue"
            className="px-7 py-3.5 rounded-xl text-white font-medium"
            style={{ backgroundColor: "#2F6FED" }}
          >
            Report an Issue
          </Link>
          <Link
            to="/live-map"
            className="px-7 py-3.5 rounded-xl font-medium glass"
          >
            See Live Map
          </Link>
        </motion.div>
      </section>

      {/* 2. PROBLEM STATEMENT */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-['Sora'] font-semibold text-2xl md:text-3xl mb-5">
            Complaints Kahin Aur Kahin Bikhri Hoti Hain
          </h2>
          <p className="text-[#5B6B85] leading-relaxed">
            WhatsApp groups, random social media posts, phone calls — civic
            issues report to hote hain, lekin ek jagah collect nahi hote. Koi
            pattern visible nahi hota, koi priority nahi banti. Nateeja: sabse
            zyada affected areas identify hi nahi ho pate.
          </p>
        </div>
      </section>

      {/* 3. SOLUTION STEPS */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Sora'] font-semibold text-2xl md:text-3xl text-center mb-12">
            Hum Ye Kaise Solve Karte Hain
          </h2>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {SOLUTION_STEPS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="glass rounded-2xl p-7 relative"
              >
                <span
                  className="font-mono font-bold text-3xl"
                  style={{ color: s.color }}
                >
                  {s.step}
                </span>
                <h3 className="font-['Sora'] font-semibold text-lg mt-3 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[#5B6B85] leading-relaxed">
                  {s.desc}
                </p>
                {i < SOLUTION_STEPS.length - 1 && (
                  <span className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-[#5B6B85]/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CITIES BAND */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto glass rounded-3xl py-10 px-6 text-center">
          <p className="text-sm text-[#5B6B85] mb-6 uppercase tracking-wide font-medium">
            Currently active in
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {CITIES.map((city, i) => (
              <motion.span
                key={city}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="font-['Sora'] font-semibold text-xl md:text-2xl text-[#5B6B85]"
              >
                {city}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURE HIGHLIGHTS */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Sora'] font-semibold text-2xl md:text-3xl text-center mb-12">
            Platform Mein Kya Milega
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-2xl p-6 flex gap-4 items-start"
              >
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <p className="font-['Sora'] font-semibold mb-1">{f.title}</p>
                  <p className="text-sm text-[#5B6B85] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto rounded-3xl px-8 py-14 text-center relative overflow-hidden"
          style={{ backgroundColor: "#0F1729" }}
        >
          <h2 className="font-['Sora'] font-bold text-2xl md:text-4xl text-white mb-4">
            Aapki Awaaz, Shehar Ki Behtari
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Pehla report ab karein — 2 minute lagenge, farq lambe waqt tak
            rahega.
          </p>
          <Link
            to="/report-issue"
            className="inline-block px-8 py-3.5 rounded-xl font-medium"
            style={{ backgroundColor: "#2F6FED", color: "white" }}
          >
            Get Started
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
