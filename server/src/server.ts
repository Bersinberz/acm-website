import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import cors from "cors";
import fs from "fs";
import rateLimit from "express-rate-limit";
import adminAuthRoutes from "./routes/adminAuthRoutes";
import homeRoutes from "./routes/homeRoutes";
import adminSettingsRoutes from "./routes/adminSettingsRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import contactRoutes from "./routes/contactRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import eventmanagerRoutes from "./routes/eventmanagerRoutes";
import memberRoutes from "./routes/memberRoutes";
import recruitmentRoutes from "./routes/recruitmentRoutes";
import aboutRoute from "./routes/aboutRoute";
import joinusRoute from "./routes/joinusRoute";
import eventRoute from "./routes/eventRoute";


// Silence dotenv logs
process.env.DOTENV_CONFIG_QUIET = "true";

const NODE_ENV = process.env.NODE_ENV;

const envFile =
    NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({
    path: path.resolve(process.cwd(), envFile),
});


const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const app: Application = express();

app.use((req, res, next) => {
    res.setTimeout(30_000, () => {
        res.status(408).json({
            success: false,
            message: "Request timeout"
        });
    });
    next();
});

// ========== SECURITY MIDDLEWARE ==========
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    if (isProduction) {
        res.setHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }

    next();
});

// Enable CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Stricter limit for auth endpoints
    message: {
        success: false,
        message: "Too many login attempts, please try again after 15 minutes"
    },
});

// ========== BASIC MIDDLEWARE ==========
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ========== FILE UPLOADS DIRECTORY ==========
const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// Serve uploaded files
app.use("/uploads", express.static(uploadsPath));

// ========== ROUTES WITH RATE LIMITING ==========
app.use("/api/admin/auth", authLimiter, adminAuthRoutes);
app.use("/api/admin", apiLimiter);

// Public routes
app.use("/api/home", homeRoutes);
app.use("/api/about", aboutRoute);
app.use("/api/joinus", joinusRoute);
app.use("/api/events", eventRoute);

// Protected admin routes
app.use("/api/admin/members", memberRoutes);
app.use("/api/admin/eventmanager", eventmanagerRoutes);
app.use("/api/admin/recruitments", recruitmentRoutes);
app.use("/api/admin/applications", applicationRoutes)
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/contacts", contactRoutes)
app.use("/api/admin/settings", adminSettingsRoutes);

// ========== HEALTH CHECK ==========
app.get("/api", (_, res) => {
    res.json({
        status: "OK",
        message: "ACM SIGAI Backend Running",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

app.get("/api/health", async (_, res) => {
    const mongoose = (await import("mongoose")).default;

    res.status(200).json({
        status: "healthy",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
    });
});
// ========== ERROR HANDLING ==========
// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        method: req.method,
    });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", {
        error: err.message,
        url: req.originalUrl,
        method: req.method,
    });

    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(500).json({
        success: false,
        message: message,
    });
});

const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

    try {
        const mongoose = (await import("mongoose")).default;
        await mongoose.connection.close();
        console.log("🗄️ MongoDB connection closed");
    } catch (err) {
        console.error("Error closing MongoDB", err);
    }

    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1); // Let Docker restart
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;

(async () => {
    try {
        console.log("────────────────────────────────────────────");
        console.log("🚀 Starting ACM SIGAI Backend...");
        console.log("────────────────────────────────────────────");

        console.log(`🧭 Mode        : ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}`);
        console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
        console.log(`🔌 Port        : ${PORT}`);
        console.log(`📁 Upload Dir  : ${process.env.UPLOAD_DIR}`);

        await connectDB();
        console.log("🗄️  MongoDB    : Connected successfully");

        app.listen(PORT, () => {
            console.log("────────────────────────────────────────────");
            console.log(`✅ Server Status : RUNNING`);
            console.log(`🏥 Health Check  : http://localhost:${PORT}/api/health`);

            if (isDevelopment) {
                console.log(`🧪 Dev API Root  : http://localhost:${PORT}/api`);
                console.log("🔁 Hot Reload   : ENABLED");
            }

            if (isProduction) {
                console.log("🛡️  Security    : Production hardened");
                console.log("📦 Logs         : Minimal");
            }

            console.log(`⏱️  Started At  : ${new Date().toLocaleString()}`);
            console.log("────────────────────────────────────────────\n");
        });

    } catch (error) {
        console.error("❌ Server failed to start");
        console.error(error);
        process.exit(1);
    }
})();