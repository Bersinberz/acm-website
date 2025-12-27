import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ---------------- ADMIN PAGES ---------------- */
import Dashboard from "./pages/Admin/Dashboard";
import Members from "./pages/Admin/Members";
import EventManager from "./pages/Admin/EventManager";
import Recruitments from "./pages/Admin/Recruitments";
import AdminSettings from "./pages/Admin/Adminsettings";
import AdminLogin from "./pages/Admin/AdminLogin";

/* ---------------- WEBSITE PAGES ---------------- */
import Home from "./pages/website/Home";
import About from "./pages/website/Aboutus";
import Membership from "./pages/website/Membership";
import Ourroots from "./pages/website/Ourroots";
import JoinUs from "./pages/website/Joinus";

/* ---------------- COMPONENTS ---------------- */
import Nav from "./components/Navbar";
import ScrollToTop from "./components/ScrolltoTop";
import LogoLoading from "./components/logoLoader";

/* ---------------- STYLES ---------------- */
import "./App.css";
import Archives from "./pages/website/archives";
import Inaugural from "./pages/website/Archives/inaugural";
import Azure from "./pages/website/Archives/azure";
import Genai from "./pages/website/Archives/genAi";
import Digiart from "./pages/website/Archives/digitalart";

function App() {
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);

  /* -------- SHOW LOADER ON EVERY ROUTE CHANGE -------- */
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  /* ---------------- ADMIN ROUTES (NO NEBULA) ---------------- */
  if (isAdminRoute) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/members" element={<Members />} />
        <Route path="/admin/eventmanager" element={<EventManager />} />
        <Route path="/admin/recruitments" element={<Recruitments />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    );
  }

  /* ---------------- WEBSITE ROUTES (WITH NEBULA) ---------------- */
  return (
    <>
      <Nav />

      <AnimatePresence mode="wait">
        {loading ? (
          <LogoLoading />
        ) : (
          <motion.div
            key={location.pathname}
            className="main-contentapp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/archives" element={<Archives />} />
              <Route path="/archives/inaugural" element={<Inaugural />} />
              <Route path="/archives/azure" element={<Azure />} />
              <Route path="/archives/genai" element={<Genai />} />
              <Route path="/archives/digiart" element={<Digiart />} />
              <Route path="/our-roots" element={<Ourroots />} />
              <Route path="/join-us" element={<JoinUs />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------- ROOT WRAPPER ---------------- */
function Root() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}

export default Root;