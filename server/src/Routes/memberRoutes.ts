import express from "express";
import { createMember, getMembers, deleteMember, updateMember } from "../controllers/memberController";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/members/add", upload.single("profilePic"), createMember);
router.get("/members/getAll", getMembers);
router.delete("/members/:id", deleteMember);
router.put("/members/:id", upload.single("profilePic"), updateMember);

export default router;