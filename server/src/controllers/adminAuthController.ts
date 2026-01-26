import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    /* ---------------- CORE VALIDATION ---------------- */
    // Basic required check
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Trim username (not password, as spaces might be part of password)
    const trimmedUsername = username.trim();

    // Username validation
    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters",
        field: "username"
      });
    }

    if (trimmedUsername.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Username must be less than 50 characters",
        field: "username"
      });
    }

    // Username pattern validation (letters, numbers, dots, hyphens, underscores)
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return res.status(400).json({
        success: false,
        message: "Username can only contain letters, numbers, dots, hyphens, and underscores",
        field: "username"
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
        field: "password"
      });
    }

    if (password.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Password is too long",
        field: "password"
      });
    }

    /* ---------------- FIND ADMIN ---------------- */
    const admin = await Admin.findOne({ username: trimmedUsername });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is disabled",
      });
    }

    /* ---------------- PASSWORD CHECK (PLAIN TEXT) ---------------- */
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    /* ---------------- JWT TOKEN ---------------- */
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET || "acm_sigai_super_secret_key",
      {
        expiresIn: "1d",
      }
    );

    /* ---------------- SUCCESS ---------------- */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};