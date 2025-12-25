import { Request, Response } from "express";
import Member from "../models/Member";
import fs from "fs";
import sharp from "sharp";
import path from "path";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const createMember = async (req: MulterRequest, res: Response) => {
  try {
    const { name, designation, batch, linkedin, instagram, facebook } = req.body;

    if (!name || !designation || !batch) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Cropped image upload failed" });
    }

    // Ensure uploads directory
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
    const filePath = path.join(uploadDir, filename);

    await sharp(req.file.buffer)
      .resize(522, 747, {
        fit: "cover", // fills the frame
        position: "center",
      })
      .jpeg({ quality: 85 })
      .toFile(filePath);

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;

    const member = await Member.create({
      name,
      designation,
      batch,
      imageUrl,
      social: { linkedin, instagram, facebook },
    });

    res.status(201).json(member);
  } catch (error: any) {
    console.error("Create Member Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member)
      return res.status(404).json({ message: "Member not found" });

    await member.deleteOne();
    res.json({ message: "Member deleted" });

  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateMember = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const { name, designation, batch, linkedin, instagram, facebook } = req.body;

    /* ─────────── UPDATE TEXT FIELDS ─────────── */
    if (name) member.name = name;
    if (designation) member.designation = designation;
    if (batch) member.batch = batch;

    if (!member.social) {
      member.social = {};
    }

    if (linkedin !== undefined) {
      if (linkedin === "") {
        member.social.linkedin = undefined; // ❌ delete
      } else {
        member.social.linkedin = linkedin;
      }
    }

    if (instagram !== undefined) {
      if (instagram === "") {
        member.social.instagram = undefined;
      } else {
        member.social.instagram = instagram;
      }
    }

    if (facebook !== undefined) {
      if (facebook === "") {
        member.social.facebook = undefined;
      } else {
        member.social.facebook = facebook;
      }
    }

    /* ─────────── UPDATE IMAGE (IF PROVIDED) ─────────── */
    if (req.file) {
      const uploadDir = path.join(__dirname, "../../uploads");

      // Ensure uploads directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Delete old image
      if (member.imageUrl) {
        const oldImage = member.imageUrl.split("/uploads/")[1];
        if (oldImage) {
          const oldPath = path.join(uploadDir, oldImage);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }

      // Generate new filename
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
      const filePath = path.join(uploadDir, filename);

      // Resize & save new image
      await sharp(req.file.buffer)
        .resize(522, 747, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 85 })
        .toFile(filePath);

      member.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${filename}`;
    }

    await member.save();

    res.json(member);
  } catch (error: any) {
    console.error("Update Member Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};