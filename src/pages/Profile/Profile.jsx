import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const CATEGORY_LABELS = {
  electricity: "Electricity",
  water: "Water",
  garbage: "Garbage",
};

function initialsOf(name) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

export default function Profile() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    axios
      .get("/complaints/")
      .then((res) => {
        if (!isMounted) return;
        const all = res.data.results || res.data || [];
        // The list endpoint returns everyone's complaints — filter to this user's own.
        const mine = all.filter((c) => c.user === user.username);
        setComplaints(mine);
      })
      .catch((err) => console.error("Profile: failed to load complaints", err))
      .finally(() => isMounted && setLoading(false));
    return () => {
      isMounted = false;
    };
  }, [user]);

  const summary = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
    };
  }, [complaints]);

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <p className="text-text-muted">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* 1. Profile header */}
      <section className="pt-28 pb-10 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5"
        >
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-[Sora] text-2xl font-semibold shrink-0">
            {initialsOf(user.username)}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-[Sora] text-2xl font-semibold text-text-dark">
              {user.username}
            </h1>
            <p className="text-text-muted text-sm mb-2">{user.email}</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-text-dark/10 text-primary capitalize">
              {user.role || "citizen"}
            </span>
          </div>
          <a
            href="/settings"
            className="sm:ml-auto px-5 py-2.5 rounded-full glass text-text-dark font-medium hover:bg-white/70 transition-colors shrink-0"
          >
            Edit Profile
          </a>
        </motion.div>
      </section>

      {/* 2. Quick stats */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total Reported", value: summary.total },
          { label: "Pending", value: summary.pending },
          { label: "In Progress", value: summary.inProgress },
          { label: "Resolved", value: summary.resolved },
        ].map((item) => (
          <div key={item.label} className="glass rounded-2xl p-5 text-center">
            <p className="font-[JetBrains_Mono] text-2xl font-semibold text-primary">
              {loading ? "…" : item.value}
            </p>
            <p className="text-xs text-text-muted mt-1">{item.label}</p>
          </div>
        ))}
      </section>

      {/* 3. My complaints list */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <h2 className="font-[Sora] text-xl font-semibold text-text-dark mb-4">
          Your complaints
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-6 text-center text-text-muted">Loading…</p>
          ) : complaints.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-text-muted mb-4">
                You haven't reported anything yet.
              </p>
              <a
                href="/report-issue"
                className="inline-block px-5 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary transition-colors"
              >
                Report an Issue
              </a>
            </div>
          ) : (
            <div className="divide-y divide-white/40">
              {complaints.map((c) => (
                <a
                  key={c.id}
                  href={`/track-complaint?id=${c.id}`}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-white/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-text-dark">
                      #{c.id} · {CATEGORY_LABELS[c.category] || c.category}
                      {c.city ? ` — ${c.city}` : ""}
                    </p>
                    <p className="text-xs text-text-muted max-w-md truncate">
                      {c.description}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted capitalize shrink-0">
                    {(c.status || "pending").replace("_", " ")}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Impact note */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="rounded-2xl bg-text-dark text-white p-6 md:p-8 flex items-center gap-4">
          <span className="w-3 h-3 rounded-full bg-secondary animate-pulse shrink-0" />
          <p className="text-sm text-white/80">
            Every report you file helps our clustering find real patterns —
            thank you for keeping your city on the map.
          </p>
        </div>
      </section>

      {/* 5. Quick links */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Report an Issue", href: "/report" },
            { label: "Track a Complaint", href: "/track-complaint" },
            { label: "Account Settings", href: "/settings" },
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

      {/* 6. Help footer note */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-24 text-center">
        <p className="text-sm text-text-muted">
          Something look wrong?{" "}
          <a href="/contact" className="text-primary hover:text-secondary font-medium">
            Contact us
          </a>
        </p>
      </section>
    </div>
  );
}
