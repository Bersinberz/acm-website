import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

/* ---------------- TYPES ---------------- */
interface Recruitment {
  _id: string;
  title: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  applicantsCount: number;
}

/* ---------------- COMPONENT ---------------- */
const Recruitments: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    variant: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  const [form, setForm] = useState<Omit<Recruitment, "_id" | "applicantsCount">>({
    title: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    isOpen: true,
  });

  /* ---------------- MOCK LOAD ---------------- */
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRecruitments([
        {
          _id: "1",
          title: "ACM SIGAI Recruitment 2025",
          role: "Core Team Member",
          description: "Recruiting passionate core members and volunteers for the upcoming term.",
          startDate: "2025-01-10",
          endDate: "2025-02-05",
          isOpen: true,
          applicantsCount: 42,
        },
        {
          _id: "2",
          title: "Design Team Hiring",
          role: "Media Unit",
          description: "Looking for creative UI/UX & Poster Designers to join our media wing.",
          startDate: "2024-12-01",
          endDate: "2024-12-15",
          isOpen: false,
          applicantsCount: 18,
        },
      ]);
      setLoading(false);
    }, 400);
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const toggleRecruitment = (id: string) => {
    setRecruitments((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isOpen: !r.isOpen } : r))
    );
    setToast({ show: true, variant: "success", message: "Status updated successfully" });
  };

  const handleCreate = () => {
    if (!form.title) {
      setToast({ show: true, variant: "warning", message: "Recruitment title is required" });
      return;
    }

    setRecruitments((prev) => [
      { _id: Date.now().toString(), applicantsCount: 0, ...form },
      ...prev,
    ]);

    setShowModal(false);
    setForm({ title: "", role: "", description: "", startDate: "", endDate: "", isOpen: true });
    setToast({ show: true, variant: "success", message: "Recruitment created successfully" });
  };

  /* ---------------- STYLES ---------------- */
  const styles = `
    /* --- Animations --- */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleInModal {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .animate-card {
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0; /* Hidden initially */
    }

    /* --- Glassmorphism Card --- */
    .recruitment-card {
      background: linear-gradient(145deg, rgba(31, 41, 55, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .recruitment-card:hover {
      transform: translateY(-5px);
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.5);
      background: rgba(31, 41, 55, 0.85);
    }

    .recruitment-card::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
      transition: 0.5s;
    }

    .recruitment-card:hover::before {
      left: 100%;
    }

    /* --- Inputs & Selects --- */
    .form-control-glass, .form-select-glass {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 8px;
      padding: 10px 12px;
      transition: all 0.2s;
    }
    
    .form-control-glass:focus, .form-select-glass:focus {
      background: rgba(0, 0, 0, 0.5);
      border-color: #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
      color: white;
    }
    
    .form-control-glass::placeholder { color: rgba(255,255,255,0.5); }

    /* Fix for Select Options Visibility */
    .form-select-glass option {
      background-color: #1f2937; /* Dark background for options */
      color: #ffffff; /* White text for options */
    }

    /* --- Modal --- */
    .modal-content-glass {
      background: #1f2937;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      animation: scaleInModal 0.3s ease-out forwards;
    }
  `;

  /* ---------------- RENDER ---------------- */
  return (
    <AdminLayout
      active="Recruitment"
      loading={loading}
      toast={toast || undefined}
      onCloseToast={() => setToast(null)}
    >
      <style>{styles}</style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-end mb-5 animate-card" style={{ animationDelay: '0ms' }}>
        <div>
          <h1 className="fw-bold text-white mb-2" style={{ letterSpacing: '-1px' }}>Recruitments</h1>
          <p className="text-secondary m-0">Manage recruitment drives and applications.</p>
        </div>
        <button
          className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-lg d-flex align-items-center gap-2 hover-scale"
          onClick={() => setShowModal(true)}
          style={{ transition: 'transform 0.2s' }}
        >
          <i className="bi bi-plus-lg"></i>
          <span>New Drive</span>
        </button>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {recruitments.length === 0 && !loading && (
          <div className="col-12 text-center text-secondary py-5">
            <i className="bi bi-folder2-open display-4 opacity-50 mb-3 d-block"></i>
            <h4>No recruitments found</h4>
            <p>Create a new recruitment drive to get started.</p>
          </div>
        )}

        {recruitments.map((r, index) => (
          <div key={r._id} className="col-12 col-md-6 col-xl-4 animate-card" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="recruitment-card p-4">
              
              {/* Top Row */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                {/* Updated Badge Colors for Visibility */}
                <span 
                  className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-2 ${
                    r.isOpen 
                      ? "bg-success bg-opacity-25 border border-success border-opacity-50" 
                      : "bg-secondary bg-opacity-25 border border-secondary border-opacity-50"
                  }`}
                  style={{ color: r.isOpen ? '#86efac' : '#d1d5db' }} // Explicit light green / light gray text
                >
                  <i className={`bi ${r.isOpen ? "bi-check-circle-fill" : "bi-lock-fill"}`}></i>
                  {r.isOpen ? "Open" : "Closed"}
                </span>
                
                <button
                  className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
                  onClick={() => toggleRecruitment(r._id)}
                  style={{ fontSize: '0.8rem' }}
                >
                  {r.isOpen ? "Close Drive" : "Re-open"}
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow-1">
                <h4 className="fw-bold text-white mb-2 text-truncate" title={r.title}>{r.title}</h4>
                
                <div className="d-flex align-items-center gap-2 mb-3">
                   <span className="badge bg-primary bg-opacity-20 text-primary-subtle border border-primary border-opacity-20">
                     <i className="bi bi-briefcase me-1"></i> {r.role}
                   </span>
                </div>

                <p className="text-secondary small mb-4 line-clamp-3" style={{ minHeight: '3em' }}>
                  {r.description}
                </p>

                <div className="d-flex align-items-center gap-2 text-secondary small bg-dark bg-opacity-50 p-2 rounded-3 border border-secondary border-opacity-20 mb-4">
                   <i className="bi bi-calendar-event text-info ms-1"></i>
                   <span>{r.startDate}</span>
                   <i className="bi bi-arrow-right text-secondary mx-1" style={{ fontSize: '0.7rem' }}></i>
                   <span>{r.endDate}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-auto">
                <div className="d-flex align-items-center gap-2 text-light">
                   <div className="bg-primary bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                      <i className="bi bi-people-fill text-primary small"></i>
                   </div>
                   <span className="fw-semibold">{r.applicantsCount}</span>
                   <span className="text-secondary small">Applicants</span>
                </div>

                <button className="btn btn-link text-primary text-decoration-none p-0 fw-medium d-flex align-items-center gap-1 hover-icon-move">
                   Details <i className="bi bi-arrow-right"></i>
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-glass rounded-4 overflow-hidden text-light">
              
              <div className="modal-header border-bottom border-secondary border-opacity-25 p-4">
                <h5 className="modal-title fw-bold">Create New Drive</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">Title</label>
                  <input
                    className="form-control form-control-glass"
                    placeholder="e.g. Core Team Recruitment 2025"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">Role / Position</label>
                  <select
                    className="form-select form-select-glass"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="" disabled>Select...</option>
                    <option value="Chairperson">Chairperson</option>
                    <option value="Vice Chairperson">Vice Chairperson</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Core Team Member">Core Team Member</option>
                    <option value="Media Unit">Media Unit</option>
                    <option value="Volunteer Unit">Volunteer Unit</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold text-uppercase">Description</label>
                  <textarea
                    className="form-control form-control-glass"
                    rows={3}
                    placeholder="Briefly describe the responsibilities..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-bold text-uppercase">Start Date</label>
                    <input
                      type="date"
                      className="form-control form-control-glass"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-secondary small fw-bold text-uppercase">End Date</label>
                    <input
                      type="date"
                      className="form-control form-control-glass"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-check form-switch p-3 bg-dark bg-opacity-50 rounded-3 border border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
                   <label className="form-check-label text-white fw-medium mb-0 ms-1">
                      Immediately Open Applications?
                   </label>
                   <input
                      className="form-check-input m-0"
                      type="checkbox"
                      style={{ width: '3em', height: '1.5em', cursor: 'pointer' }}
                      checked={form.isOpen}
                      onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                   />
                </div>
              </div>

              <div className="modal-footer border-top border-secondary border-opacity-25 p-4">
                <button className="btn btn-outline-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary rounded-pill px-5 fw-bold" onClick={handleCreate}>Create Drive</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Recruitments;