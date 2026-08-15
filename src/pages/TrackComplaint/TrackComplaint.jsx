import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const STEPS = [
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

const CATEGORY_LABELS = {
  electricity: "Electricity",
  water: "Water",
  garbage: "Garbage",
};

function stepIndex(status) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function TrackComplaint() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState("idle"); // idle | loading | found | not_found
  const [complaint, setComplaint] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  const [myLoading, setMyLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setMyLoading(true);
    axios
      .get("/complaints/")
      .then((res) => {
        const list = res.data.results || res.data || [];
        setMyComplaints(list.slice(0, 5));
      })
      .catch((err) =>
        console.error("TrackComplaint: my complaints failed", err),
      )
      .finally(() => setMyLoading(false));
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const id = query.trim();
    if (!id) return;
    setSearchState("loading");
    setComplaint(null);
    try {
      const res = await axios.get(`/complaints/${id}/`);
      setComplaint(res.data);
      setSearchState("found");
    } catch (err) {
      console.error("TrackComplaint: lookup failed", err);
      setSearchState("not_found");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      {/* 1. Header + search */}
      <section className="pt-28 pb-10 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-[#5B6B85] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2F6FED] animate-pulse" />
            Track Complaint
          </span>
          <h1 className="font-[Sora] text-3xl md:text-5xl font-semibold text-[#0F1729] mb-3">
            Where does your report stand?
          </h1>
          <p className="text-[#5B6B85] max-w-xl mx-auto mb-8">
            Enter your complaint ID — you got it in the confirmation after
            submitting — to see its live status.
          </p>
        </motion.div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 1042"
            className="flex-1 rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-[#0F1729] outline-none focus:ring-2 focus:ring-[#2F6FED]"
          />
          <button
            type="submit"
            disabled={searchState === "loading"}
            className="px-6 py-3 rounded-full bg-[#2F6FED] text-white font-medium hover:bg-[#2558c4] transition-colors disabled:opacity-60"
          >
            {searchState === "loading" ? "Searching…" : "Track"}
          </button>
        </form>
      </section>

      {/* 2. Result states */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16 min-h-[60px]">
        <AnimatePresence mode="wait">
          {searchState === "not_found" && (
            <motion.div
              key="not_found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-6 text-center text-[#FF6B4A]"
            >
              No complaint found with that ID. Double-check the number from your
              confirmation email.
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3 & 4. Complaint summary + status timeline */}
      {searchState === "found" && complaint && (
        <>
          <section className="px-6 md:px-12 max-w-4xl mx-auto mb-10">
            <div className="glass rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs text-[#5B6B85] mb-1">
                    Complaint #{complaint.id}
                  </p>
                  <h2 className="font-[Sora] text-xl font-semibold text-[#0F1729]">
                    {CATEGORY_LABELS[complaint.category] || complaint.category}
                    {complaint.city ? ` — ${complaint.city}` : ""}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#14B8A6]/15 text-[#14B8A6]">
                  {(complaint.status || "pending").replace("_", " ")}
                </span>
              </div>

              <p className="text-sm text-[#5B6B85] mb-6">
                {complaint.description || "No description provided."}
              </p>

              {/* Status timeline */}
              <div className="flex items-center">
                {STEPS.map((step, i) => {
                  const current = stepIndex(complaint.status);
                  const done = i <= current;
                  return (
                    <div
                      key={step.key}
                      className="flex items-center flex-1 last:flex-none"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            done ? "bg-[#2F6FED]" : "bg-[#E5E9F2]"
                          }`}
                        />
                        <p
                          className={`text-[11px] text-center w-16 ${
                            done
                              ? "text-[#0F1729] font-medium"
                              : "text-[#5B6B85]"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 mb-5 ${
                            i < current ? "bg-[#2F6FED]" : "bg-[#E5E9F2]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5. Cluster info */}
          {complaint.cluster && (
            <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
              <div className="glass rounded-2xl p-6 flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-[#FF6B4A] shrink-0" />
                <p className="text-sm text-[#0F1729]">
                  This complaint has been grouped with similar reports nearby —
                  clustered issues get prioritized faster.
                </p>
              </div>
            </section>
          )}
        </>
      )}

      {/* 6. My complaints (logged in citizens) */}
      {user && (
        <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
          <h2 className="font-[Sora] text-xl font-semibold text-[#0F1729] mb-4">
            Your recent complaints
          </h2>
          {myLoading ? (
            <p className="text-[#5B6B85] text-sm">Loading…</p>
          ) : myComplaints.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center text-[#5B6B85]">
              You haven't reported anything yet.
            </div>
          ) : (
            <div className="glass rounded-2xl divide-y divide-white/40">
              {myComplaints.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setQuery(String(c.id));
                    setComplaint(c);
                    setSearchState("found");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-white/40 transition-colors"
                >
                  <span className="text-sm text-[#0F1729]">
                    #{c.id} · {CATEGORY_LABELS[c.category] || c.category}
                    {c.city ? ` — ${c.city}` : ""}
                  </span>
                  <span className="text-xs text-[#5B6B85]">
                    {(c.status || "pending").replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 7. Didn't find help prompt */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-16">
        <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-[Sora] text-lg font-semibold text-[#0F1729] mb-1">
              Can't find your complaint?
            </h3>
            <p className="text-sm text-[#5B6B85]">
              Reach out and we'll look it up for you.
            </p>
          </div>
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-full glass text-[#0F1729] font-medium hover:bg-white/70 transition-colors shrink-0"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto pb-24 text-center">
        <h2 className="font-[Sora] text-2xl font-semibold text-[#0F1729] mb-3">
          Haven't reported yet?
        </h2>
        <a
          href="/report"
          className="inline-block px-6 py-3 rounded-full bg-[#2F6FED] text-white font-medium hover:bg-[#2558c4] transition-colors"
        >
          Report an Issue
        </a>
      </section>
    </div>
  );
}
