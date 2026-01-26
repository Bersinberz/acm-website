import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; 
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import logo from "../../assets/acm-logo.png";
import { adminLogin } from "../../services/admin/authService";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ variant: "success" | "error"; text: string } | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Validation states
    const [errors, setErrors] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({ username: false, password: false });

    // Validation rules
    const validateField = (name: string, value: string) => {
        let error = "";
        switch (name) {
            case "username":
                if (!value.trim()) error = "Username is required";
                else if (value.length < 3) error = "Min 3 characters";
                else if (!/^[a-zA-Z0-9_.-]+$/.test(value)) error = "Invalid characters";
                break;
            case "password":
                if (!value) error = "Password is required";
                else if (value.length < 6) error = "Min 6 characters";
                break;
            default: break;
        }
        return error;
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "username") setUsername(value);
        if (name === "password") setPassword(value);
        if (errors[name as keyof typeof errors] && touched[name as keyof typeof touched]) {
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        const newErrors = {
            username: validateField("username", username),
            password: validateField("password", password)
        };
        setErrors(newErrors);
        setTouched({ username: true, password: true });

        if (newErrors.username || newErrors.password) {
            setMessage({ variant: "error", text: "Please fix the errors below." });
            return;
        }

        try {
            setLoading(true);
            const res = await adminLogin({ username, password });
            if (res.success && res.token) {
                localStorage.setItem("adminToken", res.token);
                setMessage({ variant: "success", text: res.message });
                navigate("/admin/dashboard")
            } else {
                setMessage({ variant: "error", text: res.message });
            }
        } catch (err: any) {
            const serverError = err?.response?.data;
            if (serverError?.field) {
                setErrors(prev => ({ ...prev, [serverError.field]: serverError.message }));
            }
            setMessage({ variant: "error", text: serverError?.message || "Login failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <style>{`
                .login-wrapper {
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at 10% 20%, rgb(15, 23, 42) 0%, rgb(30, 27, 75) 90%);
                    position: relative;
                    overflow: hidden;
                    padding: 20px; /* Prevents card from touching edges on small screens */
                }

                /* Background shapes - adjusted for mobile safety */
                .login-wrapper::before, .login-wrapper::after {
                    content: '';
                    position: absolute;
                    width: 300px; /* Smaller blobs for mobile */
                    height: 300px;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.2;
                    z-index: 0;
                }
                .login-wrapper::before {
                    top: -50px;
                    left: -50px;
                    background: #3b82f6;
                }
                .login-wrapper::after {
                    bottom: -50px;
                    right: -50px;
                    background: #8b5cf6;
                }
                
                .glass-card {
                    position: relative;
                    z-index: 10;
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                    border-radius: 24px;
                    padding: 3rem;
                    width: 100%;
                    max-width: 420px;
                    animation: fadeIn 0.8s ease-out;
                }

                .logo-container {
                    width: 80px; 
                    height: 80px;
                    transition: all 0.3s ease;
                }

                .custom-input-group {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;
                    transition: all 0.3s ease;
                    height: 50px; /* Fixed height for consistency */
                }

                .custom-input-group:focus-within {
                    border-color: #60a5fa;
                    background: rgba(0, 0, 0, 0.4);
                }

                .custom-input-group.error {
                    border-color: #ef4444;
                }

                .form-control-custom {
                    background: transparent;
                    border: none;
                    color: #fff;
                    padding: 10px;
                    width: 100%;
                    outline: none;
                    font-size: 1rem;
                }
                
                .form-control-custom::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                /* Autofill fix */
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active{
                    -webkit-box-shadow: 0 0 0 30px #131522 inset !important;
                    -webkit-text-fill-color: white !important;
                    transition: background-color 5000s ease-in-out 0s;
                }

                .login-btn {
                    background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 12px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    width: 100%;
                    margin-top: 10px;
                    height: 48px;
                }

                /* ----- MOBILE SPECIFIC STYLES ----- */
                @media (max-width: 576px) {
                    .glass-card {
                        padding: 2rem 1.5rem; /* Reduce padding on mobile */
                        border-radius: 20px;
                    }

                    .logo-container {
                        width: 60px; /* Smaller logo */
                        height: 60px;
                        padding: 0.35rem !important; /* Adjust padding inside circle */
                    }

                    h4 {
                        font-size: 1.25rem; /* Smaller title */
                    }

                    .small-text {
                        font-size: 0.8rem;
                    }

                    .custom-input-group {
                        height: 45px; /* Slightly shorter inputs */
                    }
                    
                    .form-control-custom {
                        font-size: 0.95rem; /* Prevent zoom on iOS (needs 16px usually, but 0.95rem is close) */
                    }
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <Loader loading={loading} />

            <div className="glass-card">
                <div className="text-center mb-4">
                    <div className="logo-container d-inline-flex align-items-center justify-content-center bg-white rounded-circle p-2 mb-3 shadow-lg">
                        <img src={logo} alt="Logo" style={{ width: "100%", objectFit: 'contain' }} />
                    </div>
                    <h4 className="fw-bold text-white mb-1">Welcome Back</h4>
                    <p className="small small-text text-white-50">SIST ACM SIGAI Student Chapter</p>
                </div>

                {message && (
                    <div className="mb-4">
                        <Message
                            variant={message.variant}
                            onClose={() => setMessage(null)}
                        >
                            {message.text}
                        </Message>
                    </div>
                )}

                <form onSubmit={handleLogin} noValidate>
                    {/* Username Field */}
                    <div className="mb-3">
                        <div className={`custom-input-group ${touched.username && errors.username ? 'error' : ''}`}>
                            <i className="bi bi-person text-white-50 fs-5"></i>
                            <input
                                type="text"
                                name="username"
                                className="form-control-custom"
                                placeholder="Username"
                                value={username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                                autoComplete="off"
                            />
                        </div>
                        {touched.username && errors.username && (
                            <small className="text-danger mt-1 d-block ms-2 animate__animated animate__fadeIn">
                                {errors.username}
                            </small>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <div className={`custom-input-group ${touched.password && errors.password ? 'error' : ''}`}>
                            <i className="bi bi-lock text-white-50 fs-5"></i>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control-custom"
                                placeholder="Password"
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            <i 
                                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-white-50 p-2`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowPassword(prev => !prev)}
                            ></i>
                        </div>
                        {touched.password && errors.password && (
                            <small className="text-danger mt-1 d-block ms-2 animate__animated animate__fadeIn">
                                {errors.password}
                            </small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn text-white login-btn shadow-lg"
                        disabled={loading || !username || !password}
                    >
                        {loading ? (
                            <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Authenticating...</span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;