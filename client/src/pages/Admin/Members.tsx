import { useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

interface Member {
    name: string;
    designation: string;
    batch: string;
    profilePic: string;
    social: {
        linkedin?: string;
        instagram?: string;
        facebook?: string;
    };
}

type ToastVariant = "info" | "success" | "error" | "warning";

interface ToastState {
    show: boolean;
    text: string;
    variant: ToastVariant;
}

const membersData: Member[] = [
    {
        name: "Rahul Kumar",
        designation: "CHAIRPERSON",
        batch: "2022–2026",
        profilePic: "https://ui-avatars.com/api/?name=Rahul+Kumar&background=0D8ABC&color=fff",
        social: {
            linkedin: "https://linkedin.com",
            instagram: "https://instagram.com",
            facebook: "https://facebook.com",
        },
    },
    {
        name: "Priya Sharma",
        designation: "VICE CHAIRPERSON",
        batch: "2021–2025",
        profilePic: "https://ui-avatars.com/api/?name=Priya+Sharma&background=6c757d&color=fff",
        social: { instagram: "#" },
    },
    {
        name: "Ankit Verma",
        designation: "Volunteer Unit",
        batch: "2023–2027",
        profilePic: "https://ui-avatars.com/api/?name=Ankit+Verma&background=28a745&color=fff",
        social: { instagram: "#" },
    },
];

// Canvas crop function
const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Canvas is empty');
                return;
            }
            const fileUrl = URL.createObjectURL(blob);
            resolve(fileUrl);
        }, 'image/jpeg');
    });
};

const Members = () => {
    const [activePage, setActivePage] = useState("Members");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [members, setMembers] = useState<Member[]>(membersData);
    const [newMember, setNewMember] = useState<Member>({
        name: "",
        designation: "",
        batch: "",
        profilePic: "",
        social: {
            linkedin: "",
            instagram: "",
            facebook: ""
        }
    });
    const [imagePreview, setImagePreview] = useState<string>("");

    // New state for crop modal
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string>("");
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    // New states for loader and toast
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        text: "",
        variant: "info"
    });

    const navigate = useNavigate();
    const handleLogout = () => navigate("/admin/login");

    const toggleExpand = (index: number) => {
        setExpandedRow(index === expandedRow ? null : index);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Instead of setting preview immediately, open crop modal
                setImageToCrop(result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setNewMember({
            name: "",
            designation: "",
            batch: "",
            profilePic: "",
            social: { linkedin: "", instagram: "", facebook: "" }
        });
        setImagePreview("");
    };

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        if (!croppedAreaPixels || !imageToCrop) {
            setShowCropModal(false);
            return;
        }

        try {
            setLoading(true);
            await new Promise(r => setTimeout(r, 700));

            const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);

            // Set the cropped image as preview and profile picture
            setImagePreview(croppedImage);
            setNewMember({ ...newMember, profilePic: croppedImage });

            // Close crop modal
            setShowCropModal(false);
            // Reset crop state
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);

        } catch (e) {
            console.error('Error cropping image:', e);
            setShowCropModal(false);
            showToast("Failed to crop image", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
    };

    const showToast = (
        text: string,
        variant: ToastVariant = "info",
        duration: number = 3000
    ) => {
        setToast({ show: true, text, variant });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, duration);
    };

    const handleAddMember = async () => {
        if (!newMember.name.trim() || !newMember.designation.trim() || !newMember.batch.trim()) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            await new Promise(r => setTimeout(r, 700));

            // If no image uploaded, use default avatar
            if (!newMember.profilePic.trim()) {
                const nameForAvatar = newMember.name.trim() || "New Member";
                newMember.profilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=1f2937&color=fff`;
            }

            setMembers([...members, newMember]);

            // Reset form
            setNewMember({
                name: "",
                designation: "",
                batch: "",
                profilePic: "",
                social: {
                    linkedin: "",
                    instagram: "",
                    facebook: ""
                }
            });
            setImagePreview("");
            setShowModal(false);

            showToast("Member added successfully", "success");
        } catch (error) {
            showToast("Failed to add member", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex vh-100"
            style={{ background: "#1f2937", color: "#e5e7eb", overflowY: "auto" }}
        >
            {/* --- INJECTED STYLES --- */}
            <style>{`
                /* Glassmorphism Card Style */
                .member-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    overflow: hidden;
                }

                .member-card:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                }

                /* Smooth Expand Animation using Grid Grid Trick */
                .expandable-wrapper {
                    display: grid;
                    grid-template-rows: 0fr;
                    transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .expandable-wrapper.open {
                    grid-template-rows: 1fr;
                }

                .expandable-inner {
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
                }

                .expandable-wrapper.open .expandable-inner {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Icon Rotation */
                .chevron-icon {
                    transition: transform 0.4s ease;
                }
                .chevron-icon.rotate {
                    transform: rotate(180deg);
                }

                /* Social Icon Hover Effects */
                .social-icon {
                    transition: transform 0.2s, color 0.2s;
                }
                .social-icon:hover {
                    transform: scale(1.2);
                    filter: brightness(1.2);
                }

                /* --- MODAL ANIMATIONS --- */
                @keyframes modalBackdropFade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes modalPopIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.95) translateY(-20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1) translateY(0); 
                    }
                }

                .modal.show {
                    animation: modalBackdropFade 0.3s ease-out forwards;
                }

                .modal.show .modal-dialog {
                    animation: modalPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                /* --- CROP MODAL STYLES --- */
                .crop-container {
                    position: relative;
                    width: 100%;
                    height: 400px;
                    background: #2d3748;
                    border-radius: 8px;
                    overflow: hidden;
                }

                /* Transparent grid overlay for crop boundary */
                .crop-boundary-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 522px;
                    height: 747px;
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                    border: 2px dashed rgba(255, 255, 255, 0.3);
                    pointer-events: none;
                    z-index: 10;
                }

                /* Responsive crop boundary */
                @media (max-width: 768px) {
                    .crop-boundary-overlay {
                        width: 300px;
                        height: 429px;
                    }
                }

                /* Zoom control */
                .zoom-control {
                    margin: 20px 0;
                }

                .zoom-slider {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: #4a5568;
                    outline: none;
                    -webkit-appearance: none;
                }

                .zoom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                }

                .zoom-slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #3b82f6;
                    cursor: pointer;
                    border: none;
                }
                .crop-modal {
                    z-index: 2000 !important;
                }
                .crop-modal .modal-dialog {
                    z-index: 2001 !important;
                }
                select option[disabled] {
                    color: #95a9bcff !important;
                    font-style: italic;
                }
            `}</style>

            <Sidebar
                active={activePage}
                onSelect={(page) => setActivePage(page)}
                onLogout={handleLogout}
            />

            {/* MAIN CONTENT */}
            <div className="flex-grow-1 p-4 p-md-5">

                <header className="mb-5 border-bottom border-secondary pb-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="fw-bold text-white">Team Members</h2>
                        <p className="text-secondary mb-0">Manage organization hierarchy</p>
                    </div>
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus-circle"></i> Add Member
                    </button>
                </header>

                <div className="d-flex flex-column gap-3">
                    {members.map((member, index) => {
                        const isOpen = expandedRow === index;

                        return (
                            <div
                                key={index}
                                className={`member-card rounded-3 shadow-sm ${isOpen ? 'border-primary border-opacity-50' : ''}`}
                            >
                                {/* --- Card Header--- */}
                                <div
                                    className="p-3 d-flex justify-content-between align-items-center"
                                    onClick={() => toggleExpand(index)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        {/* Profile Pic */}
                                        <div className="col-auto">
                                            <img
                                                src={member.profilePic}
                                                alt={member.name}
                                                className="rounded-circle border border-2 border-secondary"
                                                width="50"
                                                height="50"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>

                                        <div>
                                            <h5 className="mb-2 fw-bold text-white fs-5">{member.name}</h5>
                                            <div className="d-flex gap-2 align-items-center">
                                                <span className="badge bg-primary bg-opacity-25 text-primary-emphasis" style={{ fontSize: '0.75rem' }}>
                                                    {member.designation}
                                                </span>
                                                <small className="text-secondary" style={{ fontSize: '0.8rem' }}>
                                                    {member.batch}
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="btn btn-link text-secondary text-decoration-none p-0">
                                        <i className={`chevron-icon fs-5 ${isOpen ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                                    </button>
                                </div>

                                {/* --- Expandable Content --- */}
                                <div className={`expandable-wrapper ${isOpen ? "open" : ""}`}>
                                    <div className="expandable-inner">
                                        <div className="p-3 pt-0">
                                            <hr className="border-secondary opacity-25 my-2" />

                                            <div className="row mt-3 align-items-center">

                                                {/* Details */}
                                                <div className="col">
                                                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">

                                                        {/* Social Links */}
                                                        <div>
                                                            <h6 className="text-uppercase text-secondary small fw-bold mb-2">Connect</h6>
                                                            <div className="d-flex gap-3 fs-5 bg-dark bg-opacity-50 px-3 py-1 rounded-pill">
                                                                {member.social.linkedin && (
                                                                    <a href={member.social.linkedin} className="social-icon text-info" target="_blank" rel="noreferrer">
                                                                        <i className="bi bi-linkedin"></i>
                                                                    </a>
                                                                )}
                                                                {member.social.instagram && (
                                                                    <a href={member.social.instagram} className="social-icon text-danger" target="_blank" rel="noreferrer">
                                                                        <i className="bi bi-instagram"></i>
                                                                    </a>
                                                                )}
                                                                {member.social.facebook && (
                                                                    <a href={member.social.facebook} className="social-icon text-primary" target="_blank" rel="noreferrer">
                                                                        <i className="bi bi-facebook"></i>
                                                                    </a>
                                                                )}
                                                                {!member.social.linkedin && !member.social.instagram && !member.social.facebook && (
                                                                    <span className="text-secondary fs-6">No links</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="d-flex gap-2">
                                                            <button className="btn btn-sm btn-outline-info d-flex align-items-center gap-2">
                                                                <i className="bi bi-pencil-square"></i> Edit
                                                            </button>
                                                            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2">
                                                                <i className="bi bi-trash"></i> Delete
                                                            </button>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                {/* End Expandable */}

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Crop Modal */}
            <div className={`modal fade crop-modal ${showCropModal ? "show d-block" : ""}`}
                style={{ backgroundColor: showCropModal ? "rgba(0,0,0,0.85)" : "transparent" }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-light border border-secondary shadow-lg">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title fw-bold">Adjust Photo</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={handleCropCancel}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="crop-container">
                                <Cropper
                                    image={imageToCrop}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={522 / 747}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="rect"
                                    showGrid={false}
                                    style={{
                                        containerStyle: {
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                        },
                                        cropAreaStyle: {
                                            border: '2px solid rgba(255, 255, 255, 0.5)',
                                        }
                                    }}
                                />
                                <div className="crop-boundary-overlay"></div>
                            </div>
                            <div className="zoom-control">
                                <label className="form-label d-flex justify-content-between">
                                    <span>Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </label>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="zoom-slider"
                                />
                            </div>
                        </div>
                        <div className="modal-footer border-secondary">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCropCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleCropSave}
                            >
                                Save Crop
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Member Modal */}
            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.6)' : 'transparent' }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content bg-dark text-light border border-secondary shadow-lg">
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title fw-bold">Add New Member</h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={handleModalClose}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {/* Left Column - Image Upload */}
                                <div className="col-md-4 mb-3 mb-md-0 d-flex justify-content-center align-items-center">
                                    <div className="d-flex flex-column align-items-center">
                                        <div
                                            className="border border-secondary mb-3"
                                            style={{
                                                width: "150px",
                                                height: "215px",
                                                overflow: "hidden",
                                                borderRadius: "6px",
                                                backgroundColor: "#2d3748"
                                            }}
                                        >
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            ) : (
                                                <i className="bi bi-person text-secondary fs-1"></i>
                                            )}
                                        </div>
                                        {imagePreview ? (
                                            <label className="btn btn-outline-warning btn-sm">
                                                <i className="bi bi-pencil-square me-2"></i> Edit Photo
                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        ) : (
                                            <label className="btn btn-outline-light btn-sm">
                                                <i className="bi bi-upload me-2"></i> Upload Photo
                                                <input
                                                    type="file"
                                                    className="d-none"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        )}
                                        <small className="text-secondary mt-2">JPEG, PNG up to 2MB</small>
                                    </div>
                                </div>

                                {/* Right Column - Form Fields */}
                                <div className="col-md-8">
                                    <div className="mb-3">
                                        <label className="form-label">Name *</label>
                                        <input
                                            type="text"
                                            className="form-control bg-secondary border-secondary text-light"
                                            value={newMember.name}
                                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Designation *</label>
                                        <select
                                            className="form-select bg-secondary border-secondary text-light"
                                            value={newMember.designation}
                                            onChange={(e) =>
                                                setNewMember({ ...newMember, designation: e.target.value })
                                            }
                                        >
                                            <option value="" disabled>
                                                Select designation
                                            </option>
                                            <option value="Chairperson">Chairperson</option>
                                            <option value="Vice Chairperson">Vice Chairperson</option>
                                            <option value="Treasurer">Treasurer</option>
                                            <option value="Secretary">Secretary</option>
                                            <option value="Core Team Member">Core Team Member</option>
                                            <option value="HOD CSE">HOD CSE</option>
                                            <option value="Associate Professor">Associate Professor</option>
                                            <option value="Research Unit">Research Unit</option>
                                            <option value="Media Unit">Media Unit</option>
                                            <option value="Volunteer Unit">Volunteer Unit</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Batch *</label>
                                        <select
                                            className="form-select bg-secondary border-secondary text-light"
                                            value={newMember.batch}
                                            onChange={(e) => setNewMember({ ...newMember, batch: e.target.value })}
                                        >
                                            <option value="" disabled>Select batch</option>
                                            <option value="2024–2025">2024–2025</option>
                                            <option value="2025–2026">2025–2026</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">LinkedIn</label>
                                        <input
                                            type="text"
                                            className="form-control bg-secondary border-secondary text-light"
                                            value={newMember.social.linkedin}
                                            onChange={(e) => setNewMember({
                                                ...newMember,
                                                social: { ...newMember.social, linkedin: e.target.value }
                                            })}
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Instagram</label>
                                        <input
                                            type="text"
                                            className="form-control bg-secondary border-secondary text-light"
                                            value={newMember.social.instagram}
                                            onChange={(e) => setNewMember({
                                                ...newMember,
                                                social: { ...newMember.social, instagram: e.target.value }
                                            })}
                                            placeholder="https://instagram.com/username"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Facebook</label>
                                        <input
                                            type="text"
                                            className="form-control bg-secondary border-secondary text-light"
                                            value={newMember.social.facebook}
                                            onChange={(e) => setNewMember({
                                                ...newMember,
                                                social: { ...newMember.social, facebook: e.target.value }
                                            })}
                                            placeholder="https://facebook.com/username"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-secondary">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleAddMember}
                            >
                                <i className="bi bi-plus-circle me-2"></i> Add Member
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loader and Message components */}
            <Loader loading={loading} variant="orbit" />
            <Message
                show={toast.show}
                variant={toast.variant}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
                position="top-right"
            >
                {toast.text}
            </Message>
        </div>
    );
};

export default Members;