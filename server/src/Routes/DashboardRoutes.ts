import { Router } from "express";
import { getDashboardData, syncDashboardData } from "../controllers/dashboardController";

const router = Router();

router.get("/getData", getDashboardData);
router.post("/sync", syncDashboardData);


export default router;
