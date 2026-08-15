import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Live Map", path: "/live-map" },
  { name: "Community", path: "/community-insights" },
];

const moreLinks = [
  { name: "Contact", path: "/contact" },
  { name: "Track Complaint", path: "/track-complaint" },
  { name: "Help / FAQ", path: "/help" },
  { name: "Settings", path: "/settings" },
];

function getInitials(username) {
  if (!username) return "?";
  return username.slice(0, 2).toUpperCase();
}

function getProfileMenuLinks(user) {
  const dashboardPath =
    user?.role === "admin" ? "/admin-dashboard" : "/profile";
  return [
    { name: "Dashboard", path: dashboardPath },
    { name: "My Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const moreRef = useRef(null);
  const bellRef = useRef(null);
  const profileRef = useRef(null);

  const profileMenuLinks = getProfileMenuLinks(user);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-lg shadow-slate-200/50">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
            </span>
            <span className="font-display font-bold text-lg text-text-dark whitespace-nowrap">
              Problem<span className="text-primary">Mapper</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-text-muted hover:text-text-dark"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="relative shrink-0" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={`flex items-center gap-1 text-sm font-medium whitespace-nowrap transition-colors ${
                  moreLinks.some((l) => l.path === location.pathname)
                    ? "text-primary"
                    : "text-text-muted hover:text-text-dark"
                }`}
              >
                More
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-3 rounded-xl py-2 w-48 shadow-lg shadow-slate-200/50 bg-white/95 backdrop-blur-md border border-white/60"
                  >
                    {moreLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          location.pathname === link.path
                            ? "text-primary font-medium"
                            : "text-text-muted hover:text-text-dark"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop right side: auth / bell / profile dropdown */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            {user ? (
              <>
                <div className="relative shrink-0" ref={bellRef}>
                  <button
                    onClick={() => setBellOpen(!bellOpen)}
                    className="relative p-2 rounded-full hover:bg-white/60 transition-colors"
                    aria-label="Notifications"
                  >
                    <svg
                      className="w-5 h-5 text-text-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                      />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-alert"></span>
                  </button>

                  <AnimatePresence>
                    {bellOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 rounded-xl py-2 w-72 shadow-lg shadow-slate-200/50 bg-white/95 backdrop-blur-md border border-white/60"
                      >
                        <div className="px-4 py-2 border-b border-white/40">
                          <span className="text-sm font-display font-semibold text-text-dark">
                            Notifications
                          </span>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          <div className="px-4 py-3 hover:bg-white/50 transition-colors">
                            <p className="text-sm text-text-dark">
                              Your complaint status was updated to{" "}
                              <span className="font-medium">In Progress</span>.
                            </p>
                            <span className="text-xs text-text-muted">
                              2 hours ago
                            </span>
                          </div>
                          <div className="px-4 py-3 hover:bg-white/50 transition-colors">
                            <p className="text-sm text-text-dark">
                              A cluster near your area reached{" "}
                              <span className="font-medium">High Priority</span>
                              .
                            </p>
                            <span className="text-xs text-text-muted">
                              1 day ago
                            </span>
                          </div>
                        </div>
                        <Link
                          to="/notifications"
                          onClick={() => setBellOpen(false)}
                          className="block text-center px-4 py-2 text-sm font-medium text-primary hover:underline border-t border-white/40"
                        >
                          View all
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile avatar + dropdown */}
                <div className="relative shrink-0" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 min-w-0"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                      {getInitials(user.username)}
                    </span>
                    <span className="hidden xl:inline text-sm font-medium text-text-muted hover:text-text-dark truncate max-w-36">
                      {user.username}
                    </span>
                    <svg
                      className={`hidden xl:block w-3.5 h-3.5 text-text-muted transition-transform ${profileOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-3 rounded-xl py-2 w-52 shadow-lg shadow-slate-200/50 bg-white/95 backdrop-blur-md border border-white/60"
                      >
                        <div className="px-4 py-2 border-b border-white/40">
                          <p className="text-sm font-semibold text-text-dark truncate">
                            {user.username}
                          </p>
                        </div>

                        {profileMenuLinks.map((link) => (
                          <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-text-muted hover:text-text-dark transition-colors"
                          >
                            {link.name}
                          </Link>
                        ))}

                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-alert hover:bg-alert/5 transition-colors border-t border-white/40"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="shrink-0 text-sm font-medium text-text-muted hover:text-text-dark whitespace-nowrap"
                >
                  Log in
                </Link>
                <Link
                  to="/report-issue"
                  className="shrink-0 text-sm font-semibold px-3 xl:px-4 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors whitespace-nowrap"
                >
                  Report an Issue
                </Link>
              </>
            )}
          </div>

          {/* Mobile / tablet: hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 shrink-0"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-text-dark transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-text-dark transition-opacity ${menuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-text-dark transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>
        </div>

        {/* Mobile / tablet dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass rounded-2xl mt-2 px-6 py-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
            >
              {[...navLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-text-dark"
                >
                  {link.name}
                </Link>
              ))}

              {user && (
                <>
                  <Link
                    to="/notifications"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-text-dark"
                  >
                    Notifications
                  </Link>

                  <div className="pt-2 border-t border-white/40">
                    <button
                      type="button"
                      onClick={() => setMobileProfileOpen((v) => !v)}
                      className="w-full flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                          {getInitials(user.username)}
                        </span>
                        <span className="text-sm font-semibold text-text-dark">
                          {user.username}
                        </span>
                      </span>
                      <svg
                        className={`w-3.5 h-3.5 text-text-muted transition-transform ${
                          mobileProfileOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {mobileProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-3 pl-9 pt-3 overflow-hidden"
                        >
                          {profileMenuLinks.map((link) => (
                            <Link
                              key={link.name}
                              to={link.path}
                              onClick={() => {
                                setMenuOpen(false);
                                setMobileProfileOpen(false);
                              }}
                              className="text-sm font-medium text-text-dark"
                            >
                              {link.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-sm font-semibold text-left text-alert"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-text-dark"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/report-issue"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-semibold text-primary"
                  >
                    Report an Issue
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
