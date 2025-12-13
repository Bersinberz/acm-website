import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { createEvent, deleteEvent, getAllEvents, toggleEventDisplay, updateEvent } from "../../services/admin/eventService";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

// --- CSS Styles for Animation & Design ---
const styles = `
  /* --- Keyframes --- */
  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse-glow {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }

  /* --- Glassmorphism Card Design --- */
  .event-card {
    background: rgba(31, 41, 55, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }
  
  .event-card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.2);
    background: rgba(31, 41, 55, 0.95);
    z-index: 10;
  }

  .event-card::before {
    content: "";
    position: absolute;
    top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: 0.5s;
  }
  
  .event-card:hover::before {
    left: 100%;
  }

  /* --- Action Buttons --- */
  .card-action-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    cursor: pointer;
  }

  .card-action-btn:hover {
    transform: scale(1.1);
  }

  .btn-edit:hover { background: rgba(13, 110, 253, 0.2); color: #3b82f6; border-color: #3b82f6; }
  .btn-delete:hover { background: rgba(220, 53, 69, 0.2); color: #ef4444; border-color: #ef4444; }

  /* --- IOS Toggle Switch --- */
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
  }
  
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #374151;
    transition: .4s;
    border-radius: 34px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  
  input:checked + .slider {
    background-color: #10b981; /* Green when active */
    border-color: #10b981;
  }
  
  input:checked + .slider:before {
    transform: translateX(22px);
  }

  /* --- Modal & Form (Preserved) --- */
  .custom-modal-overlay {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    z-index: 1050;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .custom-modal-content {
    background: #1f2937;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    border-radius: 20px;
    width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto;
  }

  /* Scrollbar */
  .custom-modal-content::-webkit-scrollbar { width: 8px; }
  .custom-modal-content::-webkit-scrollbar-track { background: transparent; }
  .custom-modal-content::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 4px; }

  .form-control-dark {
    background-color: #374151;
    border: 1px solid #4b5563;
    color: #ffffff !important;
  }
  .form-control-dark:focus {
    background-color: #374151;
    border-color: #3b82f6;
    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25);
  }
  .form-control-dark::placeholder { color: #9ca3af !important; }
  .form-control-dark::-webkit-calendar-picker-indicator { filter: invert(1); cursor: pointer; }
  
  .form-section {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
    .custom-modal-overlay.closing {
  animation: fadeOut 0.3s ease-in forwards;
}

.custom-modal-overlay.closing .custom-modal-content {
  animation: scaleOut 0.25s ease-in forwards;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.92); opacity: 0; }
}

.modal-content-glass {
  background: #1f2937 !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  color: #ffffff;
}

.modal-content-glass .modal-body {
  background: transparent;
}

.modal-content-glass h4 {
  color: #ffffff;
}

.modal-content-glass p {
  color: #9ca3af;
}

`;

/* Types */
interface ContactPerson {
  name: string;
  phone: string;
}

interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  contactPersons: ContactPerson[];
  registrationQuestions: string[];
  whatsappGroupLink?: string;
  display: boolean;
}

const EventManager: React.FC = () => {
  const [activePage, setActivePage] = useState("Events");
  const navigate = useNavigate();

  /* Events list */
  const [events, setEvents] = useState<Event[]>([]);

  /* Modal control */
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    variant: "success" | "error" | "info" | "warning";
    message: string;
    title?: string;
  }>({
    show: false,
    variant: "info",
    message: "",
  });

  const showToast = (
    variant: "success" | "error" | "info" | "warning",
    message: string,
    title?: string
  ) => {
    setToast({ show: true, variant, message, title });
  };

  const parseTime = (time?: string) => {
    if (!time) return { hour: "", minute: "", meridian: "" };

    // Handle ISO string or HH:MM:SS
    if (time.includes("T")) {
      const date = new Date(time);
      let h = date.getHours();
      const m = date.getMinutes();

      const meridian = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;

      return {
        hour: String(h).padStart(2, "0"),
        minute: String(m).padStart(2, "0"),
        meridian,
      };
    }

    // Handle "HH:MM:SS"
    if (time.split(":").length === 3) {
      let [hour, minute] = time.split(":");
      let h = parseInt(hour, 10);

      const meridian = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;

      return {
        hour: String(h).padStart(2, "0"),
        minute: minute,
        meridian,
      };
    }

    // Handle "HH:MM AM"
    if (time.includes(" ")) {
      const [hm, meridian] = time.split(" ");
      const [hour, minute] = hm.split(":");
      return { hour, minute, meridian };
    }

    // Handle "HH:MM"
    if (time.includes(":")) {
      let [hour, minute] = time.split(":");
      let h = parseInt(hour, 10);

      const meridian = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;

      return {
        hour: String(h).padStart(2, "0"),
        minute: minute || "00",
        meridian,
      };
    }

    return { hour: "", minute: "", meridian: "" };
  };



  /* Form state */
  const [form, setForm] = useState<Event>({
    _id: "",
    name: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    contactPersons: [{ name: "", phone: "" }],
    registrationQuestions: [""],
    whatsappGroupLink: "",
    display: true,
  });

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      setEvents(response.events || []);
    } catch (error) {
      showToast("error", "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleLogout = () => navigate("/admin/login");
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  // --- Helper: Reset Form ---
  const resetForm = () => {
    setForm({
      _id: "",
      name: "",
      date: "",
      time: "",
      venue: "",
      description: "",
      contactPersons: [{ name: "", phone: "" }],
      registrationQuestions: [""],
      whatsappGroupLink: "",
      display: true,
    });
    setEditingId(null);
  };

  // --- Modal Logic ---
  const handleCreateEvent = () => {
    resetForm();
    setIsClosing(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      resetForm();
    }, 300);
  };

  // 1. Edit
  const handleEditEvent = (event: Event) => {
    const formattedDate = event.date
      ? new Date(event.date).toISOString().split("T")[0]
      : "";

    // ---- FIX TIME ----
    const formattedTime = event.time || "";

    setForm({
      ...event,
      date: formattedDate,
      time: formattedTime,
    });

    setEditingId(event._id);
    setIsClosing(false);
    setShowModal(true);
  };


  const handleDeleteEvent = async () => {
    if (!eventToDelete?._id) return;

    try {
      setLoading(true);
      await deleteEvent(eventToDelete._id);
      setEvents(prev => prev.filter(e => e._id !== eventToDelete._id));
      showToast("success", "Event deleted successfully");
      setShowDeleteModal(false);
    } catch {
      showToast("error", "Failed to delete event");
    } finally {
      setLoading(false);
    }
  };



  // 3. Toggle Status (Mock Implementation + State Update)
  const handleToggleDisplay = async (id: string, currentDisplay: boolean) => {
    try {

      const newDisplay = !currentDisplay;

      // 🔥 Persist to DB
      await toggleEventDisplay(id, newDisplay);

      // ✅ Update UI after success
      setEvents(prev =>
        prev.map(e =>
          e._id === id ? { ...e, display: newDisplay } : e
        )
      );
    } catch (error) {
      showToast("error", "Failed to update event visibility");
    }
  };


  // 4. Save (Create or Update)
  const handleSaveEvent = async () => {
    if (!form.name) {
      showToast("warning", "Event name is required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await updateEvent(editingId, form);
        showToast("success", "Event updated successfully");
      } else {
        await createEvent(form);
        showToast("success", "Event created successfully");
      }

      await fetchAllEvents();
      closeModal();
    } catch (error) {
      showToast("error", "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const { hour, minute, meridian } = parseTime(form.time);


  return (
    <div className="d-flex vh-100" style={{ background: "#111827", color: "white" }}>
      {/* Inject Styles */}
      <style>{styles}</style>

      <Loader
        loading={loading}
        variant="orbit"
        fullscreen
        theme="dark"
      />
      <Message
        show={toast.show}
        variant={toast.variant}
        title={toast.title}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      >
        {toast.message}
      </Message>

      <Sidebar
        active={activePage}
        onSelect={(page) => setActivePage(page)}
        onLogout={handleLogout}
      />

      <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold text-white mb-1">Events Dashboard</h2>
            <p className="text-secondary m-0">Manage your schedule and registrations</p>
          </div>
          <button
            className="btn btn-primary px-4 py-2 fw-semibold shadow-lg d-flex align-items-center gap-2"
            onClick={handleCreateEvent}
            style={{ borderRadius: '12px' }}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Create Event</span>
          </button>
        </div>

        {/* Events Grid */}
        <div className="row g-4">
          {events.length === 0 && (
            <div className="col-12 text-center py-5">
              <i className="bi bi-calendar-x display-1 text-white opacity-50 mb-3 d-block"></i>
              <h4 className="text-white fw-semibold">No events found</h4>
              <p className="text-white-50">Create a new event to get started!</p>
            </div>
          )}

          {events.map((event, index) => (
            <div
              key={event._id}
              className="col-12 col-md-6 col-xl-4"
              style={{ animation: `slideInUp 0.5s ease-out forwards ${index * 0.1}s`, opacity: 0 }}
            >
              <div className="event-card h-100 d-flex flex-column p-4">

                {/* Card Top: Status & Toggle */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div
                    className={`badge rounded-pill px-3 py-2 ${event.display
                        ? "bg-success bg-opacity-10 text-success"
                        : "bg-secondary bg-opacity-25 text-secondary"
                      }`}
                  >
                    <i
                      className={`bi ${event.display
                          ? "bi-eye-fill"
                          : "bi-eye-slash-fill"
                        } me-2`}
                    ></i>
                    {event.display ? "Visible" : "Hidden"}
                  </div>


                  <label className="toggle-switch" title="Toggle Active Status">
                    <input
                      type="checkbox"
                      checked={event.display !== false}
                      onChange={() => handleToggleDisplay(event._id, event.display !== false)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* Card Body: Info */}
                <div className="mb-4 flex-grow-1">
                  <h4 className="fw-bold text-white mb-3 text-truncate" title={event.name}>
                    {event.name}
                  </h4>

                  <div className="d-flex flex-column gap-2 text-secondary">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary border-opacity-25" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-calendar-event text-info"></i>
                      </div>
                      <span className="small">{event.date}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary border-opacity-25" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-clock text-warning"></i>
                      </div>
                      <span className="small">{event.time}</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center border border-secondary border-opacity-25" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-geo-alt text-danger"></i>
                      </div>
                      <span className="small text-truncate">{event.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Actions */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-25">
                  <div className="small text-muted d-flex align-items-center gap-1">
                    <i className="bi bi-people"></i>
                    {event.contactPersons?.length || 0} Contacts
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="card-action-btn btn-edit text-light"
                      onClick={() => handleEditEvent(event)}
                      title="Edit Event"
                    >
                      <i className="bi bi-pencil-fill small"></i>
                    </button>

                    <button
                      className="card-action-btn btn-delete text-light"
                      onClick={() => {
                        setEventToDelete(event);
                        setShowDeleteModal(true);
                      }}
                      title="Delete Event"
                    >
                      <i className="bi bi-trash-fill small"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* --- Unified Modal (Create & Edit) --- */}
        {showModal && (
          <div className={`custom-modal-overlay ${isClosing ? 'closing' : ''}`}>
            <div className="custom-modal-content p-4 m-3">

              {/* Modal Header */}
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
                <h4 className="m-0 fw-bold text-white">
                  {editingId ? "Edit Event" : "Create New Event"}
                </h4>
                <button
                  onClick={closeModal}
                  className="btn btn-link text-secondary text-decoration-none fs-4 p-0"
                  style={{ lineHeight: 1 }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body-custom">

                {/* Event Name */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Event Name</label>
                  <input
                    className="form-control form-control-dark mb-3 p-3"
                    placeholder="Enter event name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />

                  {/* Date & Time */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label text-secondary small fw-bold">Event Date</label>
                      <input
                        type="date"
                        className="form-control form-control-dark"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-secondary small fw-bold">Event Time</label>
                      <div className="d-flex gap-2">
                        {/* Hours */}
                        <select
                          className="form-control form-control-dark"
                          value={hour}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              time: `${e.target.value || "01"}:${minute || "00"} ${meridian || "AM"}`,
                            });
                          }}
                        >
                          <option value="">HH</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const h = String(i + 1).padStart(2, "0");
                            return (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            );
                          })}
                        </select>

                        {/* Minutes */}
                        <select
                          className="form-control form-control-dark"
                          value={minute}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              time: `${hour || "01"}:${e.target.value || "00"} ${meridian || "AM"}`,
                            });
                          }}
                        >
                          <option value="">MM</option>
                          {["00", "15", "30", "45"].map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>

                        {/* AM / PM */}
                        <select
                          className="form-control form-control-dark"
                          value={meridian}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              time: `${hour || "01"}:${minute || "00"} ${e.target.value || "AM"}`,
                            });
                          }}
                        >
                          <option value="">AM/PM</option>
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Venue */}
                  <label className="form-label text-secondary small fw-bold">Venue</label>
                  <div className="input-group mb-4">
                    <span className="input-group-text bg-dark border-secondary text-light">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                      className="form-control form-control-dark"
                      placeholder="Venue location"
                      value={form.venue}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Event Description</label>
                  <textarea
                    className="form-control form-control-dark"
                    rows={3}
                    placeholder="Describe the event..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Contact Persons */}
                <div className="form-section mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="m-0 text-info">
                      <i className="bi bi-person-lines-fill me-2"></i>Contact Persons
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => setForm({ ...form, contactPersons: [...form.contactPersons, { name: "", phone: "" }] })}
                    >
                      <i className="bi bi-plus-lg me-1"></i>Add
                    </button>
                  </div>

                  {form.contactPersons.map((cp, i) => (
                    <div key={i} className="row g-2 align-items-end mb-2">
                      <div className="col">
                        <label className="form-label text-secondary small">Name</label>
                        <input
                          className="form-control form-control-dark form-control-sm"
                          value={cp.name}
                          onChange={(e) => {
                            const list = [...form.contactPersons];
                            list[i].name = e.target.value;
                            setForm({ ...form, contactPersons: list });
                          }}
                        />
                      </div>
                      <div className="col">
                        <label className="form-label text-secondary small">Phone</label>
                        <input
                          className="form-control form-control-dark form-control-sm"
                          value={cp.phone}
                          onChange={(e) => {
                            const list = [...form.contactPersons];
                            list[i].phone = e.target.value;
                            setForm({ ...form, contactPersons: list });
                          }}
                        />
                      </div>
                      <div className="col-auto">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={form.contactPersons.length === 1}
                          onClick={() => {
                            const list = form.contactPersons.filter((_, index) => index !== i);
                            setForm({ ...form, contactPersons: list });
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Registration Questions */}
                <div className="form-section mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="m-0 text-warning">
                      <i className="bi bi-list-check me-2"></i>Registration Questions
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => setForm({ ...form, registrationQuestions: [...form.registrationQuestions, ""] })}
                    >
                      <i className="bi bi-plus-lg me-1"></i>Add
                    </button>
                  </div>

                  {form.registrationQuestions.map((q, i) => (
                    <div key={i} className="d-flex gap-2 align-items-end mb-2">
                      <div className="flex-grow-1">
                        <label className="form-label text-secondary small">Question {i + 1}</label>
                        <input
                          className="form-control form-control-dark form-control-sm"
                          value={q}
                          onChange={(e) => {
                            const list = [...form.registrationQuestions];
                            list[i] = e.target.value;
                            setForm({ ...form, registrationQuestions: list });
                          }}
                        />
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={form.registrationQuestions.length === 1}
                        onClick={() => {
                          const list = form.registrationQuestions.filter((_, index) => index !== i);
                          setForm({ ...form, registrationQuestions: list });
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>

                {/* WhatsApp */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">WhatsApp Group Link</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-secondary text-success">
                      <i className="bi bi-whatsapp"></i>
                    </span>
                    <input
                      className="form-control form-control-dark"
                      placeholder="https://chat.whatsapp.com/..."
                      value={form.whatsappGroupLink}
                      onChange={(e) => setForm({ ...form, whatsappGroupLink: e.target.value })}
                    />
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top border-secondary border-opacity-25">
                <button className="btn btn-outline-light px-4 rounded-pill" onClick={closeModal}>
                  Cancel
                </button>
                <button className="btn btn-success px-4 rounded-pill fw-bold" onClick={handleSaveEvent}>
                  {editingId ? "Update Event" : "Save Event"}
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content modal-content-glass rounded-4 p-3 text-center">
                <div className="modal-body">
                  <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
                    <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-2 text-white">Delete Member?</h4>
                  <p className="text-secondary mb-4">Are you sure you want to remove <strong>{eventToDelete?.name}</strong>? This action cannot be undone.</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <button className="btn btn-outline-light rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    <button className="btn btn-danger rounded-pill px-4 fw-bold" onClick={handleDeleteEvent}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventManager;