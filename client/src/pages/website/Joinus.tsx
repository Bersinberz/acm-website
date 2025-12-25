import React, { useState, useEffect } from 'react';
import { motion as m, type Variants } from "framer-motion";
import { FaExternalLinkAlt, FaCalendarAlt, FaClock } from "react-icons/fa";
// Make sure this path matches your project structure
import { getAllRecruitments } from '../../services/website/joinsevice';

// --- TYPES ---
interface Role {
    id: string;
    title: string;
    department: string;
    description: string;
    link: string;
    startDate: string;
    endDate: string;
}

// --- HELPER: DATE FORMATTER ---
const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- HELPER: GET STATUS ---
const getStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return 'UPCOMING';
    if (now > endDate) return 'CLOSED';
    return 'OPEN';
};

const JoinUs: React.FC = () => {
    const [openings, setOpenings] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecruitments = async () => {
            try {
                const res = await getAllRecruitments();
                const recruitments = Array.isArray(res?.recruitments) ? res.recruitments : [];
                
                // Map API data to our Role interface
                const mappedRoles = recruitments.map((r: any) => ({
                    id: r._id,
                    title: r.title,
                    department: r.role,
                    description: r.description,
                    link: `/apply/${r._id}`, // Or r.link if it's an external form
                    startDate: r.startDate, 
                    endDate: r.endDate
                }));

                setOpenings(mappedRoles);
            } catch (err) {
                console.error("Recruitment fetch failed", err);
                setOpenings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitments();
    }, []);

    // --- ANIMATION VARIANTS ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 60 } }
    };

    return (
        <>
            <style>{`
                :root {
                    --primary-blue: #3b82f6;
                    --primary-glow: rgba(59, 130, 246, 0.6);
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                    --success: #10b981;
                    --warning: #f59e0b;
                    --danger: #ef4444;
                }

                .join-page {
                    width: 100%;
                    padding: 120px 20px 60px;
                    display: flex; flex-direction: column; align-items: center;
                    font-family: 'Poppins', sans-serif; position: relative;
                }

                /* --- TYPOGRAPHY --- */
                .page-title {
                    font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900; color: #fff;
                    text-transform: uppercase; margin-bottom: 40px; text-align: center;
                    letter-spacing: -2px; text-shadow: 0 0 30px rgba(0,0,0,0.8);
                }
                .highlight {
                    background: linear-gradient(135deg, #fff 0%, var(--primary-blue) 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 25px var(--primary-glow));
                }

                /* --- NEURAL IDLE ANIMATIC (NO DATA) --- */
                .neural-container {
                    position: relative; width: 320px; height: 320px;
                    display: flex; justify-content: center; align-items: center;
                    margin-bottom: 40px;
                }
                .neural-core {
                    width: 80px; height: 80px;
                    background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
                    border: 1px solid rgba(59, 130, 246, 0.5); border-radius: 50%;
                    box-shadow: 0 0 50px rgba(59, 130, 246, 0.15); z-index: 5;
                    backdrop-filter: blur(5px);
                }
                .gyro-ring { position: absolute; border-radius: 50%; border: 1px solid transparent; }
                .g1 { width: 160px; height: 160px; border-top: 1px solid var(--primary-blue); border-bottom: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 0 15px rgba(59, 130, 246, 0.1); }
                .g2 { width: 240px; height: 240px; border-left: 1px solid var(--primary-blue); border-right: 1px solid rgba(59, 130, 246, 0.2); opacity: 0.6; }
                .g3 { width: 320px; height: 320px; border: 1px dashed rgba(255, 255, 255, 0.1); opacity: 0.4; }

                .stay-tuned-text {
                    color: #fff; font-size: 1.8rem; font-weight: 700;
                    text-align: center; line-height: 1.4; letter-spacing: 1px;
                    text-transform: uppercase; text-shadow: 0 0 20px rgba(0,0,0,0.5); z-index: 10;
                }
                .stay-tuned-text span {
                    display: block;
                    background: linear-gradient(90deg, #94a3b8, #fff, #94a3b8);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-size: 200% auto; animation: shine 5s linear infinite;
                    font-size: 1.3rem; margin-top: 8px; font-weight: 400; letter-spacing: 3px;
                }
                @keyframes shine { to { background-position: 200% center; } }

                /* --- JOB CARDS --- */
                .roles-grid {
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                    gap: 30px; width: 100%; max-width: 1200px;
                }
                .role-card {
                    background: var(--glass-bg); border: 1px solid var(--glass-border);
                    padding: 30px; border-radius: 20px; position: relative; overflow: hidden;
                    transition: 0.3s; display: flex; flex-direction: column;
                    backdrop-filter: blur(10px);
                }
                .role-card:hover {
                    border-color: var(--primary-blue); transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.4); background: rgba(255,255,255,0.05);
                }

                /* Card Header */
                .card-header {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
                }
                .dept-badge {
                    font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;
                    color: #fff; background: rgba(255,255,255,0.1);
                    padding: 6px 12px; border-radius: 6px;
                }
                
                /* Status Badges */
                .status-badge {
                    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
                    padding: 6px 12px; border-radius: 50px; display: flex; align-items: center; gap: 6px;
                }
                .status-open { background: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid rgba(16, 185, 129, 0.3); }
                .status-upcoming { background: rgba(245, 158, 11, 0.15); color: var(--warning); border: 1px solid rgba(245, 158, 11, 0.3); }
                .status-closed { background: rgba(239, 68, 68, 0.15); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }
                .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

                /* Card Body */
                .role-title { font-size: 1.5rem; color: #fff; font-weight: 700; margin-bottom: 10px; line-height: 1.2; }
                .role-desc { color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 25px; flex-grow: 1; }

                /* Card Footer */
                .card-footer {
                    display: flex; justify-content: space-between; align-items: center;
                    border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;
                }
                .date-info { display: flex; flex-direction: column; gap: 2px; }
                .date-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }
                .date-value { font-size: 0.85rem; color: #fff; font-weight: 600; display: flex; align-items: center; gap: 5px; }

                /* Apply Button */
                .apply-btn {
                    padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; font-weight: 600;
                    text-decoration: none; transition: 0.3s; display: flex; align-items: center; gap: 8px;
                    border: none; cursor: pointer;
                }
                
                /* Button States */
                .btn-active {
                    background: var(--primary-blue); color: #fff;
                    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
                }
                .btn-active:hover { background: #2563eb; transform: translateY(-2px); }
                
                .btn-disabled {
                    background: rgba(255,255,255,0.05); color: #64748b;
                    cursor: not-allowed; border: 1px solid rgba(255,255,255,0.05);
                }

                @media (max-width: 768px) {
                    .page-title { font-size: 2.5rem; }
                    .neural-container { transform: scale(0.85); }
                }
            `}</style>

            <div 
                className="join-page"
                style={{
                    height: openings.length === 0 && !loading ? 'calc(100vh - 80px)' : 'auto', 
                    minHeight: '100vh',
                    overflow: openings.length === 0 && !loading ? 'hidden' : 'auto'
                }}
            >
                {/* Show content only after simple loading check */}
                {!loading && (
                    <>
                        {openings.length === 0 ? (
                            // --- NO OPENINGS VIEW ---
                            <m.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                style={{ 
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                                    width: '100%', flex: 1, justifyContent: 'center', marginTop: '-100px' 
                                }}
                            >
                                <div className="neural-container">
                                    <m.div className="neural-core" animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                                    <m.div className="gyro-ring g1" animate={{ rotateX: 360, rotateY: 180, rotateZ: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                                    <m.div className="gyro-ring g2" animate={{ rotateX: -360, rotateZ: -180 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                                    <m.div className="gyro-ring g3" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
                                </div>

                                <h2 className="stay-tuned-text">
                                    Stay tuned for <br />
                                    <span>upcoming Recruitments</span>
                                </h2>
                            </m.div>
                        ) : (
                            // --- JOBS GRID VIEW ---
                            <>
                                <m.h1 
                                    className="page-title"
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    JOIN THE <span className="highlight">CORPS</span>
                                </m.h1>

                                <m.div 
                                    className="roles-grid"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {openings.map((role) => {
                                        const status = getStatus(role.startDate, role.endDate);
                                        const isOpen = status === 'OPEN';
                                        
                                        return (
                                            <m.div key={role.id} className="role-card" variants={itemVariants}>
                                                
                                                {/* Header: Dept + Status Badge */}
                                                <div className="card-header">
                                                    <span className="dept-badge">{role.department}</span>
                                                    
                                                    {status === 'OPEN' && (
                                                        <span className="status-badge status-open">
                                                            <span className="status-dot"></span> Open
                                                        </span>
                                                    )}
                                                    {status === 'UPCOMING' && (
                                                        <span className="status-badge status-upcoming">
                                                            <span className="status-dot"></span> Upcoming
                                                        </span>
                                                    )}
                                                    {status === 'CLOSED' && (
                                                        <span className="status-badge status-closed">
                                                            <span className="status-dot"></span> Closed
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="role-title">{role.title}</h3>
                                                <p className="role-desc">{role.description}</p>

                                                {/* Footer: Date Info + Button */}
                                                <div className="card-footer">
                                                    <div className="date-info">
                                                        <span className="date-label">Timeline</span>
                                                        <span className="date-value">
                                                            <FaCalendarAlt style={{ fontSize: '0.7rem', color: 'var(--primary-blue)' }} /> 
                                                            {formatDate(role.startDate)} - {formatDate(role.endDate)}
                                                        </span>
                                                    </div>

                                                    {isOpen ? (
                                                        <a href={role.link} target="_blank" rel="noopener noreferrer" className="apply-btn btn-active">
                                                            Apply Now <FaExternalLinkAlt style={{ fontSize: '0.8rem' }}/>
                                                        </a>
                                                    ) : (
                                                        <button disabled className="apply-btn btn-disabled">
                                                            {status === 'UPCOMING' ? <><FaClock /> Soon</> : "Closed"}
                                                        </button>
                                                    )}
                                                </div>
                                            </m.div>
                                        );
                                    })}
                                </m.div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default JoinUs;