import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username aur password dono required hain.");
      return;
    }

    setLoading(true);
    const result = await login(formData.username, formData.password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(
        result.message || "Login fail ho gaya. Username/password check karein.",
      );
    }
  };

  return (
    <main className="grid min-h-screen w-full grid-cols-1 bg-text-dark font-[Inter] lg:grid-cols-2">
      {/* ===== LEFT: Animated Hover Heading Panel ===== */}
      <section className="relative hidden overflow-hidden bg-text-dark lg:flex lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-text-dark/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-text-dark/20 blur-[100px]" />

        <div className="relative z-10 max-w-lg px-12">
          <div className="mb-16 flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary/70 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-secondary" />
            </span>
            <span className="font-[Sora] text-xl font-bold text-white">
              Problem<span className="text-primary">Mapper</span>
            </span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-[Sora] text-5xl font-extrabold leading-[1.1] text-white"
          >
            <motion.span
              whileHover={{ x: 6, color: "#364fc7" }}
              transition={{ duration: 0.25 }}
              className="inline-block cursor-default"
            >
              Apne shehar ki
            </motion.span>
            <br />
            <motion.span
              whileHover={{ x: 6 }}
              transition={{ duration: 0.25 }}
              className="inline-block cursor-default"
            >
              <span className="text-secondary transition-colors duration-300 hover:text-primary">
                awaaz
              </span>{" "}
              ban jaiye.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-base text-text-muted"
          >
            Login karein, complaints track karein, aur apni community ke saath
            civic problems solve honay ka safar dekhein.
          </motion.p>
        </div>
      </section>

      {/* ===== RIGHT: Login Form Only ===== */}
      <section className="flex items-center justify-center bg-bg px-6 py-12 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <h2 className="font-[Sora] text-3xl font-bold text-text-dark">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Account nahi hai?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              autoComplete="username"
              className="w-full rounded-xl border border-transparent bg-white px-4 py-3.5 text-sm text-text-dark shadow-sm outline-none transition focus:border-text-dark focus:ring-2 focus:ring-text-dark/20"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl border border-transparent bg-white px-4 py-3.5 pr-14 text-sm text-text-dark shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-text-muted/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-text-muted hover:text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p className="rounded-lg bg-text-dark/10 px-3 py-2 text-sm text-alert">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-text-muted">
                <input type="checkbox" className="rounded border-white" />
                Remember me
              </label>
              <Link
                to="/settings"
                className="font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <span aria-hidden="true">→</span>}
            </motion.button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
