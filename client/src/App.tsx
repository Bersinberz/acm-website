import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Members from "./pages/Admin/Members";
import EventManager from "./pages/Admin/EventManager";
import Recruitments from "./pages/Admin/Recruitments";
import AdminSettings from "./pages/Admin/Adminsettings";
import AdminLogin from "./pages/Admin/AdminLogin";
import Home from "./pages/website/Home";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LogoLoading from "./components/logoLoader";

import "./App.css"
import Nav from "./components/Navbar";
import ScrollToTop from "./components/ScrolltoTop";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="containerapp">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/members" element={<Members />} />
          <Route path="/admin/eventmanager" element={<EventManager />} />
          <Route path="/admin/recruitments" element={<Recruitments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="containerapp">
      <Nav />
      <AnimatePresence mode='wait'>
        {loading ? (
          <LogoLoading />
        ) : (
          <motion.div
            className="main-contentapp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Root() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}

export default Root;