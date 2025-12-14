import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

/* ---------------- TYPES ---------------- */
interface DashboardStats {
  totalMembers: number;
  ongoingEvents: number;
  upcomingEvents: number;
  totalEvents: number;
}

interface RecentMember {
  name: string;
  joinedAt: string;
  role: string;
}

interface Requirement {
  id: number;
  title: string;
  category: "Manpower" | "Technical" | "Finance" | "Outreach";
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress";
}

interface UpcomingEvent {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
}

/* ---------------- COMPONENT ---------------- */
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
    totalEvents: 0,
  });
  const [recentMembers, setRecentMembers] = useState<RecentMember[]>([]);
  const [eventTrends, setEventTrends] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<UpcomingEvent | null>(null);
  const [eventVisibility, setEventVisibility] = useState({
    visible: 18,
    hidden: 6,
  });

  /* ---------------- FETCH (MOCK) ---------------- */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 400));

        setStats({
          totalMembers: 86,
          ongoingEvents: 1,
          upcomingEvents: 3,
          totalEvents: 24,
        });

        setRecentMembers([
          { name: "Arun Kumar", role: "Student", joinedAt: "2 hrs ago" },
          { name: "Sneha R", role: "Volunteer", joinedAt: "5 hrs ago" },
          { name: "Vignesh S", role: "Student", joinedAt: "1 day ago" },
          { name: "Pavithra M", role: "Core Member", joinedAt: "2 days ago" },
        ]);

        setEventTrends([
          { month: "Jan", events: 2 },
          { month: "Feb", events: 4 },
          { month: "Mar", events: 3 },
          { month: "Apr", events: 6 },
          { month: "May", events: 2 },
          { month: "Jun", events: 5 },
        ]);

        setRequirements([
          { id: 1, title: "Volunteers Needed", category: "Manpower", priority: "High", status: "Open" },
          { id: 2, title: "Technical Support", category: "Technical", priority: "Medium", status: "In Progress" },
          { id: 3, title: "Sponsorship Required", category: "Finance", priority: "High", status: "Open" },
          { id: 4, title: "Social Media Promotion", category: "Outreach", priority: "Medium", status: "In Progress" },
        ]);

        setUpcomingEvent({
          id: 1,
          name: "Annual Tech Symposium",
          date: "May 25, 2024",
          time: "2:00 PM - 6:00 PM",
          venue: "Main Auditorium",
        });

        setEventVisibility({
          visible: 18,
          hidden: 6,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ---------------- STYLES ---------------- */
  const styles = `
    /* --- Animations --- */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }

    .animate-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    /* --- Cards --- */
    .stat-card {
      background: linear-gradient(145deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%);
      transform: translateX(-100%);
      transition: 0.5s;
    }

    .stat-card:hover::before {
      transform: translateX(100%);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
      border-color: rgba(59,130,246,0.4);
    }

    .icon-wrapper {
      width: 48px; height: 48px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 12px;
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      transition: all 0.3s ease;
    }

    .stat-card:hover .icon-wrapper {
      background: #3b82f6;
      color: white;
      transform: scale(1.1) rotate(5deg);
    }

    /* --- Glass Panels --- */
    .glass-panel {
      background: rgba(31, 41, 55, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .list-item-hover:hover {
      background: rgba(255,255,255,0.03);
      padding-left: 10px;
    }
    
    .list-item-hover {
      transition: all 0.2s ease;
    }

    /* --- Progress Bar --- */
    .progress-gradient {
      background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%);
      border-radius: 10px;
      height: 8px;
    }

    .progress-container {
      background: rgba(255,255,255,0.05);
      border-radius: 10px;
      overflow: hidden;
      height: 8px;
    }

    /* --- Badge Styles --- */
    .badge-high {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
    }

    .badge-medium {
      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
      color: white;
      border: none;
    }

    .badge-low {
      background: linear-gradient(135deg, #64748b 0%, #475569 100%);
      color: white;
      border: none;
    }

    .badge-category {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    /* --- Button Styles --- */
    .btn-gradient {
      background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
      color: white;
      border: none;
      transition: all 0.3s ease;
    }

    .btn-gradient:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
    }

    .btn-outline-gradient {
      background: transparent;
      border: 1px solid #3b82f6;
      color: #3b82f6;
      transition: all 0.3s ease;
    }

    .btn-outline-gradient:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: #06b6d4;
      color: #06b6d4;
    }
  `;

  // Custom colors for chart bars
  const barColors = ["#3b82f6", "#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#e879f9"];

  /* ---------------- RENDER ---------------- */
  return (
    <AdminLayout active="Dashboard" loading={loading}>
      <style>{styles}</style>

      <div className="p-2">
        {/* Header */}
        <div className="mb-5 animate-up" style={{ animationDelay: '0ms' }}>
          <h1 className="fw-bold text-white mb-1 display-6">Welcome Back, Admin</h1>
          <p className="text-secondary m-0">
            Here's what's happening with your chapter today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 mb-5">
          {[
            { label: "Total Members", value: stats.totalMembers, icon: "bi-people-fill", delay: '100ms' },
            { label: "Ongoing Events", value: stats.ongoingEvents, icon: "bi-activity", delay: '200ms' },
            { label: "Upcoming Events", value: stats.upcomingEvents, icon: "bi-calendar-check-fill", delay: '300ms' },
            { label: "Total Events", value: stats.totalEvents, icon: "bi-trophy-fill", delay: '400ms' },
          ].map((item, i) => (
            <div key={i} className="col-12 col-md-6 col-xl-3 animate-up" style={{ animationDelay: item.delay }}>
              <div className="stat-card p-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="text-secondary text-uppercase small fw-bold tracking-wider" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                      {item.label}
                    </span>
                    <h2 className="fw-bold text-white m-0 mt-2 display-5">{item.value}</h2>
                  </div>
                  <div className="icon-wrapper shadow-sm">
                    <i className={`bi ${item.icon} fs-4`}></i>
                  </div>
                </div>

                {/* Visual Indicator (Mock Trend) */}
                <div className="d-flex align-items-center gap-2 mt-auto pt-2 border-top border-white border-opacity-10">
                  <span className="badge rounded-pill" style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    color: 'white'
                  }}>
                    <i className="bi bi-arrow-up-short"></i> 12%
                  </span>
                  <span className="text-secondary small">vs last month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 mb-4">
          {/* Event Trends Chart */}
          <div className="col-12 col-lg-8 animate-up" style={{ animationDelay: '500ms' }}>
            <div className="glass-panel p-4 h-100 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white m-0">
                  <i className="bi bi-bar-chart-fill text-primary me-2"></i>
                  Event Analytics
                </h5>
                <select className="form-select form-select-sm bg-dark text-white border-secondary" style={{ width: 'auto' }}>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>

              <div className="flex-grow-1" style={{ minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{
                        background: "rgba(31, 41, 55, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                      }}
                    />
                    <Bar dataKey="events" radius={[8, 8, 0, 0]} barSize={40}>
                      {eventTrends.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Multiple Panels */}
          <div className="col-12 col-lg-4">
            <div className="d-flex flex-column gap-4">
              {/* Event Visibility Breakdown */}
              <div className="animate-up" style={{ animationDelay: '550ms' }}>
                <div className="glass-panel p-4">
                  <h5 className="fw-bold text-white mb-3">
                    <i className="bi bi-eye-fill text-primary me-2"></i>
                    Event Visibility
                  </h5>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-white">Visible Events</span>
                      <span className="text-primary fw-bold">{eventVisibility.visible}</span>
                    </div>
                    <div className="progress-container">
                      <div
                        className="progress-gradient"
                        style={{
                          width: `${(eventVisibility.visible / (eventVisibility.visible + eventVisibility.hidden)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-white">Hidden Events</span>
                      <span className="text-secondary">{eventVisibility.hidden}</span>
                    </div>
                    <div className="progress-container">
                      <div
                        className="bg-secondary bg-opacity-25"
                        style={{
                          width: `${(eventVisibility.hidden / (eventVisibility.visible + eventVisibility.hidden)) * 100}%`,
                          height: '8px',
                          borderRadius: '10px'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Event Highlight */}
              <div className="animate-up" style={{ animationDelay: '600ms' }}>
                <div className="glass-panel p-4">
                  <h5 className="fw-bold text-white mb-3">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    Featured Event
                  </h5>
                  {upcomingEvent && (
                    <div className="border border-secondary border-opacity-25 rounded-3 p-3 hover-shadow">
                      <h6 className="text-white mb-2">{upcomingEvent.name}</h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-calendar3 text-primary"></i>
                        <small className="text-secondary">{upcomingEvent.date}</small>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-clock text-primary"></i>
                        <small className="text-secondary">{upcomingEvent.time}</small>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <i className="bi bi-geo-alt text-primary"></i>
                        <small className="text-secondary">{upcomingEvent.venue}</small>
                      </div>
                      <button className="btn btn-outline-gradient btn-sm w-100 rounded-pill">
                        View Event Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Ongoing Requirements Section */}
          <div className="col-12 col-lg-8 animate-up" style={{ animationDelay: '650ms' }}>
            <div className="glass-panel p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white m-0">
                  <i className="bi bi-list-task text-primary me-2"></i>
                  Ongoing Requirements
                </h5>
                <button className="btn btn-sm btn-link text-decoration-none text-secondary">
                  Manage All <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>

              <div className="row g-3">
                {requirements.map((req) => (
                  <div key={req.id} className="col-12 col-md-6">
                    <div className="border border-secondary border-opacity-25 rounded-3 p-3 hover-shadow h-100">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="text-white m-0">{req.title}</h6>
                        <span className={`badge rounded-pill px-3 py-1 ${req.priority === 'High' ? 'badge-high' :
                            req.priority === 'Medium' ? 'badge-medium' : 'badge-low'
                          }`}>
                          {req.priority}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge badge-category rounded-pill px-3 py-1">
                          {req.category}
                        </span>
                        <span className={`badge rounded-pill px-3 py-1 ${req.status === 'Open' ? 'bg-primary bg-opacity-25 text-primary' : 'bg-info bg-opacity-25 text-info'
                          }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                          <i className="bi bi-chat-dots text-secondary"></i>
                          <i className="bi bi-person-plus text-secondary"></i>
                          <i className="bi bi-flag text-secondary"></i>
                        </div>
                        <button className="btn btn-outline-gradient btn-sm rounded-pill px-3">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recently Joined Members */}
          <div className="col-12 col-lg-4 animate-up" style={{ animationDelay: '700ms' }}>
            <div className="glass-panel p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-white m-0">
                  <i className="bi bi-clock-history text-warning me-2"></i>
                  Recent Activity
                </h5>
                <button className="btn btn-sm btn-link text-decoration-none text-secondary">View All</button>
              </div>

              <ul className="list-unstyled m-0 d-flex flex-column gap-3">
                {recentMembers.map((m, i) => (
                  <li
                    key={i}
                    className="list-item-hover d-flex align-items-center p-2 rounded-3"
                  >
                    <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center me-3 border border-secondary border-opacity-25" style={{ width: 40, height: 40 }}>
                      <span className="fw-bold text-white">{m.name.charAt(0)}</span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="text-white m-0 mb-1" style={{ fontSize: '0.95rem' }}>{m.name}</h6>
                      <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25" style={{ fontSize: '0.7rem' }}>
                        {m.role}
                      </span>
                    </div>
                    <small className="text-secondary" style={{ fontSize: '0.8rem' }}>{m.joinedAt}</small>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-3 border-top border-white border-opacity-10 text-center">
                <button className="btn btn-outline-light btn-sm w-100 rounded-pill">
                  Sync Data <i className="bi bi-arrow-repeat ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;