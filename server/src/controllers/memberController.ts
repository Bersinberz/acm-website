import { Request, Response } from "express";
import Member from "../models/Member";
import fs from "fs";
import path from "path";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const createMember = async (req: MulterRequest, res: Response) => {
    try {
        const { name, designation, batch, linkedin, instagram, facebook } = req.body;

        if (!name || !designation || !batch)
            return res.status(400).json({ message: "Required fields missing" });

        if (!req.file)
            return res.status(400).json({ message: "Image upload failed" });

        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const member = await Member.create({
            name,
            designation,
            batch,
            imageUrl,
            social: { linkedin, instagram, facebook }
        });

        return res.status(201).json(member);

    } catch (error: any) {
        console.error("Create Member Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
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
        if (!member) return res.status(404).json({ message: "Member not found" });

        const { name, designation, batch, linkedin, instagram, facebook } = req.body;

        // UPDATE TEXT FIELDS
        if (name) member.name = name;
        if (designation) member.designation = designation;
        if (batch) member.batch = batch;

        if (linkedin !== undefined) member.social.linkedin = linkedin;
        if (instagram !== undefined) member.social.instagram = instagram;
        if (facebook !== undefined) member.social.facebook = facebook;

        // UPDATE IMAGE (IF NEW FILE UPLOADED)
        if (req.file) {
            // DELETE OLD IMAGE
            if (member.imageUrl) {
                const oldImage = member.imageUrl.split("/uploads/")[1];
                const oldPath = path.join(__dirname, "../../uploads", oldImage);

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // SAVE NEW IMAGE
            member.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        await member.save();

        res.json(member);

    } catch (error: any) {
        console.error("Update Member Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
