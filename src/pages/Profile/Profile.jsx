import { useEffect, useMemo, useState, useRef } from "react";
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
  const { user, updateUser } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile picture upload state
  const [avatarUrl, setAvatarUrl] = useState(user?.profile_picture || null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setAvatarUrl(user?.profile_picture || null);
  }, [user]);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }

    setUploadError("");
    setUploading(true);

    // Show an instant local preview while the upload is in progress
    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const res = await axios.patch("/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarUrl(res.data.profile_picture);
      updateUser({ profile_picture: res.data.profile_picture });
    } catch (err) {
      console.error("Profile: failed to upload profile picture", err);
      setUploadError("Upload failed. Please try again.");
      setAvatarUrl(user?.profile_picture || null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localPreview);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
          <div className="relative shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="relative w-20 h-20 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Change profile picture"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.username}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-[Sora] text-2xl font-semibold">
                  {initialsOf(user.username)}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs">…</span>
                </div>
              )}
            </button>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
              aria-label="Change profile picture"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828H9V11z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 19h14"
                />
              </svg>
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-[Sora] text-2xl font-semibold text-text-dark">
              {user.username}
            </h1>
            <p className="text-text-muted text-sm mb-2">{user.email}</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-text-dark/10 text-primary capitalize">
              {user.role || "citizen"}
            </span>
            {uploadError && (
              <p className="text-alert text-xs mt-2">{uploadError}</p>
            )}
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
          <a
            href="/contact"
            className="text-primary hover:text-secondary font-medium"
          >
            Contact us
          </a>
        </p>
      </section>
    </div>
  );
}
