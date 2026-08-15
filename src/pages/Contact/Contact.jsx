import { useState } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axios";

const CATEGORIES = [
  { value: "general", label: "General Question" },
  { value: "bug", label: "Report a Bug" },
  { value: "follow_up", label: "Complaint Follow-up" },
  { value: "partnership", label: "Partnership / Media" },
];

const OFFICES = [
  { city: "Karachi", detail: "Main office · Support HQ" },
  { city: "Lahore", detail: "Regional coordination" },
  { city: "Hyderabad", detail: "Field operations" },
  { city: "Faisalabad", detail: "Field operations" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: CATEGORIES[0].value,
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    try {
      await axios.post("/contact/", form);
      setStatus({
        state: "success",
        message: "Message sent — we'll get back to you soon.",
      });
      setForm({ name: "", email: "", category: CATEGORIES[0].value, message: "" });
    } catch (err) {
      console.error("Contact: failed to send message", err);
      setStatus({
        state: "error",
        message: "Couldn't send right now. Please try again in a bit.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* 1. Header */}
      <section className="pt-28 pb-10 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-text-muted mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Contact
          </span>
          <h1 className="font-[Sora] text-3xl md:text-5xl font-semibold text-text-dark mb-3">
            Talk to the team
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Question about a complaint, found a bug, or want to partner with us?
            Send a message — a real person reads every one.
          </p>
        </motion.div>
      </section>

      {/* 2. Form + info grid */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto grid md:grid-cols-5 gap-6 mb-16">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-3 glass rounded-2xl p-6 md:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl input-field px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl input-field px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">
              What's this about?
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-xl input-field px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full rounded-xl input-field px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status.state === "loading"}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {status.state === "loading" ? "Sending…" : "Send Message"}
          </button>

          {status.message && (
            <p
              className={`text-sm ${
                status.state === "success" ? "text-secondary" : "text-alert"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>

        {/* 3. Direct contact info */}
        <div className="md:col-span-2 glass rounded-2xl p-6 md:p-8 space-y-5">
          <div>
            <p className="text-xs text-text-muted mb-1">Email</p>
            <p className="font-medium text-text-dark">
              support@problemmapper.pk
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Response time</p>
            <p className="font-medium text-text-dark">Within 24–48 hours</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Urgent civic issue?</p>
            <p className="text-sm text-text-muted">
              Use{" "}
              <a href="/report-issue" className="text-primary font-medium">
                Report an Issue
              </a>{" "}
              instead — it goes straight into the clustering pipeline.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Offices by city */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <h2 className="font-[Sora] text-xl font-semibold text-text-dark mb-4">
          Where we operate
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {OFFICES.map((office) => (
            <div key={office.city} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <p className="font-medium text-text-dark">{office.city}</p>
              </div>
              <p className="text-sm text-text-dark">{office.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Track existing complaint prompt */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-[Sora] text-lg font-semibold text-text-dark mb-1">
              Already reported something?
            </h3>
            <p className="text-sm text-text-muted">
              Check its status instead of waiting on an email reply.
            </p>
          </div>
          <a
            href="/track-complaint"
            className="px-5 py-2.5 rounded-full glass text-text-dark font-medium hover:bg-white/70 transition-colors shrink-0"
          >
            Track Complaint
          </a>
        </div>
      </section>

      {/* 6. FAQ teaser */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-[Sora] text-lg font-semibold text-text-dark mb-1">
              Common questions
            </h3>
            <p className="text-sm text-text-muted">
              Most answers are already in our Help section.
            </p>
          </div>
          <a
            href="/help"
            className="px-5 py-2.5 rounded-full glass text-text-dark font-medium hover:bg-white/70 transition-colors shrink-0"
          >
            Visit Help / FAQ
          </a>
        </div>
      </section>

      {/* 7. Social / community links */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16 text-center">
        <p className="text-sm text-text-muted mb-3">Follow the project</p>
        <div className="flex justify-center gap-3">
          {["Twitter", "Facebook", "Instagram"].map((platform) => (
            <span
              key={platform}
              className="px-4 py-2 rounded-full glass text-sm text-text-muted"
            >
              {platform}
            </span>
          ))}
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto pb-24 text-center">
        <h2 className="font-[Sora] text-2xl font-semibold text-text-dark mb-3">
          Prefer to just report the issue?
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
