// frontend/src/pages/LiveMap/LiveMap.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api/axios";

// ---------- Config ----------
const CITIES = [
  { id: "karachi", label: "Karachi", center: [24.8607, 67.0011], zoom: 11 },
  { id: "lahore", label: "Lahore", center: [31.5497, 74.3436], zoom: 11 },
  { id: "hyderabad", label: "Hyderabad", center: [25.396, 68.3578], zoom: 12 },
  {
    id: "faisalabad",
    label: "Faisalabad",
    center: [31.4187, 73.0791],
    zoom: 12,
  },
];

const CATEGORY_COLORS = {
  electricity: "#FF6B4A",
  water: "#2F6FED",
  streetlight: "#14B8A6",
  waste: "#5B6B85",
  roads: "#0F1729",
  other: "#2F6FED",
};

const STATUS_OPTIONS = [
  { id: "all", label: "All Status" },
  { id: "open", label: "Open" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
];

// Mock fallback so page isn't blank while backend/clusters endpoint is being wired
const MOCK_CLUSTERS = [
  {
    id: 1,
    lat: 24.8615,
    lng: 67.03,
    category: "electricity",
    severity: "high",
    count: 14,
    status: "open",
    title: "Bijli ka masla — Gulshan area",
  },
  {
    id: 2,
    lat: 24.85,
    lng: 67.02,
    category: "water",
    severity: "medium",
    count: 7,
    status: "in_progress",
    title: "Paani ki qillat — North Nazimabad",
  },
  {
    id: 3,
    lat: 24.87,
    lng: 67.05,
    category: "waste",
    severity: "low",
    count: 3,
    status: "resolved",
    title: "Kachra collection delay",
  },
  {
    id: 4,
    lat: 24.88,
    lng: 67.01,
    category: "streetlight",
    severity: "medium",
    count: 9,
    status: "open",
    title: "Streetlights band — Main road",
  },
];

function severityRadius(count) {
  if (count >= 12) return 18;
  if (count >= 6) return 13;
  return 9;
}

// Flies the map to a new center when active city changes
function FlyToCity({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.1 });
  }, [center, zoom, map]);
  return null;
}

export default function LiveMap() {
  const [activeCity, setActiveCity] = useState(CITIES[0]);
  const [clusters, setClusters] = useState(MOCK_CLUSTERS);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCluster, setSelectedCluster] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/clusters/")
      .then((res) => {
        if (mounted && Array.isArray(res.data) && res.data.length) {
          setClusters(res.data);
        }
      })
      .catch(() => {
        // keep mock data as fallback
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  const filteredClusters = useMemo(() => {
    return clusters.filter((c) => {
      const catOk = categoryFilter === "all" || c.category === categoryFilter;
      const statusOk = statusFilter === "all" || c.status === statusFilter;
      return catOk && statusOk;
    });
  }, [clusters, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = filteredClusters.reduce((sum, c) => sum + c.count, 0);
    const open = filteredClusters.filter((c) => c.status === "open").length;
    const resolved = filteredClusters.filter(
      (c) => c.status === "resolved",
    ).length;
    return { total, open, resolved, clusters: filteredClusters.length };
  }, [filteredClusters]);

  return (
    <div className="bg-[#F5F8FC] text-[#0F1729] font-['Inter']">
      {/* 1. HERO */}
      <section className="px-6 pt-28 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-['Sora'] font-bold text-4xl md:text-5xl"
        >
          Live Problem Map
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-3 text-[#5B6B85] max-w-xl mx-auto"
        >
          AI-clustered civic issues, real-time — apne shehar ka scene dekhein
        </motion.p>

        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCity.id === city.id
                  ? "text-white"
                  : "text-[#5B6B85] glass"
              }`}
              style={
                activeCity.id === city.id ? { backgroundColor: "#2F6FED" } : {}
              }
            >
              {city.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. MAP + FILTERS */}
      <section className="px-6 pb-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[220px_1fr] gap-4">
          {/* Filters sidebar */}
          <div className="glass rounded-2xl p-4 h-fit space-y-5">
            <div>
              <p className="text-xs font-semibold text-[#5B6B85] uppercase mb-2">
                Category
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm ${
                    categoryFilter === "all" ? "bg-[#2F6FED1A] font-medium" : ""
                  }`}
                >
                  All
                </button>
                {Object.keys(CATEGORY_COLORS).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 capitalize ${
                      categoryFilter === cat ? "bg-[#2F6FED1A] font-medium" : ""
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                    />
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#5B6B85] uppercase mb-2">
                Status
              </p>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/70 border border-[#5B6B85]/15 text-sm outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Map */}
          <div className="relative z-0 isolate rounded-2xl overflow-hidden h-[520px]">
            {loading && (
              <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/60 backdrop-blur-sm">
                <span className="text-sm text-[#5B6B85]">
                  Loading map data...
                </span>
              </div>
            )}
            <MapContainer
              center={activeCity.center}
              zoom={activeCity.zoom}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
              ref={mapRef}
            >
              <FlyToCity center={activeCity.center} zoom={activeCity.zoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredClusters.map((c) => (
                <CircleMarker
                  key={c.id}
                  center={[c.lat, c.lng]}
                  radius={severityRadius(c.count)}
                  pathOptions={{
                    color: CATEGORY_COLORS[c.category] || "#2F6FED",
                    fillColor: CATEGORY_COLORS[c.category] || "#2F6FED",
                    fillOpacity: 0.55,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => setSelectedCluster(c),
                  }}
                >
                  <Popup>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-[#5B6B85]">{c.count} reports</p>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* 3. LEGEND + STATS BAR */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto glass rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 text-xs text-[#5B6B85] capitalize"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {cat}
              </div>
            ))}
          </div>
          <div className="flex gap-6 font-mono text-sm">
            <div>
              <span className="font-bold">{stats.clusters}</span>{" "}
              <span className="text-[#5B6B85]">clusters</span>
            </div>
            <div>
              <span className="font-bold">{stats.total}</span>{" "}
              <span className="text-[#5B6B85]">reports</span>
            </div>
            <div>
              <span className="font-bold" style={{ color: "#FF6B4A" }}>
                {stats.open}
              </span>{" "}
              <span className="text-[#5B6B85]">open</span>
            </div>
            <div>
              <span className="font-bold" style={{ color: "#14B8A6" }}>
                {stats.resolved}
              </span>{" "}
              <span className="text-[#5B6B85]">resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SELECTED CLUSTER DETAIL PANEL */}
      {selectedCluster && (
        <section className="px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto glass rounded-2xl p-6 flex justify-between items-start gap-4"
          >
            <div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[selectedCluster.category]}1A`,
                  color: CATEGORY_COLORS[selectedCluster.category],
                }}
              >
                {selectedCluster.category}
              </span>
              <h3 className="font-['Sora'] font-semibold text-lg mt-2">
                {selectedCluster.title}
              </h3>
              <p className="text-sm text-[#5B6B85] mt-1">
                {selectedCluster.count} reports clustered · status:{" "}
                {selectedCluster.status.replace("_", " ")}
              </p>
            </div>
            <button
              onClick={() => setSelectedCluster(null)}
              className="text-[#5B6B85] text-sm"
            >
              ✕ close
            </button>
          </motion.div>
        </section>
      )}

      {/* 5. RECENT CLUSTERS LIST */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-['Sora'] font-semibold text-2xl mb-6">
            Active Clusters
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredClusters.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCluster(c)}
                className="glass rounded-xl p-4 text-left flex items-center justify-between hover:-translate-y-0.5 transition-transform"
              >
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-[#5B6B85] mt-1 capitalize">
                    {c.category} · {c.count} reports
                  </p>
                </div>
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[c.category] }}
                />
              </button>
            ))}
            {!filteredClusters.length && (
              <p className="text-sm text-[#5B6B85]">
                Is filter ke sath koi cluster nahi mila.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="px-6 pb-28 text-center">
        <div className="max-w-2xl mx-auto glass rounded-3xl p-10">
          <h2 className="font-['Sora'] font-semibold text-2xl mb-2">
            Apna Masla Map Par Nahi Dikh Raha?
          </h2>
          <p className="text-[#5B6B85] mb-6">
            Naya issue report karein, AI usay khud cluster kar dega.
          </p>
          <Link
            to="/report-issue"
            className="inline-block px-6 py-3 rounded-xl text-white font-medium"
            style={{ backgroundColor: "#2F6FED" }}
          >
            Report an Issue
          </Link>
        </div>
      </section>
    </div>
  );
}
