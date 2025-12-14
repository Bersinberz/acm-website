import { Router } from "express";
import {
    createRecruitment,
    deleteRecruitment,
    getAllRecruitments,
    toggleRecruitmentStatus,
    updateRecruitment
} from "../controllers/recruitmentController";


const router = Router();

/* CRUD */
router.get("/getall", getAllRecruitments);
router.post("/add", createRecruitment);
router.put("/:id/update", updateRecruitment);
router.delete("/:id/delete", deleteRecruitment);

/* Open / Close */
router.patch("/:id/status", toggleRecruitmentStatus);

export default router;
