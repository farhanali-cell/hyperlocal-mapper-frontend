import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axios";

const CITIES = ["Karachi", "Lahore", "Hyderabad", "Faisalabad"];

const CATEGORY_COLORS = {
  electricity: "364fc7",
  water: "#0d9488",
  garbage: "#e2543f",
};

const CATEGORY_LABELS = {
  electricity: "Electricity",
  water: "Water",
  garbage: "Garbage",
};

export default function CommunityInsights() {
  const [activeCity, setActiveCity] = useState("Karachi");
  const [stats, setStats] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [dashboardRes, clustersRes] = await Promise.all([
          axios.get("/complaints/dashboard/"),
          axios.get("/clusters/"),
        ]);

        if (!isMounted) return;

        setStats(dashboardRes.data);
        setClusters(clustersRes.data.results || clustersRes.data || []);
      } catch (err) {
        console.error("CommunityInsights: failed to load data", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const categoryCount = (category) => {
    const entry = stats?.by_category?.find((c) => c.category === category);
    return entry?.count ?? 0;
  };

  const cityClusters = clusters.filter(
    (c) => (c.city || "").toLowerCase() === activeCity.toLowerCase(),
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* 1. Section header */}
      <section className="pt-28 pb-12 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-text-muted mb-4">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Community Insights
          </span>
          <h1 className="font-[Sora] text-3xl md:text-5xl font-semibold text-text-dark mb-3">
            What Pakistan is reporting, city by city
          </h1>
          <p className="text-text-muted max-w-2xl mx-auto">
            Every dot on this page comes from a real complaint, clustered by our
            AI and tracked until it's resolved. Here's the current picture
            across Karachi, Lahore, Hyderabad, and Faisalabad.
          </p>
        </motion.div>
      </section>

      {/* 2. Live stats overview */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { label: "Total Complaints", value: stats?.total_complaints ?? "—" },
          { label: "Resolved", value: stats?.resolved ?? "—" },
          { label: "In Progress", value: stats?.in_progress ?? "—" },
          {
            label: "Total Clusters",
            value: stats?.total_clusters ?? clusters.length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="glass rounded-2xl p-5 text-center backdrop-blur-md"
          >
            <p className="font-[JetBrains_Mono] text-2xl md:text-3xl font-semibold text-primary">
              {loading ? "…" : item.value}
            </p>
            <p className="text-xs text-text-muted mt-1">{item.label}</p>
          </div>
        ))}
      </section>

      {/* 3. City tabs */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCity === city
                  ? "bg-primary text-white"
                  : "glass text-text-muted hover:text-text-dark"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      {/* 4. City-wise cluster hotspots */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <h2 className="font-[Sora] text-xl font-semibold text-text-dark mb-4">
          Hotspots in {activeCity}
        </h2>
        {cityClusters.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-text-muted">
            {loading ? "Loading hotspots…" : "No active clusters here yet."}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {cityClusters.slice(0, 6).map((cluster) => (
              <motion.div
                key={cluster.id}
                whileHover={{ y: -2 }}
                className="glass rounded-2xl p-5 flex items-start gap-3"
              >
                <span
                  className="w-3 h-3 rounded-full mt-1 shrink-0"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[cluster.category] || "#364fc7",
                  }}
                />
                <div>
                  <p className="font-medium text-text-dark">
                    {CATEGORY_LABELS[cluster.category] ||
                      cluster.category ||
                      "Uncategorized"}{" "}
                    — {cluster.city || activeCity}
                  </p>
                  <p className="text-sm text-text-muted">
                    {cluster.complaints?.length ?? 0} complaints grouped ·
                    priority {cluster.priority_level || "medium"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Category distribution */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <h2 className="font-[Sora] text-xl font-semibold text-text-dark mb-4">
          Complaint categories
        </h2>
        <div className="glass rounded-2xl p-6 space-y-3">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => {
            const count = categoryCount(category);
            const max = Math.max(
              1,
              ...Object.keys(CATEGORY_COLORS).map((k) => categoryCount(k)),
            );
            const width = Math.round((count / max) * 100);
            return (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-dark">
                    {CATEGORY_LABELS[category]}
                  </span>
                  <span className="font-[JetBrains_Mono] text-text-muted">
                    {count}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-bg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${width}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Complaints by city */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <h2 className="font-[Sora] text-xl font-semibold text-text-dark mb-4">
          Complaints by city
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(stats?.by_city || []).map((entry) => (
            <div
              key={entry.city || "unknown"}
              className="glass rounded-2xl p-5 text-center"
            >
              <p className="font-[JetBrains_Mono] text-2xl font-semibold text-primary">
                {entry.count}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {entry.city || "Unspecified"}
              </p>
            </div>
          ))}
          {!loading && (stats?.by_city || []).length === 0 && (
            <p className="col-span-full text-center text-text-muted">
              No city data yet.
            </p>
          )}
        </div>
      </section>

      {/* 7. Why clustering matters band */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <div className="rounded-2xl bg-text-dark text-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <h2 className="font-[Sora] text-xl font-semibold mb-2">
              One pothole is a complaint. Fifty in one street is a pattern.
            </h2>
            <p className="text-white/70 text-sm max-w-xl">
              Our DBSCAN clustering groups nearby, similar complaints
              automatically, so departments fix the street once instead of fifty
              separate tickets.
            </p>
          </div>
          <span className="w-3 h-3 rounded-full bg-secondary animate-pulse shrink-0" />
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto pb-24 text-center">
        <h2 className="font-[Sora] text-2xl font-semibold text-text-dark mb-3">
          Seen a problem in your area?
        </h2>
        <p className="text-text-muted mb-6">
          Add it to the map — it takes less than a minute.
        </p>
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
