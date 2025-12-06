import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/acm-logo.png";

// --- CSS Styles (Injected for portability) ---
const sidebarStyles = `
  .custom-sidebar {
    background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
    position: relative;
    overflow: hidden;
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
    background: linear-gradient(90deg, rgba(37,99,235,0.15), rgba(37,99,235,0.05));
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

  .nav-label {
    transition: all 0.25s ease;
  }

  .collapsed .nav-label {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  .toggle-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #374151;
    color: #fff;
    border: 2px solid #1f2937;
    position: absolute;
    top: 30px;
    right: -14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .toggle-btn:hover {
    background: #60a5fa;
    transform: scale(1.1);
  }
`;

interface SidebarProps {
    onSelect?: (page: string) => void;
    active?: string;
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, active = "Dashboard", onLogout }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems = [
        { label: "Dashboard", icon: "bi-speedometer2" },
        { label: "Users", icon: "bi-people-fill" },
        { label: "Events", icon: "bi-calendar-event-fill" },
        { label: "Analytics", icon: "bi-graph-up-arrow" },
        { label: "Settings", icon: "bi-gear-fill" },
    ];

    return (
        <>
            <style>{sidebarStyles}</style>

            <aside
                className={`custom-sidebar d-flex flex-column justify-content-between py-4 ${!isExpanded ? "collapsed" : ""
                    }`}
                style={{ width: isExpanded ? "260px" : "80px", height: "100vh" }}
            >
                {/* Toggle Button */}
                <div
                    className="toggle-btn shadow-sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <i className={`bi ${isExpanded ? "bi-chevron-left" : "bi-chevron-right"} fs-6`}></i>
                </div>

                {/* Top Section */}
                <div className="px-3">

                    {/* Logo */}
                    <div className="d-flex align-items-center mb-5 ps-2">
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ width: isExpanded ? "40px" : "32px", transition: "0.25s" }}
                            className="me-2 flex-shrink-0"
                        />
                        {isExpanded && (
                            <h5 className="fw-bold text-white m-0 nav-label" style={{ letterSpacing: "1px" }}>
                                ACM <span className="text-primary">SIGAI</span>
                            </h5>
                        )}
                    </div>

                    {/* Navigation Items */}
                    <ul className="nav flex-column gap-2">
                        {menuItems.map((item) => (
                            <li key={item.label} className="nav-item">
                                <button
                                    className={`btn w-100 d-flex align-items-center nav-btn p-3 ${active === item.label ? "active" : ""
                                        }`}
                                    onClick={() => onSelect && onSelect(item.label)}
                                    title={!isExpanded ? item.label : ""}
                                >
                                    <i className={`bi ${item.icon} fs-5`}></i>
                                    {isExpanded && <span className="ms-3 nav-label">{item.label}</span>}
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
                        {isExpanded && <span className="ms-3 nav-label fw-semibold">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;