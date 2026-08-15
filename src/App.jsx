import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing/Landing";
import Home from "./pages/Home/Home";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import ReportIssue from "./pages/ReportIssue/ReportIssue";
import LiveMap from "./pages/LiveMap/LiveMap";
import TrackComplaint from "./pages/TrackComplaint/TrackComplaint";
import CommunityInsights from "./pages/CommunityInsights/CommunityInsights";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Profile from "./pages/Profile/Profile";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Notifications from "./pages/Notifications/Notifications";
import Settings from "./pages/Settings/Settings";
import HelpFAQ from "./pages/HelpFAQ/HelpFAQ";
import NotFound from "./pages/NotFound/NotFound";

// Routes that should NOT show the global Navbar/Footer (standalone pages)
const NO_LAYOUT_ROUTES = ["/login", "/register"];

function AppLayout() {
  const location = useLocation();
  const hideLayout = NO_LAYOUT_ROUTES.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />
        <Route path="/community-insights" element={<CommunityInsights />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<HelpFAQ />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
