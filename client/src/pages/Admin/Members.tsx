import { useState, useCallback, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { createMember, getMembers, deleteMember, updateMember } from "../../services/admin/membersService";

interface Member {
    _id?: string;
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
    const [members, setMembers] = useState<Member[]>([]);
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

    // New state for crop modal
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string>("");
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editMember, setEditMember] = useState<Member | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string>("");
    const [editImageCropMode, setEditImageCropMode] = useState(false);

    // New states for loader and toast
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        text: "",
        variant: "info"
    });

    // NEW: Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDesignation, setFilterDesignation] = useState("");
    const [filterBatch, setFilterBatch] = useState("");

    // Generate unique designations and batches from members
    const uniqueDesignations = useMemo(() => {
        const designations = members.map(m => m.designation);
        return Array.from(new Set(designations)).sort();
    }, [members]);

    const uniqueBatches = useMemo(() => {
        const batches = members.map(m => m.batch);
        return Array.from(new Set(batches)).sort();
    }, [members]);

    // Filtering logic
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            // Search by name (case-insensitive, partial match)
            const matchesSearch = searchTerm === "" ||
                member.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Filter by designation
            const matchesDesignation = filterDesignation === "" ||
                member.designation === filterDesignation;

            // Filter by batch
            const matchesBatch = filterBatch === "" ||
                member.batch === filterBatch;

            return matchesSearch && matchesDesignation && matchesBatch;
        });
    }, [members, searchTerm, filterDesignation, filterBatch]);

    const handleEditClick = (member: Member) => {
        setEditMember(member);
        setEditImagePreview(member.profilePic);
        setShowEditModal(true);
    };

    const confirmDelete = async () => {
        if (!memberToDelete?._id) return;
        try {
            setLoading(true);
            await deleteMember(memberToDelete._id);

            setMembers(prev => prev.filter(m => m._id !== memberToDelete._id));

            showToast("Member deleted successfully!", "success");
        } catch (err) {
            showToast("Failed to delete member", "error");
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setMemberToDelete(null);
        }
    };

    useEffect(() => {
        const loadMembers = async () => {
            try {
                setLoading(true);
                const data = await getMembers();

                setMembers(
                    data.map((m: any) => ({
                        name: m.name,
                        designation: m.designation,
                        batch: m.batch,
                        profilePic: m.imageUrl,
                        social: {
                            linkedin: m.linkedin,
                            instagram: m.instagram,
                            facebook: m.facebook
                        },
                        _id: m._id
                    }))
                );
            } catch (error) {
                showToast("Failed to load members", "error");
            } finally {
                setLoading(false);
            }
        };

        loadMembers();
    }, []);

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
            if (editImageCropMode) {
                setEditImagePreview(croppedImage);
                setEditMember({ ...editMember!, profilePic: croppedImage });
                setEditImageCropMode(false);
            } else {
                setImagePreview(croppedImage);
                setNewMember({ ...newMember, profilePic: croppedImage });
            }


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
            showToast("Please fill all required fields", "error");
            return;
        }

        try {
            setLoading(true);

            let fileToUpload: File | null = null;

            // Convert cropped blob URL → File (for FormData)
            if (newMember.profilePic) {
                const response = await fetch(newMember.profilePic);
                const blob = await response.blob();
                fileToUpload = new File([blob], `${newMember.name.replace(" ", "_")}.jpg`, { type: "image/jpeg" });
            }

            // Prepare API payload
            const payload = {
                name: newMember.name,
                designation: newMember.designation,
                batch: newMember.batch,
                profilePic: fileToUpload,
                linkedin: newMember.social.linkedin,
                instagram: newMember.social.instagram,
                facebook: newMember.social.facebook,
            };

            const result = await createMember(payload);

            setMembers((prev) => [
                ...prev,
                {
                    name: result.name,
                    designation: result.designation,
                    batch: result.batch,
                    profilePic: result.imageUrl, // must return from backend
                    social: {
                        linkedin: result.linkedin,
                        instagram: result.instagram,
                        facebook: result.facebook,
                    }
                }
            ]);

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

            showToast("Member added successfully!", "success");

        } catch (error) {
            console.error(error);
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

                .delete-modal-backdrop {
                    background: rgba(0,0,0,0.65);
                    animation: fadeIn 0.3s ease-out;
                }

                .delete-modal-animate {
                    animation: scaleIn 0.28s cubic-bezier(0.34, 1.5, 0.64, 1);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from { transform: scale(0.85); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>


            {showDeleteModal && (
                <div className="modal fade show d-block delete-modal-backdrop" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-light border border-secondary delete-modal-animate">

                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-danger fw-bold">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    Confirm Delete
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowDeleteModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <p className="mb-2">
                                    Are you sure you want to delete <strong>{memberToDelete?.name}</strong>?
                                </p>
                                <p className="text-secondary small">
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="modal-footer border-secondary">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                >
                                    <i className="bi bi-trash me-2"></i> Delete
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

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

                {/* NEW: Filter Section */}
                <div className="row mb-4 g-3">
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text bg-secondary border-secondary text-light">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control bg-secondary border-secondary text-light"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="btn btn-outline-secondary text-light"
                                    onClick={() => setSearchTerm("")}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select bg-secondary border-secondary text-light"
                            value={filterDesignation}
                            onChange={(e) => setFilterDesignation(e.target.value)}
                        >
                            <option value="">All Designations</option>
                            {uniqueDesignations.map((designation, index) => (
                                <option key={index} value={designation}>
                                    {designation}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select bg-secondary border-secondary text-light"
                            value={filterBatch}
                            onChange={(e) => setFilterBatch(e.target.value)}
                        >
                            <option value="">All Batches</option>
                            {uniqueBatches.map((batch, index) => (
                                <option key={index} value={batch}>
                                    {batch}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filter summary */}
                {(searchTerm || filterDesignation || filterBatch) && (
                    <div className="mb-3 p-3 bg-dark bg-opacity-50 rounded border border-secondary">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-secondary">Showing {filteredMembers.length} of {members.length} members</span>
                                <div className="mt-1 d-flex gap-2 flex-wrap">
                                    {searchTerm && (
                                        <span className="badge bg-info bg-opacity-25 text-info">
                                            Search: "{searchTerm}"
                                        </span>
                                    )}
                                    {filterDesignation && (
                                        <span className="badge bg-primary bg-opacity-25 text-primary">
                                            Designation: {filterDesignation}
                                        </span>
                                    )}
                                    {filterBatch && (
                                        <span className="badge bg-warning bg-opacity-25 text-warning">
                                            Batch: {filterBatch}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterDesignation("");
                                    setFilterBatch("");
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}

                <div className="d-flex flex-column gap-3">
                    {/* UPDATED: Use filteredMembers instead of members */}
                    {filteredMembers.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-people-fill fs-1 text-secondary"></i>
                            <p className="mt-3 text-secondary">No members found matching your filters.</p>
                            {(searchTerm || filterDesignation || filterBatch) && (
                                <button
                                    className="btn btn-outline-secondary mt-2"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterDesignation("");
                                        setFilterBatch("");
                                    }}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredMembers.map((member, index) => {
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
                                                                <button
                                                                    className="btn btn-sm btn-outline-info d-flex align-items-center gap-2"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditClick(member);
                                                                    }}
                                                                >
                                                                    <i className="bi bi-pencil-square"></i> Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setMemberToDelete(member);
                                                                        setShowDeleteModal(true);
                                                                    }}
                                                                >
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
                        })
                    )}
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
            {showEditModal && editMember && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content bg-dark text-light border border-secondary shadow-lg">

                            <div className="modal-header border-secondary">
                                <h5 className="modal-title fw-bold">Edit Member</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="row">

                                    {/* LEFT COLUMN — PHOTO */}
                                    <div className="col-md-4 d-flex flex-column align-items-center">
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
                                            {editImagePreview ? (
                                                <img
                                                    src={editImagePreview}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: "cover" }}
                                                />
                                            ) : (
                                                <i className="bi bi-person text-secondary fs-1"></i>
                                            )}
                                        </div>

                                        <label className="btn btn-outline-warning btn-sm">
                                            <i className="bi bi-pencil-square me-2"></i> Change Photo
                                            <input
                                                type="file"
                                                className="d-none"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setImageToCrop(reader.result as string);
                                                            setEditImageCropMode(true);
                                                            setShowCropModal(true);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* RIGHT COLUMN — FORM */}
                                    <div className="col-md-8">
                                        <div className="mb-3">
                                            <label className="form-label">Name *</label>
                                            <input
                                                type="text"
                                                className="form-control bg-secondary border-secondary text-light"
                                                value={editMember.name}
                                                onChange={(e) =>
                                                    setEditMember({ ...editMember, name: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Designation *</label>
                                            <select
                                                className="form-select bg-secondary border-secondary text-light"
                                                value={editMember.designation}
                                                onChange={(e) =>
                                                    setEditMember({ ...editMember, designation: e.target.value })
                                                }
                                            >
                                                <option disabled>Select designation</option>
                                                <option value="Chairperson">Chairperson</option>
                                                <option value="Vice Chairperson">Vice Chairperson</option>
                                                <option value="Treasurer">Treasurer</option>
                                                <option value="Secretary">Secretary</option>
                                                <option value="Core Team Member">Core Team Member</option>
                                                <option value="HOD CSE">HOD CSE</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Batch *</label>
                                            <select
                                                className="form-select bg-secondary border-secondary text-light"
                                                value={editMember.batch}
                                                onChange={(e) =>
                                                    setEditMember({ ...editMember, batch: e.target.value })
                                                }
                                            >
                                                <option disabled>Select batch</option>
                                                <option value="2024–2025">2024–2025</option>
                                                <option value="2025–2026">2025–2026</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">LinkedIn</label>
                                            <input
                                                type="text"
                                                className="form-control bg-secondary border-secondary text-light"
                                                value={editMember.social.linkedin}
                                                onChange={(e) =>
                                                    setEditMember({
                                                        ...editMember,
                                                        social: { ...editMember.social, linkedin: e.target.value }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Instagram</label>
                                            <input
                                                type="text"
                                                className="form-control bg-secondary border-secondary text-light"
                                                value={editMember.social.instagram}
                                                onChange={(e) =>
                                                    setEditMember({
                                                        ...editMember,
                                                        social: { ...editMember.social, instagram: e.target.value }
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Facebook</label>
                                            <input
                                                type="text"
                                                className="form-control bg-secondary border-secondary text-light"
                                                value={editMember.social.facebook}
                                                onChange={(e) =>
                                                    setEditMember({
                                                        ...editMember,
                                                        social: { ...editMember.social, facebook: e.target.value }
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="modal-footer border-secondary">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        try {
                                            setLoading(true);

                                            let fileToUpload: File | null = null;

                                            if (editImagePreview !== editMember.profilePic) {
                                                const res = await fetch(editImagePreview);
                                                const blob = await res.blob();
                                                fileToUpload = new File([blob], "updated.jpg", {
                                                    type: "image/jpeg",
                                                });
                                            }

                                            const updated = await updateMember(editMember._id!, {
                                                name: editMember.name,
                                                designation: editMember.designation,
                                                batch: editMember.batch,
                                                linkedin: editMember.social.linkedin,
                                                instagram: editMember.social.instagram,
                                                facebook: editMember.social.facebook,
                                                profilePic: fileToUpload || undefined
                                            });

                                            // Update UI list
                                            setMembers(prev =>
                                                prev.map(m =>
                                                    m._id === updated._id ? updated : m
                                                )
                                            );

                                            showToast("Member updated!", "success");
                                            setShowEditModal(false);
                                        } catch (err) {
                                            showToast("Failed to update member", "error");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

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