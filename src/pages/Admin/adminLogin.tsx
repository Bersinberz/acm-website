import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import logo from "../../assets/acm-logo.png";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ variant: "success" | "error"; text: string } | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!username || !password) {
            setMessage({ variant: "error", text: "Please fill in all fields." });
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            if (username === "admin" && password === "admin123") {
                setMessage({ variant: "success", text: "Login successful!" });

                setTimeout(() => {
                    navigate("/dashboard"); 
                }, 1000);

            } else {
                setMessage({ variant: "error", text: "Invalid username or password." });
            }
        }, 1500);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100"
            style={{ background: "#111827" }}
        >
            <Loader loading={loading} />

            <div className="text-center text-white" style={{ width: "350px" }}>

                {/* Logo */}
                <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "80px", marginBottom: "15px" }}
                />

                <h3 className="fw-bold mb-4" style={{ color: "#60a5fa" }}>
                    SIST ACM SIGAI
                </h3>

                {message && (
                    <div className="d-flex justify-content-center mb-3">
                        <Message
                            variant={message.variant}
                            duration={2500}
                            onClose={() => setMessage(null)}
                            dismissible
                            className="w-100"
                        >
                            {message.text}
                        </Message>
                    </div>
                )}

                <form onSubmit={handleLogin} className="text-start">

                    <label className="form-label text-light mb-1">Username</label>
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />

                    <label className="form-label text-light mb-1">Password</label>
                    <input
                        type="password"
                        className="form-control mb-4"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />

                    <div className="d-flex justify-content-center">
                        <button
                            type="submit"
                            className="btn fw-semibold"
                            style={{
                                width: "120px",
                                background: "#2563eb",
                                color: "white",
                                borderRadius: "6px"
                            }}
                            disabled={loading}
                        >
                            Login
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminLogin;