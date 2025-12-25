import { Router } from "express";
import { getAllRecruitments } from "../controllers/joinusController";

const router = Router();

router.get("/getall", getAllRecruitments);


export default router;