// frontend/src/pages/Notifications/Notifications.jsx

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "complaint_update", label: "Complaint Updates" },
  { id: "system", label: "System" },
];

const TYPE_META = {
  complaint_update: { color: "#364fc7", icon: "📍" },
  cluster_alert: { color: "#e2543f", icon: "⚠️" },
  system: { color: "#5c6478", icon: "🔔" },
  resolved: { color: "#0d9488", icon: "✅" },
};

// Fallback so page isn't blank before backend endpoint is wired
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "complaint_update",
    title: "Complaint status updated",
    message: "Aapki 'Streetlight band' complaint ab In Progress hai.",
    is_read: false,
    created_at: new Date().toISOString(),
    complaint_id: 12,
  },
  {
    id: 2,
    type: "cluster_alert",
    title: "High priority cluster near you",
    message: "Aapke area mein 14 similar water complaints cluster hui hain.",
    is_read: false,
    created_at: new Date().toISOString(),
    complaint_id: null,
  },
  {
    id: 3,
    type: "resolved",
    title: "Issue resolved",
    message: "Aapki 'Kachra collection delay' complaint resolve ho gayi hai.",
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    complaint_id: 9,
  },
  {
    id: 4,
    type: "system",
    title: "Welcome to Hyperlocal Problem Mapper",
    message: "Apna pehla issue report karke shuru karein.",
    is_read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    complaint_id: null,
  },
];

function groupByDate(items) {
  const today = new Date().toDateString();
  const groups = { Today: [], Earlier: [] };
  items.forEach((n) => {
    const day = new Date(n.created_at).toDateString();
    (day === today ? groups.Today : groups.Earlier).push(n);
  });
  return groups;
}

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    api
      .get("/notifications/")
      .then((res) => {
        if (mounted && Array.isArray(res.data)) setNotifications(res.data);
      })
      .catch(() => {
        // keep mock fallback
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filtered = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread")
      return notifications.filter((n) => !n.is_read);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const markAsRead = async (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
    );
    api.patch(`/notifications/${notif.id}/`, { is_read: true }).catch(() => {});
    if (notif.complaint_id) {
      navigate(`/track-complaint?id=${notif.complaint_id}`);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    api.post("/notifications/mark-all-read/").catch(() => {});
  };

  const renderCard = (n, i) => {
    const meta = TYPE_META[n.type] || TYPE_META.system;
    return (
      <motion.button
        key={n.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: i * 0.04 }}
        onClick={() => markAsRead(n)}
        className={`w-full text-left glass rounded-xl p-4 flex gap-4 items-start transition-all hover:-translate-y-0.5 ${
          !n.is_read ? "ring-1" : ""
        }`}
        style={
          !n.is_read ? { boxShadow: `inset 0 0 0 1px ${meta.color}55` } : {}
        }
      >
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${meta.color}1A` }}
        >
          {meta.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium">{n.title}</p>
            {!n.is_read && (
              <span className="w-2 h-2 rounded-full shrink-0 bg-primary" />
            )}
          </div>
          <p className="text-sm text-text-muted mt-1">{n.message}</p>
          <p className="text-xs text-text-muted/70 mt-2 font-mono">
            {new Date(n.created_at).toLocaleString("en-PK", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="bg-bg text-text-dark font-['Inter']">
      {/* 1. HERO */}
      <section className="px-6 pt-28 pb-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-['Sora'] font-bold text-3xl md:text-4xl flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="text-sm font-mono font-semibold text-white px-2.5 py-1 rounded-full bg-alert">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-text-muted mt-2 text-sm">
              {user
                ? `${user.username}, ye rahi aapki updates`
                : "Login karein notifications dekhne ke liye"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-medium px-4 py-2 rounded-xl glass text-primary"
            >
              Mark all as read
            </button>
          )}
        </div>
      </section>

      {/* 2. FILTER TABS */}
      <section className="px-6 pb-6">
        <div className="max-w-3xl mx-auto flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f.id
                  ? "bg-primary text-white"
                  : "text-text-muted glass"
              }`}
            >
              {f.label}
              {f.id === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 opacity-80">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 3. NOTIFICATION LIST */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {loading ? (
            <p className="text-sm text-text-muted text-center py-10">
              Loading notifications...
            </p>
          ) : (
            <AnimatePresence>
              {Object.entries(grouped).map(
                ([group, items]) =>
                  items.length > 0 && (
                    <div key={group}>
                      <p className="text-xs font-semibold text-text-muted uppercase mb-3">
                        {group}
                      </p>
                      <div className="space-y-3">
                        {items.map((n, i) => renderCard(n, i))}
                      </div>
                    </div>
                  ),
              )}
            </AnimatePresence>
          )}

          {/* 4. EMPTY STATE */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <span className="text-4xl mb-4 inline-block">🔔</span>
              <p className="font-['Sora'] font-semibold text-lg mb-1">
                Koi notification nahi
              </p>
              <p className="text-sm text-text-muted">
                Jab kuch update hoga, yahan dikhega.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. PREFERENCES REMINDER */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto glass rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-medium">
              Notification preferences control karni hain?
            </p>
            <p className="text-sm text-text-muted mt-1">
              Email/push alerts customize karein Settings mein.
            </p>
          </div>
          <Link
            to="/settings"
            className="px-4 py-2 rounded-xl text-sm font-medium shrink-0"
            style={{ backgroundColor: "#364fc71A", color: "#364fc7" }}
          >
            Go to Settings
          </Link>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="px-6 pb-28 text-center">
        <p className="text-text-muted mb-4 text-sm">
          Koi naya masla dekha shehar mein?
        </p>
        <Link
          to="/report-issue"
          className="inline-block px-6 py-3 rounded-xl text-white font-medium bg-primary hover:bg-primary-dark"
        >
          Report an Issue
        </Link>
      </section>
    </div>
  );
}
