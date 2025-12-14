import express, { Application } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import path from "path";
import cors from "cors";
import fs from "fs";
import memberRoutes from "./Routes/memberRoutes";
import eventmanagerRoutes from "./Routes/EventmanagerRoutes"
import recruitmentsRouter from "./Routes/recruitmentRoutes"
import dashboardRoutes from "./Routes/DashboardRoutes"
import adminSettingsRoutes from "./Routes/adminSettingsRoutes";

dotenv.config();

// Connect to MongoDB
connectDB();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const uploadsPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

// Serve uploaded images
app.use("/uploads", express.static(uploadsPath));

// API Routes
app.use("/api/admin/members", memberRoutes);
app.use("/api/admin/eventmanager", eventmanagerRoutes);
app.use("/api/admin/recruitments", recruitmentsRouter)
app.use("/api/admin/dashboard", dashboardRoutes)
app.use("/api/admin/settings", adminSettingsRoutes);

// Root endpoint check
app.get("/", (_, res) => {
    res.json({
        status: "OK",
        message: "ACM SIGAI Backend Running 🚀",
    });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
