import { Request, Response } from "express";
import Recruitment, { IRecruitment } from "../models/recruitments";

/* ---------------- GET ALL ---------------- */
export const getAllRecruitments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recruitments: IRecruitment[] = await Recruitment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      recruitments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch recruitments",
    });
  }
};

/* ---------------- CREATE ---------------- */
export const createRecruitment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const recruitment = await Recruitment.create(req.body);

    res.status(201).json(recruitment);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create recruitment",
    });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateRecruitment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const updated = await Recruitment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Recruitment not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update recruitment",
    });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteRecruitment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deleted = await Recruitment.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Recruitment not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Recruitment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete recruitment",
    });
  }
};

/* ---------------- OPEN / CLOSE ---------------- */
export const toggleRecruitmentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isOpen } = req.body as { isOpen: boolean };

    const updated = await Recruitment.findByIdAndUpdate(
      id,
      { isOpen },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: "Recruitment not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update recruitment status",
    });
  }
};
