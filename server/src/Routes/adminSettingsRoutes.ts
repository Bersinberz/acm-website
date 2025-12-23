import { Router } from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/adminSettingsController";

const router = Router();

router.get("/get", getSettings);
router.put("/update", updateSettings);

export default router;
