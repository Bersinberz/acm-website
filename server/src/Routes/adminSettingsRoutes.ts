import { Router } from "express";
import {
  getSettings,
  createSettings,
  updateSettings,
  deleteSettings,
} from "../controllers/adminSettingsController";

const router = Router();

router.get("/get", getSettings);
router.put("/update", updateSettings);

export default router;
