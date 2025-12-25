import { Request, Response } from "express";
import Recruitment, { IRecruitment } from "../models/recruitments";

/* ---------------- GET ALL ---------------- */
export const getAllRecruitments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recruitments = await Recruitment.find({ isOpen: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      recruitments,
    });
  } catch (error) {
    console.error("Get recruitments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruitments",
    });
  }
};
