import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <div className="d-flex vh-100" style={{ background: "#1f2937", color: "white" }}>
      
      <Sidebar 
        active={activePage} 
        onSelect={(page) => setActivePage(page)} 
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold mb-4">{activePage}</h2>

        <div className="bg-dark p-4 rounded shadow-sm">
          <h5 className="fw-bold text-primary mb-2">
            {activePage === "Dashboard" && "Welcome Admin 👋"}
          </h5>

          <p className="text-secondary">
            {activePage === "Dashboard" && "This is your dashboard overview."}
            {activePage === "Users" && "Manage users here."}
            {activePage === "Events" && "Manage events here."}
            {activePage === "Settings" && "Configure application settings here."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
