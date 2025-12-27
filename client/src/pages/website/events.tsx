import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence, type Variants } from "framer-motion";
import { 
    FaCalendarAlt, FaMapMarkerAlt, FaClock, FaExternalLinkAlt, 
    FaTimes, FaWhatsapp, FaUser, FaPhoneAlt, FaChevronRight, FaHourglassHalf 
} from "react-icons/fa";
import { fadeIn } from '../../components/transitions';

// --- TYPES ---
interface ContactPerson {
    name: string;
    phone: string;
}

interface EventData {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    link: string;
    whatsappGroupLink?: string;
    contactPersons: ContactPerson[];
    status: "Upcoming" | "Completed";
}

// --- HARDCODED DUMMY DATA ---
const sampleEvents: EventData[] = [
    {
        id: "1",
        title: "AI Nexus: The Generative Frontier",
        date: "Oct 24, 2025",
        time: "10:00 AM - 04:00 PM",
        location: "Tech Park Auditorium, Sathyabama",
        description: "Join us for a deep dive into the world of Large Language Models and Generative AI.",
        link: "https://forms.gle/sample-link-1",
        whatsappGroupLink: "https://chat.whatsapp.com/sample-group",
        contactPersons: [
            { name: "Ms. Nandhika V", phone: "9340050009" },
            { name: "Mr. Rahul Sharma", phone: "9876543210" }
        ],
        status: "Upcoming"
    },
    {
        id: "2",
        title: "CodeQuest 2025: Hackathon",
        date: "2025-12-11",
        time: "09:00 AM (24 Hours)",
        location: "Innovation Lab, Block 5",
        description: "A 24-hour intense coding marathon where teams compete to solve real-world problems.",
        link: "https://forms.gle/sample-link-2",
        whatsappGroupLink: "",
        contactPersons: [
            { name: "Ms. Anushri Rajkumar", phone: "8778810798" }
        ],
        status: "Upcoming"
    },
    {
        // Example of a near-future date to test logic (Update year if testing live)
        id: "3",
        title: "Webinar: Future of Quantum Computing",
        date: "Jan 05, 2026", 
        time: "06:00 PM - 07:30 PM",
        location: "Online (Google Meet)",
        description: "An introductory session on Quantum bits and superposition.",
        link: "https://meet.google.com/sample",
        whatsappGroupLink: "https://chat.whatsapp.com/quantum-future",
        contactPersons: [],
        status: "Upcoming"
    }
];

// --- HELPER: CALCULATE REGISTRATION DEADLINE ---
const getRegistrationStatus = (dateStr: string, timeStr: string) => {
    try {
        // 1. Parse Date (e.g., "Oct 24, 2025")
        // 2. Parse Start Time (Extract "10:00 AM" from "10:00 AM - ...")
        const startTime = timeStr.split(' - ')[0] || "09:00 AM";
        const eventDateTime = new Date(`${dateStr} ${startTime}`);

        // 3. Subtract 24 Hours
        const deadline = new Date(eventDateTime.getTime() - (24 * 60 * 60 * 1000));
        const now = new Date();

        const diffMs = deadline.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (diffMs < 0) {
            return { text: "Registration Closed", color: "#ef4444", isOpen: false };
        } else if (diffDays > 0) {
            return { text: `Registration closes in ${diffDays} days`, color: "#f59e0b", isOpen: true }; // Orange
        } else {
            return { text: `Registration closes in ${diffHours} hours`, color: "#ef4444", isOpen: true }; // Red warning
        }
    } catch (e) {
        return { text: "Registration Open", color: "#10b981", isOpen: true };
    }
};

// --- ANIMATIC: HOLOGRAPHIC RADAR ---
const HolographicRadar = () => {
    return (
        <div className="radar-container">
            <div className="radar-grid"></div>
            <m.div 
                className="radar-sweep"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="radar-core"></div>
        </div>
    );
};

// --- STYLES ---
const styles = `
    :root {
        --primary-blue: #3b82f6;
        --primary-glow: rgba(59, 130, 246, 0.5);
        --glass-bg: rgba(255, 255, 255, 0.03);
        --glass-border: rgba(255, 255, 255, 0.08);
        --radar-color: #00f3ff;
        --whatsapp-green: #25D366;
        --warning: #f59e0b;
        --danger: #ef4444;
        --dark-bg: #0b1121;
    }

    .events-page {
        width: 100%; padding: 140px 20px 100px;
        display: flex; flex-direction: column; align-items: center;
        font-family: 'Poppins', sans-serif; position: relative;
        min-height: 100vh;
    }

    /* --- HEADER --- */
    .page-title {
        font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; color: #fff;
        text-transform: uppercase; margin-bottom: 70px; text-align: center;
        letter-spacing: -3px; text-shadow: 0 5px 30px rgba(0,0,0,0.5);
        line-height: 1;
    }
    .highlight {
        background: linear-gradient(135deg, #fff 20%, var(--primary-blue) 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 20px var(--primary-glow));
    }

    /* --- EVENTS GRID --- */
    .events-grid {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 40px; width: 100%; max-width: 1280px;
    }

    /* --- EVENT CARD --- */
    .event-card {
        background: var(--glass-bg); 
        border: 1px solid var(--glass-border);
        border-radius: 24px; padding: 30px; 
        backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex; flex-direction: column; gap: 20px; position: relative;
        overflow: hidden;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .event-card:hover {
        transform: translateY(-10px) scale(1.02); 
        border-color: rgba(59, 130, 246, 0.5);
        box-shadow: 0 20px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(59, 130, 246, 0.1);
    }

    /* Header: Date Badge */
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; }

    .date-badge {
        background: rgba(59, 130, 246, 0.15); color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.4); padding: 6px 14px;
        border-radius: 50px; font-size: 0.85rem; font-weight: 700;
        display: flex; align-items: center; gap: 8px;
    }

    .event-title {
        font-size: 1.6rem; color: #fff; font-weight: 800; margin: 5px 0 10px;
        line-height: 1.2; letter-spacing: -0.5px;
    }

    .meta-row {
        display: flex; flex-direction: column; gap: 12px; 
        color: #cbd5e1; font-size: 0.95rem; font-weight: 500;
    }
    .meta-item { display: flex; align-items: center; gap: 12px; }
    .meta-icon { color: var(--primary-blue); min-width: 18px; filter: drop-shadow(0 0 5px var(--primary-glow)); }

    /* DEADLINE INFO */
    .deadline-info {
        font-size: 0.85rem; font-weight: 600; 
        display: flex; align-items: center; gap: 8px;
        padding: 8px 0; border-top: 1px solid rgba(255,255,255,0.1);
        margin-top: auto;
    }

    /* View Details Button */
    .view-btn {
        width: 100%;
        padding: 14px; border-radius: 16px; font-weight: 700; font-size: 0.95rem;
        background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff; cursor: pointer; transition: all 0.3s ease;
        display: flex; justify-content: center; align-items: center; gap: 10px;
    }
    .view-btn:hover {
        background: var(--primary-blue); border-color: var(--primary-blue);
        box-shadow: 0 0 25px var(--primary-glow); color: white;
    }

    /* --- MODAL (POPUP) --- */
    .modal-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(12px);
        z-index: 1000; display: flex; justify-content: center; align-items: center;
        padding: 20px;
    }

    .modal-content {
        background: var(--dark-bg); border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 24px; width: 100%; max-width: 650px;
        max-height: 85vh; overflow-y: auto; position: relative;
        box-shadow: 0 0 60px rgba(59, 130, 246, 0.25);
    }

    .modal-header {
        padding: 35px; border-bottom: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(90deg, rgba(59,130,246,0.15) 0%, transparent 100%);
    }
    .modal-title { font-size: 1.8rem; color: #fff; font-weight: 800; margin: 0; line-height: 1.2; }
    
    .close-btn {
        position: absolute; top: 25px; right: 25px;
        background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: #fff;
        width: 40px; height: 40px; border-radius: 50%;
        cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center;
    }
    .close-btn:hover { background: #ef4444; border-color: #ef4444; transform: rotate(90deg); }

    .modal-body { padding: 35px; color: #cbd5e1; }
    .section-label {
        color: #60a5fa; font-size: 0.85rem; text-transform: uppercase;
        letter-spacing: 1.5px; font-weight: 700; margin-bottom: 12px; display: block;
    }
    .modal-desc { line-height: 1.8; margin-bottom: 35px; font-size: 1.05rem; }

    .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 35px; }
    .modal-info-box {
        background: rgba(255,255,255,0.03); padding: 20px; border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08);
    }

    .contact-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 35px; }
    .contact-card {
        background: rgba(255,255,255,0.03); padding: 15px 20px; border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.08); border-left: 4px solid var(--primary-blue);
    }
    .contact-name { color: #fff; font-weight: 700; display: block; margin-bottom: 6px; font-size: 1rem;}
    .contact-phone { font-size: 0.9rem; color: #94a3b8; display: flex; align-items: center; gap: 8px; }

    .modal-actions { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 10px; }
    .action-btn {
        flex: 1; min-width: 200px; padding: 16px; border-radius: 50px; font-weight: 700;
        display: flex; justify-content: center; align-items: center; gap: 10px;
        text-decoration: none; transition: 0.3s; cursor: pointer; border: none; font-size: 1rem;
    }
    .btn-register { 
        background: var(--primary-blue); color: #fff; 
        box-shadow: 0 5px 20px rgba(59, 130, 246, 0.3);
    }
    .btn-register:hover { box-shadow: 0 0 30px var(--primary-glow); transform: translateY(-2px); }
    .btn-disabled { background: rgba(255,255,255,0.1); color: #94a3b8; cursor: not-allowed; }
    
    .btn-whatsapp { 
        background: transparent; border: 2px solid var(--whatsapp-green); color: var(--whatsapp-green); 
    }
    .btn-whatsapp:hover { 
        background: var(--whatsapp-green); color: #000; 
        box-shadow: 0 0 25px rgba(37, 211, 102, 0.5); transform: translateY(-2px);
    }

    /* --- RADAR CSS --- */
    .radar-container {
        position: relative; width: 300px; height: 300px;
        display: flex; justify-content: center; align-items: center;
        margin-bottom: 40px; border-radius: 50%;
        border: 1px solid rgba(0, 243, 255, 0.2);
        box-shadow: 0 0 40px rgba(0, 243, 255, 0.1), inset 0 0 30px rgba(0, 243, 255, 0.05);
    }
    .radar-grid {
        position: absolute; width: 100%; height: 100%; border-radius: 50%;
        background-image: linear-gradient(rgba(0, 243, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.15) 1px, transparent 1px);
        background-size: 40px 40px; clip-path: circle(50%);
    }
    .radar-sweep {
        position: absolute; width: 100%; height: 100%; border-radius: 50%;
        background: conic-gradient(from 0deg, transparent 0deg, rgba(0, 243, 255, 0.1) 60deg, rgba(0, 243, 255, 0.5) 90deg, transparent 91deg);
        border-right: 2px solid rgba(0, 243, 255, 0.9);
        box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
    }
    .radar-core { width: 12px; height: 12px; background: #fff; border-radius: 50%; box-shadow: 0 0 20px var(--radar-color); z-index: 10; }
    .stay-tuned-text {
        color: #fff; font-size: 2rem; font-weight: 800; text-align: center;
        text-transform: uppercase; text-shadow: 0 5px 20px rgba(0,0,0,0.8);
        letter-spacing: -1px;
    }
    .stay-tuned-text span {
        display: block; background: linear-gradient(90deg, #94a3b8, var(--radar-color), #94a3b8);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-size: 200% auto; animation: shine 4s linear infinite; font-size: 1.4rem; margin-top: 12px; font-weight: 600; letter-spacing: normal;
    }
    @keyframes shine { to { background-position: 200% center; } }

    @media (max-width: 768px) {
        .events-page { padding-top: 100px; }
        .events-grid { grid-template-columns: 1fr; }
        .modal-grid, .contact-list { grid-template-columns: 1fr; }
        .modal-actions { flex-direction: column; }
        .action-btn { width: 100%; }
    }
`;

const Events: React.FC = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEvents(sampleEvents);
            setLoading(false);
        }, 1500); 

        return () => clearTimeout(timer);
    }, []);

    // --- VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
    };

    return (
        <div className="events-page">
            <style>{styles}</style>

            <m.h1 
                className="page-title"
                initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                EVENT <span className="highlight">HORIZON</span>
            </m.h1>

            <AnimatePresence mode="wait">
                {loading ? (
                    <m.div 
                        key="loading"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ color: '#fff', marginTop: '50px', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '1px' }}
                    >
                        INITIALIZING SENSORS...
                    </m.div>
                ) : events.length === 0 ? (
                    // --- NO EVENTS STATE ---
                    <m.div 
                        key="no-events"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}
                    >
                        <HolographicRadar />
                        <h2 className="stay-tuned-text">
                            No Active Signals <br />
                            <span>Stay Tuned for Upcoming Events</span>
                        </h2>
                    </m.div>
                ) : (
                    // --- EVENTS GRID ---
                    <m.div 
                        className="events-grid"
                        variants={containerVariants} initial="hidden" animate="show"
                    >
                        {events.map((event, index) => {
                            // Calculate Reg Status for this specific event
                            const regStatus = getRegistrationStatus(event.date, event.time);

                            return (
                                <m.div 
                                    key={event.id} 
                                    className="event-card"
                                    variants={fadeIn("up", 0.1 * index)}
                                >
                                    <div className="card-header">
                                        <div className="date-badge">
                                            <FaCalendarAlt /> {event.date}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="event-title">{event.title}</h3>
                                        <div className="meta-row">
                                            <div className="meta-item">
                                                <FaClock className="meta-icon"/> {event.time}
                                            </div>
                                            <div className="meta-item">
                                                <FaMapMarkerAlt className="meta-icon"/> {event.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* REGISTRATION DEADLINE INDICATOR */}
                                    <div className="deadline-info" style={{ color: regStatus.color }}>
                                        <FaHourglassHalf /> {regStatus.text}
                                    </div>

                                    <button 
                                        className="view-btn"
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        View Details <FaChevronRight style={{ fontSize: '0.8rem' }}/>
                                    </button>
                                </m.div>
                            );
                        })}
                    </m.div>
                )}
            </AnimatePresence>

            {/* --- DETAILS MODAL --- */}
            <AnimatePresence>
                {selectedEvent && (
                    <m.div 
                        className="modal-overlay" 
                        onClick={() => setSelectedEvent(null)}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <m.div 
                            className="modal-content"
                            variants={modalVariants}
                            initial="hidden" animate="show" exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2 className="modal-title">{selectedEvent.title}</h2>
                                <button className="close-btn" onClick={() => setSelectedEvent(null)}>
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="modal-grid">
                                    <div className="modal-info-box">
                                        <span className="section-label">Date & Time</span>
                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                                            {selectedEvent.date} <br/> <span style={{ fontWeight: '500', color: '#94a3b8', fontSize: '0.95rem' }}>{selectedEvent.time}</span>
                                        </div>
                                    </div>
                                    <div className="modal-info-box">
                                        <span className="section-label">Venue</span>
                                        <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                                            {selectedEvent.location}
                                        </div>
                                    </div>
                                </div>

                                <span className="section-label">About the Event</span>
                                <p className="modal-desc">{selectedEvent.description}</p>

                                {selectedEvent.contactPersons.length > 0 && (
                                    <>
                                        <span className="section-label">Contact Persons</span>
                                        <div className="contact-list">
                                            {selectedEvent.contactPersons.map((person, idx) => (
                                                <div key={idx} className="contact-card">
                                                    <span className="contact-name"><FaUser style={{ marginRight: '6px', color: 'var(--primary-blue)' }}/> {person.name}</span>
                                                    <span className="contact-phone"><FaPhoneAlt size={12}/> {person.phone}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                <div className="modal-actions">
                                    {/* Registration Button - Disabled if deadline passed */}
                                    {(() => {
                                        const status = getRegistrationStatus(selectedEvent.date, selectedEvent.time);
                                        return status.isOpen ? (
                                            <a 
                                                href={selectedEvent.link} 
                                                target="_blank" rel="noopener noreferrer" 
                                                className="action-btn btn-register"
                                            >
                                                Register Now <FaExternalLinkAlt />
                                            </a>
                                        ) : (
                                            <button className="action-btn btn-disabled" disabled>
                                                Registration Closed <FaTimes />
                                            </button>
                                        );
                                    })()}

                                    {selectedEvent.whatsappGroupLink && (
                                        <a 
                                            href={selectedEvent.whatsappGroupLink} 
                                            target="_blank" rel="noopener noreferrer" 
                                            className="action-btn btn-whatsapp"
                                        >
                                            Join WhatsApp Group <FaWhatsapp size={22} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Events;