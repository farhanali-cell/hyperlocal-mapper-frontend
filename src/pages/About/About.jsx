// frontend/src/pages/About/About.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const IMPACT_STATS = [
  { value: "4", label: "Cities Covered" },
  { value: "AI", label: "Powered Clustering" },
  { value: "24/7", label: "Reporting Access" },
  { value: "100%", label: "Citizen Driven" },
];

const APPROACH = [
  {
    title: "Report",
    desc: "Citizens complaint submit karte hain location + image ke sath — koi login-heavy process nahi, seedha simple form.",
    color: "#364fc7",
  },
  {
    title: "Cluster",
    desc: "DBSCAN clustering se similar location aur category ke reports automatically group ho jate hain — duplicate noise khatam.",
    color: "#0d9488",
  },
  {
    title: "Resolve",
    desc: "Admins ko priority-ranked dashboard milta hai — jahan zyada log affected hain wahan pehle action.",
    color: "#e2543f",
  },
];

const CITIES = [
  { name: "Karachi", note: "Largest coverage area, highest report volume" },
  { name: "Lahore", note: "Rapid urban growth, infrastructure focus" },
  { name: "Hyderabad", note: "Water & sewerage priority zone" },
  { name: "Faisalabad", note: "Industrial area civic issues" },
];

const VALUES = [
  ["Transparency", "Har report ka status public trackable hai"],
  [
    "Data over noise",
    "AI clustering se sirf real, repeated issues highlight hote hain",
  ],
  [
    "Accessibility",
    "Koi bhi citizen, kahin se bhi, bina complexity ke report kar sake",
  ],
];

export default function About() {
  return (
    <div className="bg-bg text-text-dark font-['Inter']">
      {/* 1. HERO */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-text-muted mb-6"
        >
          <span className="relative inline-flex w-2.5 h-2.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping bg-primary"
            />
            <span
              className="relative inline-flex rounded-full h-full w-full bg-primary"
            />
          </span>
          Humare baare mein
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-['Sora'] font-bold text-4xl md:text-6xl leading-tight max-w-3xl mx-auto"
        >
          Har Shikayat, <span className="text-primary">Ek Signal</span> Hai
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-lg text-text-muted max-w-2xl mx-auto"
        >
          Hyperlocal Problem Mapper ek civic-tech platform hai jo Pakistan ke
          shehron mein bijli, paani, sadak aur safai ke masail ko AI ki madad se
          cluster aur prioritize karta hai — taake har complaint sirf ek form
          entry na rahe, balke actionable data bane.
        </motion.p>
      </section>

      {/* 2. WHY WE BUILT THIS */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12">
          <h2 className="font-['Sora'] font-semibold text-2xl mb-4">
            Ye Kyun Banaya?
          </h2>
          <p className="text-text-muted leading-relaxed">
            Pakistan ke shehron mein civic complaints aksar scattered social
            media posts, WhatsApp groups, ya verbal complaints tak mehdood reh
            jati hain — koi central record nahi, koi pattern visible nahi.
            Nateeja: sabse zyada affected areas identify hi nahi ho pate, aur
            resources galat jagah allocate hote hain. Hum ne ye platform banaya
            taake individual complaints se, AI clustering ke zariye, city-wide
            priority insights nikal sakein — jahan sabse zyada log affected
            hain, wahan pehle dhyan jaye.
          </p>
        </div>
      </section>

      {/* 3. OUR APPROACH */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Sora'] font-semibold text-2xl text-center mb-10">
            Hamara Approach
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {APPROACH.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <span
                  className="inline-flex w-10 h-10 rounded-xl items-center justify-center font-mono font-bold mb-4"
                  style={{
                    backgroundColor: `${step.color}1A`,
                    color: step.color,
                  }}
                >
                  0{i + 1}
                </span>
                <h3 className="font-['Sora'] font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. IMPACT STATS */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto glass rounded-3xl py-10 px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <p
                className="font-mono font-bold text-3xl bg-primary"
              >
                {stat.value}
              </p>
              <p className="text-sm text-text-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CITIES WE COVER */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Sora'] font-semibold text-2xl text-center mb-10">
            Shehar Jahan Hum Kaam Kar Rahe Hain
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-2xl p-5"
              >
                <p className="font-['Sora'] font-semibold">{city.name}</p>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  {city.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. VALUES + CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-['Sora'] font-semibold text-2xl mb-10">
            Jo Cheezein Humein Guide Karti Hain
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left mb-14">
            {VALUES.map(([title, desc]) => (
              <div key={title} className="glass rounded-2xl p-6">
                <p className="font-medium mb-1">{title}</p>
                <p className="text-sm text-text-muted">{desc}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-3xl p-10">
            <h3 className="font-['Sora'] font-semibold text-xl mb-2">
              Aap Bhi Hissa Banein
            </h3>
            <p className="text-text-muted mb-6">
              Apne shehar ka masla report karein — chota sa kaam, bara farq.
            </p>
            <Link
              to="/report-issue"
              className="inline-block px-6 py-3 rounded-xl text-white font-medium bg-primary"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
