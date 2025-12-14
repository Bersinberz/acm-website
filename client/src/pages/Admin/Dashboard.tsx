import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useNavigate } from "react-router-dom";
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
import { getDashboardData, syncDashboard } from "../../services/admin/dashboardService";

/* ---------------- TYPES ---------------- */
interface DashboardStats {
  totalMembers: number;
  ongoingEvents: number;
  upcomingEvents: number;
  totalEvents: number;
}

interface UpcomingEvent {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  contactPersons?: { name: string; phone: string }[];
}


interface OngoingRecruitment {
  _id: string;
  title: string;
  role: string;
  createdAt: string;
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
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [eventTrends, setEventTrends] = useState<any[]>([]);
  const [upcomingEvent, setUpcomingEvent] = useState<UpcomingEvent | null>(null);
  const [ongoingRecruitments, setOngoingRecruitments] =
    useState<OngoingRecruitment[]>([]);
  const navigate = useNavigate();


  /* ---------------- FETCH (MOCK) ---------------- */
  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();

      setStats(data.stats);
      setUpcomingEvent(data.latestEvent);
      setOngoingRecruitments(data.ongoingRecruitments);
      setEventTrends(data.eventTrends);
      setRecentActivity(data.recentActivity);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDashboard();
  }, []);

  const handleSync = async () => {
    try {
      setLoading(true);
      await syncDashboard();
      await loadDashboard();
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

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

          {/* Right Column - Upcoming Event */}
          <div className="col-12 col-lg-4 d-flex">
            <div className="animate-up w-100" style={{ animationDelay: "600ms" }}>
              {upcomingEvent && (
                <div className="glass-panel p-4 h-100 d-flex flex-column">
                  <h5 className="fw-bold text-white mb-3">
                    <i className="bi bi-calendar-event text-primary me-2"></i>
                    Next Upcoming Event
                  </h5>

                  <div className="border border-secondary border-opacity-25 rounded-3 p-3 flex-grow-1">
                    <h6 className="text-white mb-2">{upcomingEvent.name}</h6>

                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-calendar3 text-primary"></i>
                      <small className="text-secondary">{upcomingEvent.date}</small>
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-2">
                      <i className="bi bi-clock text-primary"></i>
                      <small className="text-secondary">{upcomingEvent.time}</small>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-geo-alt text-primary"></i>
                      <small className="text-secondary">{upcomingEvent.venue}</small>
                    </div>
                    {/* Contact Persons */}
                    {upcomingEvent.contactPersons && upcomingEvent.contactPersons.length > 0 && (
                      <div className="mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <h6 className="text-white mb-2">
                          <i className="bi bi-telephone-fill text-primary me-2"></i>
                          Contact Persons
                        </h6>

                        <div className="d-flex flex-column gap-2">
                          {upcomingEvent.contactPersons.map((cp, idx) => (
                            <div
                              key={idx}
                              className="d-flex justify-content-between align-items-center px-3 py-2 rounded-3"
                              style={{ background: "rgba(255,255,255,0.05)" }}
                            >
                              <span className="text-white fw-semibold">{cp.name}</span>
                              <span className="text-primary small">{cp.phone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                <button
                  className="btn btn-sm btn-link text-decoration-none text-secondary"
                  onClick={() => navigate("/admin/recruitments")}
                >
                  Manage All <i className="bi bi-arrow-right ms-1"></i>
                </button>
              </div>

              <div className="row g-3">
                {ongoingRecruitments.length === 0 ? (
                  <p className="text-secondary text-center">No open recruitments</p>
                ) : (
                  ongoingRecruitments.map((rec) => (
                    <div key={rec._id} className="col-12 col-md-6">
                      <div className="border border-secondary border-opacity-25 rounded-3 p-3 h-100">
                        <h6 className="text-white mb-1">{rec.title}</h6>

                        <span className="badge bg-primary text-white mb-2">
                          {rec.role}
                        </span>

                        <div className="text-secondary small">
                          Opened on{" "}
                          {new Date(rec.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
              </div>
              <ul className="list-unstyled m-0 d-flex flex-column gap-3">
                {recentActivity.slice(0, 3).map((a, i) => (
                  <li key={i} className="list-item-hover p-2 rounded-3">
                    <h6 className="text-white m-0">{a.title}</h6>
                    <span className="text-secondary small">{a.subtitle}</span>
                    <div className="text-secondary small">
                      {new Date(a.time).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-top border-white border-opacity-10 text-center">
                <button
                  className="btn btn-outline-light btn-sm w-100 rounded-pill"
                  onClick={handleSync}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Syncing... <i className="bi bi-arrow-repeat ms-1"></i>
                    </>
                  ) : (
                    <>
                      Sync Data <i className="bi bi-arrow-repeat ms-1"></i>
                    </>
                  )}
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