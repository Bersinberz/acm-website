import { Router } from "express";
import { getDashboardData, syncDashboardData } from "../controllers/DashboardController";

const router = Router();

router.get("/getData", getDashboardData);
router.post("/sync", syncDashboardData);


export default router;
