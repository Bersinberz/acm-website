import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/acm-logo.png";

// --- CSS Styles ---
const sidebarStyles = `
  .custom-sidebar {
    width: 260px;
    min-width: 260px;
    height: 100vh;
    background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
    box-shadow: 4px 0 24px rgba(0,0,0,0.25);
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    z-index: 1000;
  }

  .nav-btn {
    border: none;
    background: transparent;
    color: #9ca3af;
    transition: all 0.3s ease;
    border-radius: 12px;
  }

  .nav-btn:hover:not(.active) {
    color: #f3f4f6;
    background: rgba(255,255,255,0.05);
    transform: translateX(4px);
  }

  .nav-btn:hover i {
    transform: scale(1.15);
    color: #60a5fa;
  }

  .nav-btn.active {
    background: linear-gradient(
      90deg,
      rgba(37,99,235,0.15),
      rgba(37,99,235,0.05)
    );
    color: #60a5fa;
    box-shadow: 0 0 12px rgba(37,99,235,0.2);
    border-left: 3px solid #60a5fa;
    border-radius: 4px 12px 12px 4px;
  }

  .nav-btn.active i {
    filter: drop-shadow(0 0 8px rgba(96,165,250,0.6));
    transform: scale(1.08);
  }

  .nav-btn i {
    transition: all 0.25s ease;
  }
`;

interface SidebarProps {
  active?: string;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: "bi-speedometer2", path: "/admin/dashboard" },
    { label: "Members", icon: "bi-people-fill", path: "/admin/members" },
    { label: "Events", icon: "bi-calendar-event-fill", path: "/admin/eventmanager" },
    { label: "Recruitment", icon: "bi-person-plus-fill", path: "/admin/recruitments" },
    { label: "Settings", icon: "bi-gear-fill", path: "/admin/settings" },
  ];


  return (
    <>
      <style>{sidebarStyles}</style>

      <aside className="custom-sidebar d-flex flex-column justify-content-between py-4">
        {/* Top Section */}
        <div className="px-3">
          {/* Logo */}
          <div className="d-flex align-items-center mb-5 ps-2">
            <img
              src={logo}
              alt="Logo"
              style={{ width: 40 }}
              className="me-2 flex-shrink-0"
            />
            <h5
              className="fw-bold text-white m-0"
              style={{ letterSpacing: "1px" }}
            >
              ACM <span className="text-primary">SIGAI</span>
            </h5>
          </div>

          {/* Navigation */}
          <ul className="nav flex-column gap-2">
            {menuItems.map((item) => (
              <li key={item.label} className="nav-item">
                <button
                  className={`btn w-100 d-flex align-items-center nav-btn p-3 ${active === item.label ? "active" : ""
                    }`}
                  onClick={() => navigate(item.path)}
                >
                  <i className={`bi ${item.icon} fs-5`}></i>
                  <span className="ms-3">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="px-3">
          <button
            className="btn w-100 d-flex align-items-center nav-btn text-danger p-3"
            onClick={onLogout}
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
            <span className="ms-3 fw-semibold">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
