import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/Admin/adminLogin";
import Dashboard from "./pages/Admin/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
