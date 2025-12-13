import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/Admin/adminLogin";
import Dashboard from "./pages/Admin/Dashboard";
import Members from "./pages/Admin/Members";
import EventManager from "./pages/Admin/EventManager"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/members" element={<Members />} />
        <Route path="/admin/eventmanager" element={<EventManager />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
