import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import {
    getAdminSettings,
    updateAdminSettings,
} from "../../services/admin/settingsService";

/* ---------------- COMPONENT ---------------- */
const AdminSettings: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState<{
        show: boolean;
        variant: "success" | "error" | "info" | "warning";
        message: string;
        title?: string;
    } | null>(null);

    /* ---------------- STATE ---------------- */
    const [orgName, setOrgName] = useState("");

    const [contact, setContact] = useState({
        location: "",
        email: "",
        phone: "",
    });

    const [socials, setSocials] = useState({
        instagram: "",
        linkedin: "",
        twitter: "",
    });

    const [about, setAbout] = useState("");
    const [mission, setMission] = useState("");
    const [vision, setVision] = useState("");
    const [ideology, setIdeology] = useState("");

    /* ---------------- LOAD SETTINGS ---------------- */
    useEffect(() => {
        const loadSettings = async () => {
            const start = Date.now();

            try {
                setLoading(true);

                const data = await getAdminSettings();

                setOrgName(data.orgName);
                setContact(data.contact);
                setSocials({
                    instagram: data.socials?.instagram ?? "",
                    linkedin: data.socials?.linkedin ?? "",
                    twitter: data.socials?.twitter ?? "",
                });
                setAbout(data.about ?? "");
                setMission(data.mission ?? "");
                setVision(data.vision ?? "");
                setIdeology(data.ideology ?? "");
            } catch {
                setToast({
                    show: true,
                    variant: "error",
                    title: "Error",
                    message: "Failed to load settings",
                });
            } finally {
                const elapsed = Date.now() - start;
                const MIN_LOADING_TIME = 500; // ms

                if (elapsed < MIN_LOADING_TIME) {
                    setTimeout(() => setLoading(false), MIN_LOADING_TIME - elapsed);
                } else {
                    setLoading(false);
                }
            }
        };

        loadSettings();
    }, []);


    /* ---------------- SAVE HANDLER ---------------- */
    const handleSave = async () => {
        try {
            setLoading(true);

            await updateAdminSettings({
                orgName,
                about,
                mission,
                vision,
                ideology,
                contact,
                socials,
            });
            setToast({
                show: true,
                variant: "success",
                title: "Saved",
                message: "Settings updated successfully",
            });
        } catch {
            setToast({
                show: true,
                variant: "error",
                title: "Error",
                message: "Failed to save settings",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout
            active="Settings"
            loading={loading}
            toast={toast ?? undefined}
            onCloseToast={() => setToast(null)}
        >
            <div className="p-2">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="fw-bold text-white mb-1">Admin Settings</h1>
                    <p className="text-secondary">
                        Manage organization details and website information.
                    </p>
                </div>

                <div className="row g-4">
                    {/* ---------------- GENERAL ---------------- */}
                    <div className="col-12">
                        <div className="glass-panel p-4">
                            <h5 className="fw-bold text-white mb-4">
                                <i className="bi bi-building text-primary me-2"></i>
                                General Information
                            </h5>

                            {/* Organization Name */}
                            <div className="mb-4">
                                <label className="form-label text-secondary">
                                    Organization Name
                                </label>
                                <input
                                    className="form-control bg-dark text-white border-secondary"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                />
                            </div>

                            {/* ABOUT */}
                            <div className="mb-4">
                                <label className="form-label text-secondary">
                                    About SIST ACM SIGAI
                                </label>
                                <textarea
                                    rows={6}
                                    className="form-control bg-dark text-white border-secondary"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                />
                            </div>

                            {/* MISSION */}
                            <div className="mb-4">
                                <label className="form-label text-secondary">
                                    Our Mission
                                </label>
                                <textarea
                                    rows={4}
                                    className="form-control bg-dark text-white border-secondary"
                                    value={mission}
                                    onChange={(e) => setMission(e.target.value)}
                                />
                            </div>

                            {/* VISION */}
                            <div className="mb-4">
                                <label className="form-label text-secondary">
                                    Our Vision
                                </label>
                                <textarea
                                    rows={4}
                                    className="form-control bg-dark text-white border-secondary"
                                    value={vision}
                                    onChange={(e) => setVision(e.target.value)}
                                />
                            </div>

                            {/* IDEOLOGY */}
                            <div>
                                <label className="form-label text-secondary">
                                    Our Ideology
                                </label>
                                <textarea
                                    rows={6}
                                    className="form-control bg-dark text-white border-secondary"
                                    value={ideology}
                                    onChange={(e) => setIdeology(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>


                    {/* ---------------- CONTACT INFO ---------------- */}
                    <div className="col-12 col-lg-6">
                        <div className="glass-panel p-4 h-100">
                            <h5 className="fw-bold text-white mb-3">
                                <i className="bi bi-telephone-fill text-primary me-2"></i>
                                Contact Information
                            </h5>

                            <div className="mb-3">
                                <label className="form-label text-secondary">Location</label>
                                <input
                                    className="form-control bg-dark text-white border-secondary"
                                    value={contact.location}
                                    onChange={(e) =>
                                        setContact({ ...contact, location: e.target.value })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary">Email</label>
                                <input
                                    type="email"
                                    className="form-control bg-dark text-white border-secondary"
                                    value={contact.email}
                                    onChange={(e) =>
                                        setContact({ ...contact, email: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="form-label text-secondary">Phone</label>
                                <input
                                    className="form-control bg-dark text-white border-secondary"
                                    value={contact.phone}
                                    onChange={(e) =>
                                        setContact({ ...contact, phone: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* ---------------- SOCIAL LINKS ---------------- */}
                    <div className="col-12 col-lg-6">
                        <div className="glass-panel p-4 h-100">
                            <h5 className="fw-bold text-white mb-3">
                                <i className="bi bi-share-fill text-primary me-2"></i>
                                Social Media Links
                            </h5>

                            {[
                                { key: "instagram", label: "Instagram" },
                                { key: "linkedin", label: "LinkedIn" },
                                { key: "twitter", label: "Twitter / X" },
                            ].map((item) => (
                                <div className="mb-3" key={item.key}>
                                    <label className="form-label text-secondary">{item.label}</label>
                                    <input
                                        className="form-control bg-dark text-white border-secondary"
                                        value={(socials as any)[item.key]}
                                        onChange={(e) =>
                                            setSocials({
                                                ...socials,
                                                [item.key]: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ---------------- WEBSITE CREDITS ---------------- */}
                    <div className="col-12 col-lg-6">
                        <div className="glass-panel p-4 h-100">
                            <h5 className="fw-bold text-white mb-3">
                                <i className="bi bi-award-fill text-warning me-2"></i>
                                Website Credits
                            </h5>

                            <div className="mb-3">
                                <span className="text-secondary">Website Developed By</span>
                                <div className="text-white fw-semibold">
                                    ADITYA SAI TEJA B
                                </div>
                            </div>

                            <div className="mb-3">
                                <span className="text-secondary">Designed By</span>
                                <div className="text-white fw-semibold">
                                    MANISRI VENKATESH
                                </div>
                            </div>

                            <div>
                                <span className="text-secondary">Backend Development</span>
                                <div className="text-white fw-semibold">
                                    BHUVANESH, DEVENDRA REDDY, BERSIN, RAM PRADEEP
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="mt-4">
                    <div
                        className="d-flex justify-content-end align-items-center px-4 py-3"
                        style={{
                            background: "rgba(17, 24, 39, 0.95)", // darker than page
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                            position: "sticky",
                            bottom: 0,
                            zIndex: 10,
                        }}
                    >
                        <button
                            className="btn px-5 py-2 fw-semibold"
                            onClick={handleSave}
                            disabled={loading}
                            style={{
                                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                                color: "#ffffff",
                                border: "none",
                                boxShadow: "0 8px 20px rgba(59,130,246,0.45)",
                            }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-save me-2"></i>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;