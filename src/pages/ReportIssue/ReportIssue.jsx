// frontend/src/pages/ReportIssue/ReportIssue.jsx

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

// ---------- Static data ----------
const CATEGORIES = [
  {
    id: "electricity",
    label: "Electricity",
    color: "#FF6B4A",
    icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  },
  {
    id: "water",
    label: "Water & Sewerage",
    color: "#2F6FED",
    icon: <path d="M12 2s7 8.5 7 13a7 7 0 1 1-14 0c0-4.5 7-13 7-13z" />,
  },
  {
    id: "streetlight",
    label: "Streetlight",
    color: "#14B8A6",
    icon: (
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="M12 14v7M9 21h6" />
      </>
    ),
  },
  {
    id: "waste",
    label: "Waste / Garbage",
    color: "#5B6B85",
    icon: (
      <>
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
      </>
    ),
  },
  {
    id: "roads",
    label: "Roads",
    color: "#0F1729",
    icon: (
      <>
        <path d="M4 20 10 4h4l6 16" />
        <path d="M12 8v8" strokeDasharray="2 2" />
      </>
    ),
  },
  {
    id: "other",
    label: "Other",
    color: "#2F6FED",
    icon: <circle cx="12" cy="12" r="9" />,
  },
];

const TIPS_DO = [
  "Clear, well-lit photo of the exact issue",
  "Specific location — nearest landmark ya street name",
  "Short, factual description (what, since when, severity)",
];

const TIPS_DONT = [
  "Duplicate report for same issue (check Live Map first)",
  "Blurry ya unrelated image upload na karein",
  "Personal/political comments complaint mein na likhein",
];

const FAQS = [
  {
    q: "Report submit karne ke baad kya hoga?",
    a: "Aapki complaint AI clustering se similar reports ke saath group hogi, phir admin dashboard par priority ke hisaab se review hogi. Status Track Complaint page par live update hoga.",
  },
  {
    q: "Image upload zaroori hai?",
    a: "Recommended hai — image se verification aur priority scoring dono behtar hoti hai, lekin agar available na ho to bhi submit kar sakte hain.",
  },
  {
    q: "Location automatically detect ho sakti hai?",
    a: "Haan, 'Use My Location' button GPS se coordinates fetch karta hai. Aap manually address bhi edit kar sakte hain.",
  },
];

const CITY_CENTERS = {
  Karachi: [24.8607, 67.0011],
  Lahore: [31.5497, 74.3436],
  Hyderabad: [25.396, 68.3578],
  Faisalabad: [31.4187, 73.0791],
};

// ---------- Small building blocks ----------
function CategoryIcon({ children, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      {children}
    </svg>
  );
}

function PulsePin({ size = 14 }) {
  return (
    <span
      className="relative inline-flex"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
        style={{ backgroundColor: "#2F6FED" }}
      />
      <span
        className="relative inline-flex rounded-full h-full w-full"
        style={{ backgroundColor: "#2F6FED" }}
      />
    </span>
  );
}

// ---------- Main Page ----------
export default function ReportIssue() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    city: "",
    latitude: null,
    longitude: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successId, setSuccessId] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const scrollToForm = (categoryId) => {
    setForm((f) => ({ ...f, category: categoryId }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({ ...f, latitude, longitude }));
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await res.json();
          if (data?.display_name) {
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.county ||
              "";
            setForm((f) => ({
              ...f,
              address: data.display_name,
              city: cityName,
            }));
          }
        } catch (_) {
          // reverse geocode optional — silently ignore
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const validate = () => {
    const er = {};
    if (!form.title.trim()) er.title = "Title likhna zaroori hai";
    if (!form.description.trim()) er.description = "Thodi detail to likhein";
    if (!form.category) er.category = "Category select karein";
    if (!form.city) er.city = "City select karein";
    if (!form.address.trim() && !form.latitude)
      er.address = "Location batayein";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setSubmitting(true);
    try {
      let lat = form.latitude;
      let lng = form.longitude;

      // Agar GPS se coordinates nahi mile, address ko geocode karo
      if (!lat || !lng) {
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              `${form.address}, ${form.city}, Pakistan`,
            )}`,
          );
          const geoData = await geoRes.json();
          if (geoData?.[0]) {
            lat = parseFloat(geoData[0].lat);
            lng = parseFloat(geoData[0].lon);
          }
        } catch (_) {
          // geocode fail hua, aage error handle karega
        }
      }

      if (!lat || !lng) {
        const fallback = CITY_CENTERS[form.city];
        if (fallback) {
          lat = fallback[0];
          lng = fallback[1];
        } else {
          setErrors({
            submit:
              "Location detect nahi ho saki. Address zyada specific likhein ya GPS use karein.",
          });
          setSubmitting(false);
          return;
        }
      }

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("category", form.category);
      payload.append("address", form.address);
      payload.append("city", form.city);
      payload.append("latitude", lat);
      payload.append("longitude", lng);
      if (imageFile) payload.append("image", imageFile);

      const res = await api.post("/complaints/", payload);

      setSuccessId(res.data?.id ?? res.data?.complaint_id ?? "OK");
      setForm({
        title: "",
        description: "",
        category: "",
        address: "",
        latitude: null,
        longitude: null,
      });
      removeImage();
    } catch (err) {
      setErrors({
        submit:
          err?.response?.data?.detail ||
          "Submit nahi ho saka, dobara try karein.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F8FC] text-[#0F1729] font-['Inter']">
      {/* 1. HERO */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-[#5B6B85] mb-6"
          >
            <PulsePin size={10} />
            Aap ki report, shehar ki behtari
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-['Sora'] font-bold text-4xl md:text-6xl leading-tight"
          >
            Apni Awaaz Uthayen,{" "}
            <span style={{ color: "#2F6FED" }}>Ek Report Se</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-lg text-[#5B6B85] max-w-2xl mx-auto"
          >
            Bijli, paani, sadak ya kachray ka masla ho — location aur tasveer ke
            sath report karein, hum baaqi handle karte hain.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex justify-center gap-8 text-sm text-[#5B6B85] font-mono"
          >
            <div>
              <p className="text-2xl font-bold text-[#0F1729]">4</p>
              <p>Cities Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F1729]">~2 min</p>
              <p>Avg. Report Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F1729]">AI</p>
              <p>Powered Priority</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORY QUICK-SELECT */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-['Sora'] font-semibold text-2xl text-center mb-2">
            Category Select Karein
          </h2>
          <p className="text-center text-[#5B6B85] mb-10">
            Card par click karein — form neeche auto-fill ho jayega
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => scrollToForm(cat.id)}
                className={`glass rounded-2xl p-5 flex flex-col items-start gap-3 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
                  form.category === cat.id
                    ? "ring-2 ring-offset-2 ring-[#2F6FED]"
                    : ""
                }`}
              >
                <span
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}1A` }}
                >
                  <CategoryIcon color={cat.color}>{cat.icon}</CategoryIcon>
                </span>
                <span className="font-medium">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MAIN FORM */}
      <section ref={formRef} className="px-6 pb-24 scroll-mt-24">
        <div className="max-w-2xl mx-auto glass rounded-3xl p-6 md:p-10">
          <h2 className="font-['Sora'] font-semibold text-2xl mb-1">
            Complaint Details
          </h2>
          <p className="text-[#5B6B85] mb-8 text-sm">
            {user
              ? `Submitting as ${user.username}`
              : "Login karke submit karein taake status track kar sakein"}
          </p>

          <AnimatePresence mode="wait">
            {successId ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: "#14B8A61A" }}
                >
                  <PulsePin size={18} />
                </div>
                <h3 className="font-['Sora'] font-semibold text-xl mb-2">
                  Report Submit Ho Gaya!
                </h3>
                <p className="text-[#5B6B85] mb-6">
                  Reference ID:{" "}
                  <span className="font-mono font-semibold text-[#0F1729]">
                    #{successId}
                  </span>
                </p>
                <div className="flex justify-center gap-3">
                  <Link
                    to="/track-complaint"
                    className="px-5 py-2.5 rounded-xl text-white text-sm font-medium"
                    style={{ backgroundColor: "#2F6FED" }}
                  >
                    Track Complaint
                  </Link>
                  <button
                    onClick={() => setSuccessId(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[#5B6B85]/20"
                  >
                    Another Report
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Streetlight band hai past 1 week se"
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-[#5B6B85]/15 outline-none focus:border-[#2F6FED] transition-colors"
                  />
                  {errors.title && (
                    <p className="text-xs mt-1" style={{ color: "#FF6B4A" }}>
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Category select (synced dropdown, in case user scrolled here directly) */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-[#5B6B85]/15 outline-none focus:border-[#2F6FED] transition-colors"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs mt-1" style={{ color: "#FF6B4A" }}>
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* City select */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    City
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-[#5B6B85]/15 outline-none focus:border-[#2F6FED] transition-colors"
                  >
                    <option value="">Select city</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                  {errors.city && (
                    <p className="text-xs mt-1" style={{ color: "#FF6B4A" }}>
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Masla kya hai, kab se hai, kitna severe hai..."
                    className="w-full px-4 py-3 rounded-xl bg-white/70 border border-[#5B6B85]/15 outline-none focus:border-[#2F6FED] transition-colors resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs mt-1" style={{ color: "#FF6B4A" }}>
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Location
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Address ya landmark"
                      className="flex-1 px-4 py-3 rounded-xl bg-white/70 border border-[#5B6B85]/15 outline-none focus:border-[#2F6FED] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={useMyLocation}
                      disabled={locating}
                      className="px-4 rounded-xl text-sm font-medium whitespace-nowrap flex items-center gap-2"
                      style={{ backgroundColor: "#2F6FED1A", color: "#2F6FED" }}
                    >
                      {locating ? "Locating..." : "📍 Use My Location"}
                    </button>
                  </div>
                  {form.latitude && (
                    <p className="text-xs mt-1 text-[#5B6B85] font-mono">
                      {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}
                    </p>
                  )}
                  {errors.address && (
                    <p className="text-xs mt-1" style={{ color: "#FF6B4A" }}>
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Photo (recommended)
                  </label>
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 rounded-xl border-2 border-dashed border-[#5B6B85]/25 flex flex-col items-center justify-center gap-1 text-[#5B6B85] hover:border-[#2F6FED] transition-colors"
                    >
                      <span className="text-2xl">📷</span>
                      <span className="text-sm">Tap to upload image</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImagePick}
                    className="hidden"
                  />
                </div>

                {errors.submit && (
                  <p
                    className="text-sm text-center"
                    style={{ color: "#FF6B4A" }}
                  >
                    {errors.submit}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl text-white font-medium disabled:opacity-60"
                  style={{ backgroundColor: "#2F6FED" }}
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 4. TIPS */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3
              className="font-['Sora'] font-semibold text-lg mb-4"
              style={{ color: "#14B8A6" }}
            >
              ✓ Karein
            </h3>
            <ul className="space-y-3 text-sm text-[#5B6B85]">
              {TIPS_DO.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "#14B8A6" }}>•</span> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3
              className="font-['Sora'] font-semibold text-lg mb-4"
              style={{ color: "#FF6B4A" }}
            >
              ✕ Na Karein
            </h3>
            <ul className="space-y-3 text-sm text-[#5B6B85]">
              {TIPS_DONT.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: "#FF6B4A" }}>•</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. WHAT HAPPENS NEXT */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-10">
          <h2 className="font-['Sora'] font-semibold text-2xl mb-8">
            Aage Kya Hoga?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              ["Cluster", "AI similar reports ke sath group karta hai"],
              ["Priority", "Admin dashboard par severity/frequency se rank"],
              ["Resolve", "Status live update hota hai Track page par"],
            ].map(([title, desc], i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: "#2F6FED" }}
                >
                  0{i + 1}
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-[#5B6B85]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/how-it-works"
            className="inline-block mt-8 text-sm font-medium"
            style={{ color: "#2F6FED" }}
          >
            Poora process dekhein →
          </Link>
        </div>
      </section>

      {/* 6. FAQ + CTA */}
      <section className="px-6 pb-28">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-['Sora'] font-semibold text-2xl text-center mb-8">
            Common Questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-medium"
                >
                  {f.q}
                  <span
                    className="transition-transform"
                    style={{
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 overflow-hidden"
                    >
                      <p className="pb-4 text-sm text-[#5B6B85]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-[#5B6B85] mb-4">Pehle se koi report kiya hai?</p>
            <button
              onClick={() => navigate("/track-complaint")}
              className="px-6 py-3 rounded-xl font-medium border"
              style={{ borderColor: "#2F6FED", color: "#2F6FED" }}
            >
              Track Complaint
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
