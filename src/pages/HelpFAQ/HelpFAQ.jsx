import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_CATEGORIES = ["Getting Started", "Reporting", "Tracking", "Account"];

const FAQS = [
  {
    category: "Getting Started",
    question: "What is Problem Mapper?",
    answer:
      "It's a platform where citizens in Karachi, Lahore, Hyderabad, and Faisalabad report civic issues — electricity, water, and garbage problems — with a location and photo. Our AI groups nearby similar reports so authorities can fix the root problem instead of one ticket at a time.",
  },
  {
    category: "Getting Started",
    question: "Do I need an account to report an issue?",
    answer:
      "Yes, you need to register and log in before submitting a complaint. This lets you track its status later and see it in your complaint history.",
  },
  {
    category: "Reporting",
    question: "What kind of issues can I report?",
    answer:
      "Currently three categories: Electricity, Water, and Garbage. Pick the closest match when submitting — it helps our clustering group your report accurately.",
  },
  {
    category: "Reporting",
    question: "Is a photo required?",
    answer:
      "A photo isn't strictly required, but it helps verify the issue and speeds up review. We recommend attaching one whenever possible.",
  },
  {
    category: "Reporting",
    question: "How does the AI clustering work?",
    answer:
      "We use an algorithm called DBSCAN that looks at the location and category of nearby complaints. If enough similar reports appear close together, they're grouped into one cluster so it's treated as a single, higher-priority issue.",
  },
  {
    category: "Tracking",
    question: "How do I check my complaint's status?",
    answer:
      "Go to the Track Complaint page and enter your complaint ID, which you can find in your profile under your complaint history. Status moves from Pending to In Progress to Resolved.",
  },
  {
    category: "Tracking",
    question: "How long does resolution usually take?",
    answer:
      "It depends on the issue and how many other reports are grouped with it. Clustered issues with more reports are generally prioritized faster.",
  },
  {
    category: "Account",
    question: "I forgot my password. What do I do?",
    answer:
      "Use the password reset option on the login screen. If you're still stuck, reach out through the Contact page and we'll help you regain access.",
  },
  {
    category: "Account",
    question: "Can I edit or delete a complaint after submitting it?",
    answer:
      "Reach out via Contact with your complaint ID if you need something corrected or removed — our team can update it on your behalf.",
  },
];

export default function HelpFAQ() {
  const [activeCategory, setActiveCategory] = useState("Getting Started");
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return FAQS.filter((f) => {
      const matchesCategory = term ? true : f.category === activeCategory;
      const matchesSearch = term
        ? f.question.toLowerCase().includes(term) ||
          f.answer.toLowerCase().includes(term)
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-bg">
      {/* 1. Header + search */}
      <section className="pt-28 pb-10 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-text-muted mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Help / FAQ
          </span>
          <h1 className="font-[Sora] text-3xl md:text-5xl font-semibold text-text-dark mb-3">
            Questions, answered
          </h1>
          <p className="text-text-muted max-w-xl mx-auto mb-8">
            Everything about reporting, tracking, and how the clustering works.
          </p>
        </motion.div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a question…"
          className="w-full max-w-md mx-auto block rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-text-dark outline-none focus:ring-2 focus:ring-pribg-primary"
        />
      </section>

      {/* 2. Category tabs */}
      {!search.trim() && (
        <section className="px-6 md:px-12 max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "glass text-text-muted hover:text-text-dark"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 3. FAQ accordion */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
        <div className="glass rounded-2xl divide-y divide-white/40 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-text-muted">
              No questions match "{search}".
            </p>
          ) : (
            filtered.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={faq.question}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/40 transition-colors"
                  >
                    <span className="font-medium text-text-dark">
                      {faq.question}
                    </span>
                    <span
                      className={`text-pribg-primary shrink-0 transition-transform ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-sm text-text-muted">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. Clustering explainer */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
        <div className="rounded-2xl bg-textext-text-dark text-white p-8 flex items-center gap-6 justify-between">
          <div>
            <h2 className="font-[Sora] text-lg font-semibold mb-2">
              Still curious how clustering works?
            </h2>
            <p className="text-white/70 text-sm">
              See it explained visually on the Community Insights page.
            </p>
          </div>
          <a
            href="/community"
            className="px-5 py-2.5 rounded-full bg-white text-text-dark font-medium hover:bg-white/90 transition-colors shrink-0"
          >
            View Insights
          </a>
        </div>
      </section>

      {/* 5. Quick links */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
        <h2 className="font-[Sora] text-xl font-semibold text-text-dark mb-4">
          Quick links
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Report an Issue", href: "/report" },
            { label: "Track Complaint", href: "/track-complaint" },
            { label: "How It Works", href: "/how-it-works" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="glass rounded-2xl p-5 text-center font-medium text-text-dark hover:bg-white/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* 6. Community guideline note */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
        <div className="glass rounded-2xl p-6 text-sm text-text-muted">
          <span className="font-medium text-text-dark">A quick note: </span>
          Please only submit genuine civic issues with accurate locations.
          Misleading reports slow down real fixes for your community.
        </div>
      </section>

      {/* 7. Didn't find answer prompt */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-[Sora] text-lg font-semibold text-text-dark mb-1">
              Still stuck?
            </h3>
            <p className="text-sm text-text-muted">
              Send us a message and we'll walk you through it.
            </p>
          </div>
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary transition-colors shrink-0"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24 text-center">
        <h2 className="font-[Sora] text-2xl font-semibold text-text-dark mb-3">
          Ready to report something?
        </h2>
        <a
          href="/report"
          className="inline-block px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        >
          Report an Issue
        </a>
      </section>
    </div>
  );
}
