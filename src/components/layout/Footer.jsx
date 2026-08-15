import { Link } from "react-router-dom";

const footerLinks = {
  Platform: [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Report an Issue", path: "/report-issue" },
    { name: "Live Map", path: "/live-map" },
  ],
  Community: [
    { name: "Community Insights", path: "/community-insights" },
    { name: "Track Complaint", path: "/track-complaint" },
    { name: "Help / FAQ", path: "/help" },
  ],
  Company: [
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Settings", path: "/settings" },
  ],
};

function Footer() {
  return (
    <footer className="relative mt-32 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="font-display font-bold text-lg text-white">
                Problem<span className="text-secondary">Mapper</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-powered civic complaint mapping for Karachi, Lahore, Hyderabad
              & Faisalabad.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-semibold text-white mb-4 text-sm tracking-wide">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-slate-400 hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Problem Mapper. Built for Pakistan's
            cities.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>Karachi</span>
            <span>Lahore</span>
            <span>Hyderabad</span>
            <span>Faisalabad</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
