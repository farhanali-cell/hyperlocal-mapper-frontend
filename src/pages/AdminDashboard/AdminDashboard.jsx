import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const STATUS_TABS = ["all", "pending", "in_progress", "resolved"];
const CATEGORY_LABELS = {
  electricity: "Electricity",
  water: "Water",
  garbage: "Garbage",
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let isMounted = true;
    const loadAll = async () => {
      try {
        const [dashRes, complaintsRes, clustersRes, messagesRes] =
          await Promise.all([
            axios.get("/complaints/dashboard/"),
            axios.get("/complaints/"),
            axios.get("/clusters/"),
            axios.get("/contact/list/"),
          ]);
        if (!isMounted) return;
        setStats(dashRes.data);
        setComplaints(complaintsRes.data.results || complaintsRes.data || []);
        setClusters(clustersRes.data.results || clustersRes.data || []);
        setMessages(messagesRes.data.results || messagesRes.data || []);
      } catch (err) {
        console.error("AdminDashboard: failed to load data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAll();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await axios.patch(`/complaints/${id}/`, { status: newStatus });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      );
    } catch (err) {
      console.error("AdminDashboard: status update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredComplaints =
    statusFilter === "all"
      ? complaints
      : complaints.filter((c) => c.status === statusFilter);

  // 1. Role guard
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <h1 className="font-[Sora] text-xl font-semibold text-[#0F1729] mb-2">
            Admins only
          </h1>
          <p className="text-[#5B6B85] text-sm">
            This dashboard is restricted to administrator accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      {/* 2. Header */}
      <section className="pt-28 pb-8 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-[#5B6B85] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2F6FED] animate-pulse" />
            Admin Dashboard
          </span>
          <h1 className="font-[Sora] text-3xl md:text-4xl font-semibold text-[#0F1729]">
            Welcome back, {user.username}
          </h1>
        </motion.div>
      </section>

      {/* 3. Stats overview */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {[
          { label: "Total", value: stats?.total_complaints },
          { label: "Pending", value: stats?.pending },
          { label: "In Progress", value: stats?.in_progress },
          { label: "Resolved", value: stats?.resolved },
          {
            label: "High Priority Clusters",
            value: stats?.high_priority_clusters,
          },
        ].map((item) => (
          <div key={item.label} className="glass rounded-2xl p-4 text-center">
            <p className="font-[JetBrains_Mono] text-2xl font-semibold text-[#2F6FED]">
              {loading ? "…" : (item.value ?? "—")}
            </p>
            <p className="text-xs text-[#5B6B85] mt-1">{item.label}</p>
          </div>
        ))}
      </section>

      {/* 4. Complaints table with status filter + inline update */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-[Sora] text-xl font-semibold text-[#0F1729]">
            Complaints
          </h2>
          <div className="flex gap-2">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-[#2F6FED] text-white"
                    : "glass text-[#5B6B85]"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          {loading ? (
            <p className="p-6 text-center text-[#5B6B85]">
              Loading complaints…
            </p>
          ) : filteredComplaints.length === 0 ? (
            <p className="p-6 text-center text-[#5B6B85]">
              No complaints here.
            </p>
          ) : (
            <div className="divide-y divide-white/40">
              {filteredComplaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0F1729]">
                      #{c.id} · {CATEGORY_LABELS[c.category] || c.category}
                      {c.city ? ` — ${c.city}` : ""}
                    </p>
                    <p className="text-xs text-[#5B6B85] max-w-md truncate">
                      {c.description}
                    </p>
                  </div>
                  <select
                    value={c.status}
                    disabled={updatingId === c.id}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                    className="rounded-lg border border-white/60 bg-white/70 px-3 py-1.5 text-xs text-[#0F1729] outline-none focus:ring-2 focus:ring-[#2F6FED]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. Clusters overview */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-12">
        <h2 className="font-[Sora] text-xl font-semibold text-[#0F1729] mb-4">
          Active clusters
        </h2>
        {clusters.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-[#5B6B85]">
            {loading ? "Loading clusters…" : "No clusters yet."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {clusters.slice(0, 6).map((cluster) => (
              <div
                key={cluster.id}
                className="glass rounded-2xl p-5 flex items-start gap-3"
              >
                <span
                  className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                    cluster.priority_level === "high"
                      ? "bg-[#FF6B4A]"
                      : "bg-[#14B8A6]"
                  }`}
                />
                <div>
                  <p className="font-medium text-[#0F1729]">
                    {CATEGORY_LABELS[cluster.category] || cluster.category} —{" "}
                    {cluster.city}
                  </p>
                  <p className="text-sm text-[#5B6B85] capitalize">
                    priority: {cluster.priority_level || "medium"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. By city breakdown */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-12">
        <h2 className="font-[Sora] text-xl font-semibold text-[#0F1729] mb-4">
          Complaints by city
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(stats?.by_city || []).map((entry) => (
            <div
              key={entry.city || "unknown"}
              className="glass rounded-2xl p-4 text-center"
            >
              <p className="font-[JetBrains_Mono] text-xl font-semibold text-[#2F6FED]">
                {entry.count}
              </p>
              <p className="text-xs text-[#5B6B85] mt-1">
                {entry.city || "Unspecified"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Contact messages inbox */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-12">
        <h2 className="font-[Sora] text-xl font-semibold text-[#0F1729] mb-4">
          Contact messages
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          {messages.length === 0 ? (
            <p className="p-6 text-center text-[#5B6B85]">
              {loading ? "Loading messages…" : "No messages yet."}
            </p>
          ) : (
            <div className="divide-y divide-white/40">
              {messages.slice(0, 6).map((m) => (
                <div key={m.id} className="p-4">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <p className="text-sm font-medium text-[#0F1729]">
                      {m.name} · {m.category}
                    </p>
                    <span className="text-xs text-[#5B6B85] capitalize">
                      {m.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B6B85] truncate">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. Footer spacing */}
      <div className="pb-16" />
    </div>
  );
}
