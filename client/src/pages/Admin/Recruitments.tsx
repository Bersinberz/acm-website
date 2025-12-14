import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
  getAllRecruitments,
  createRecruitment,
  updateRecruitment,
  deleteRecruitment,
  toggleRecruitmentStatus,
} from "../../services/admin/recruitmentService";


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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recruitmentToDelete, setRecruitmentToDelete] = useState<Recruitment | null>(null);


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

  // For display in cards (e.g. "31 Dec 2025")
  const formatDisplayDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // For input[type="date"] value (YYYY-MM-DD)
  const formatInputDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  /* ---------------- MOCK LOAD ---------------- */
  useEffect(() => {
    const fetchRecruitments = async () => {
      try {
        setLoading(true);

        const start = Date.now();
        const res = await getAllRecruitments();

        const MIN_DELAY = 400;
        const elapsed = Date.now() - start;
        if (elapsed < MIN_DELAY) {
          await new Promise(r => setTimeout(r, MIN_DELAY - elapsed));
        }

        setRecruitments(
          (res.recruitments || []).sort(
            (a: Recruitment, b: Recruitment) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
        );
      } catch {
        setToast({
          show: true,
          variant: "error",
          message: "Failed to load recruitments",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecruitments();
  }, []);


  /* ---------------- ACTIONS ---------------- */
  const toggleRecruitment = async (id: string, current: boolean) => {
    try {
      await toggleRecruitmentStatus(id, !current);

      setRecruitments(prev =>
        prev.map(r =>
          r._id === id ? { ...r, isOpen: !current } : r
        )
      );

      setToast({
        show: true,
        variant: "success",
        message: "Recruitment status updated",
      });
    } catch {
      setToast({
        show: true,
        variant: "error",
        message: "Failed to update status",
      });
    }
  };


  const handleSave = async () => {
    if (!form.title || !form.role) {
      setToast({
        show: true,
        variant: "warning",
        message: "Title and role are required",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        const updated = await updateRecruitment(editingId, form);
        setRecruitments(prev =>
          prev.map(r => (r._id === editingId ? updated : r))
        );

        setToast({
          show: true,
          variant: "success",
          message: "Recruitment updated",
        });
      } else {
        const created = await createRecruitment(form);
        setRecruitments(prev => [created, ...prev]);

        setToast({
          show: true,
          variant: "success",
          message: "Recruitment created",
        });
      }

      setShowModal(false);
      setEditingId(null);
      setForm({
        title: "",
        role: "",
        description: "",
        startDate: "",
        endDate: "",
        isOpen: true,
      });
    } catch {
      setToast({
        show: true,
        variant: "error",
        message: "Failed to save recruitment",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (r: Recruitment) => {
    setForm({
      title: r.title,
      role: r.role,
      description: r.description,
      startDate: formatInputDate(r.startDate),
      endDate: formatInputDate(r.endDate),
      isOpen: r.isOpen,
    });

    setEditingId(r._id);
    setShowModal(true);
  };


  const handleDelete = async () => {
    if (!recruitmentToDelete) return;

    try {
      setLoading(true);
      await deleteRecruitment(recruitmentToDelete._id);

      setRecruitments(prev =>
        prev.filter(r => r._id !== recruitmentToDelete._id)
      );

      setToast({
        show: true,
        variant: "success",
        message: "Recruitment deleted",
      });
    } catch {
      setToast({
        show: true,
        variant: "error",
        message: "Failed to delete recruitment",
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setRecruitmentToDelete(null);
    }
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
                  className={`badge rounded-pill px-3 py-2 d-flex align-items-center gap-2 ${r.isOpen
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
                  onClick={() => toggleRecruitment(r._id, r.isOpen)}
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
                  <span>{formatDisplayDate(r.startDate)}</span>
                  <i className="bi bi-arrow-right text-secondary mx-1" style={{ fontSize: '0.7rem' }}></i>
                  <span>{formatDisplayDate(r.endDate)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25 mt-auto">
                <div className="d-flex align-items-center gap-2 text-light">
                  <div
                    className="bg-primary bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 32, height: 32 }}
                  >
                    <i className="bi bi-people-fill text-primary small"></i>
                  </div>
                  <span className="fw-semibold">{r.applicantsCount}</span>
                  <span className="text-secondary small">Applicants</span>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-info rounded-pill px-3"
                    onClick={() => handleEdit(r)}
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    onClick={() => {
                      setRecruitmentToDelete(r);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Delete
                  </button>
                </div>
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
                <h5 className="modal-title fw-bold">
                  {editingId ? "Edit Recruitment" : "Create New Drive"}
                </h5>

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
                  <input
                    type="text"
                    className="form-control form-control-glass"
                    placeholder="e.g. Chairperson, Media Head, Coordinator"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                  />
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
                <button
                  className="btn btn-primary rounded-pill px-5 fw-bold"
                  onClick={handleSave}
                >
                  {editingId ? "Update Drive" : "Create Drive"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-glass rounded-4 p-4 text-center">
              <div className="modal-body">
                <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
                  <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2 text-white">Delete Recruitment?</h4>
                <p className="text-secondary mb-4">
                  Are you sure you want to delete{" "}
                  <strong>{recruitmentToDelete?.title}</strong>? This action cannot be undone.
                </p>

                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-outline-light rounded-pill px-4"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger rounded-pill px-4 fw-bold"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Recruitments;