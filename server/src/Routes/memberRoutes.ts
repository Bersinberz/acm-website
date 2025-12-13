import express from "express";
import { createMember, getMembers, deleteMember, updateMember } from "../controllers/memberController";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/add", upload.single("profilePic"), createMember);
router.get("/getAll", getMembers);
router.delete("/:id", deleteMember);
router.put("/:id", upload.single("profilePic"), updateMember);

export default router;