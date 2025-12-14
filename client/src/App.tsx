import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Members from "./pages/Admin/Members";
import EventManager from "./pages/Admin/EventManager"
import Recruitments from "./pages/Admin/Recruitments";
import AdminSettings from "./pages/Admin/Adminsettings";
import AdminLogin from "./pages/Admin/adminLogin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/members" element={<Members />} />
        <Route path="/admin/eventmanager" element={<EventManager />} />
        <Route path="/admin/recruitments" element={<Recruitments />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
