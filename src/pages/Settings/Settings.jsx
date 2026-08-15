import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { user, logout } = useAuth();

  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [profileStatus, setProfileStatus] = useState({
    state: "idle",
    message: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    state: "idle",
    message: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyStatusUpdates, setNotifyStatusUpdates] = useState(true);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ state: "loading", message: "" });
    try {
      await axios.patch("/auth/profile/", profileForm);
      setProfileStatus({ state: "success", message: "Profile updated." });
    } catch (err) {
      console.error("Settings: profile update failed", err);
      setProfileStatus({
        state: "error",
        message: "Couldn't update profile. Please try again.",
      });
    }
  };

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordStatus({
        state: "error",
        message: "New passwords don't match.",
      });
      return;
    }
    setPasswordStatus({ state: "loading", message: "" });
    try {
      await axios.post("/auth/change-password/", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordStatus({ state: "success", message: "Password changed." });
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      console.error("Settings: password change failed", err);
      setPasswordStatus({
        state: "error",
        message: "Couldn't change password. Check your current password.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* 1. Header */}
      <section className="pt-28 pb-10 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-text-muted mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Settings
          </span>
          <h1 className="font-[Sora] text-3xl md:text-5xl font-semibold text-text-dark mb-2">
            Account settings
          </h1>
          <p className="text-text-muted">
            Manage your profile, password, and notification preferences.
          </p>
        </motion.div>
      </section>

      {/* 2. Profile info */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-10">
        <form
          onSubmit={handleProfileSubmit}
          className="glass rounded-2xl p-6 md:p-8"
        >
          <h2 className="font-[Sora] text-lg font-semibold text-text-dark mb-4">
            Profile information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Username
              </label>
              <input
                name="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="03XXXXXXXXX"
                className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={profileStatus.state === "loading"}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary transition-colors disabled:opacity-60"
          >
            {profileStatus.state === "loading" ? "Saving…" : "Save Changes"}
          </button>
          {profileStatus.message && (
            <p
              className={`text-sm mt-3 ${
                profileStatus.state === "success"
                  ? "text-secondary"
                  : "text-alert"
              }`}
            >
              {profileStatus.message}
            </p>
          )}
        </form>
      </section>

      {/* 3. Change password */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-10">
        <form
          onSubmit={handlePasswordSubmit}
          className="glass rounded-2xl p-6 md:p-8"
        >
          <h2 className="font-[Sora] text-lg font-semibold text-text-dark mb-4">
            Change password
          </h2>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 pr-11 text-text-dark outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                  tabIndex={-1}
                >
                  {showPasswords.current ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 pr-11 text-text-dark outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                    tabIndex={-1}
                  >
                    {showPasswords.new ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirm_password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-2.5 pr-11 text-text-dark outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                    tabIndex={-1}
                  >
                    {showPasswords.confirm ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={passwordStatus.state === "loading"}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary transition-colors disabled:opacity-60"
          >
            {passwordStatus.state === "loading"
              ? "Updating…"
              : "Update Password"}
          </button>
          {passwordStatus.message && (
            <p
              className={`text-sm mt-3 ${
                passwordStatus.state === "success"
                  ? "text-secondary"
                  : "text-alert"
              }`}
            >
              {passwordStatus.message}
            </p>
          )}
        </form>
      </section>

      {/* 4. Notification preferences */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-10">
        <div className="glass rounded-2xl p-6 md:p-8">
          <h2 className="font-[Sora] text-lg font-semibold text-text-dark mb-4">
            Notifications
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-dark">
                Email me when my complaint status changes
              </span>
              <input
                type="checkbox"
                checked={notifyStatusUpdates}
                onChange={() => setNotifyStatusUpdates((v) => !v)}
                className="w-5 h-5 accent-primary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-dark">
                Send me occasional community updates
              </span>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={() => setNotifyEmail((v) => !v)}
                className="w-5 h-5 accent-primary"
              />
            </label>
          </div>
          <p className="text-xs text-text-muted mt-4">
            Note: these preferences are stored locally for now — backend saving
            isn't wired up yet.
          </p>
        </div>
      </section>

      {/* 5. Role / account type info */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-10">
        <div className="glass rounded-2xl p-6 md:p-8 flex items-center justify-between">
          <div>
            <h2 className="font-[Sora] text-lg font-semibold text-text-dark mb-1">
              Account type
            </h2>
            <p className="text-sm text-text-muted">
              You're signed in as a{" "}
              {user?.role === "admin" ? "administrator" : "citizen"}.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-text-dark/10 text-primary">
            {user?.role || "citizen"}
          </span>
        </div>
      </section>

      {/* 6. Logout */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-10">
        <div className="glass rounded-2xl p-6 md:p-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-[Sora] text-lg font-semibold text-text-dark mb-1">
              Log out
            </h2>
            <p className="text-sm text-text-muted">
              End your session on this device.
            </p>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-full glass text-text-dark font-medium hover:bg-white/70 transition-colors shrink-0"
          >
            Log Out
          </button>
        </div>
      </section>

      {/* 7. Danger zone */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-10">
        <div className="rounded-2xl border border-accent/30 bg-text-dark/5 p-6 md:p-8">
          <h2 className="font-[Sora] text-lg font-semibold text-alert mb-1">
            Danger zone
          </h2>
          <p className="text-sm text-text-muted mb-4">
            Deleting your account removes your profile and complaint history
            permanently. This can't be undone.
          </p>
          <input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder='Type "DELETE" to confirm'
            className="w-full max-w-xs rounded-xl border border-accent/40 bg-white/70 px-4 py-2.5 text-text-dark outline-none focus:ring-2 focus:ring-alert mb-3"
          />
          <button
            disabled={deleteConfirmText !== "DELETE"}
            className="px-6 py-2.5 rounded-full bg-alert text-white font-medium hover:bg-alert transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete My Account
          </button>
        </div>
      </section>

      {/* 8. Help footer note */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto pb-24 text-center">
        <p className="text-sm text-text-muted">
          Need help with your account?{" "}
          <a href="/contact" className="text-primary font-medium">
            Contact us
          </a>
        </p>
      </section>
    </div>
  );
}
